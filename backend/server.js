const path = require('path');
const fs = require('fs');

// Optional settings file (backend/.env). It is fine if it does not exist.
try { process.loadEnvFile(path.join(__dirname, '.env')); } catch (e) { /* no .env file */ }

const express = require('express');
const { load, save } = require('./store');
const { ROLES, LEVELS, getQuestions, findQuestion } = require('./data/questions');
const { QUIZZES } = require('./data/quizzes');
const { PROBLEMS } = require('./data/problems');
const { evaluate } = require('./evaluate');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const SKILL_KEYS = ['communication', 'technical', 'problemSolving', 'structure'];

app.use(express.json({ limit: '100kb' }));

// ---------- helpers ----------
const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const avg = (list) => (list.length ? Math.round(list.reduce((a, b) => a + b, 0) / list.length) : null);
const clamp = (v) => Math.max(0, Math.min(100, Math.round(Number(v) || 0)));

function logActivity(db, type, count) {
  db.activity.push({ date: ymd(new Date()), type, count });
}

function calcStreak(dates) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (!dates.has(ymd(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (dates.has(ymd(d))) {
    n += 1;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

// ---------- general ----------
app.get('/api/meta', (req, res) => {
  res.json({ roles: ROLES, levels: LEVELS, aiEnabled: Boolean(process.env.ANTHROPIC_API_KEY) });
});

app.get('/api/stats', (req, res) => {
  const db = load();
  const activity = {};
  db.activity.forEach((a) => { activity[a.date] = (activity[a.date] || 0) + a.count; });

  let skills = null;
  let weakest = null;
  if (db.sessions.length) {
    skills = {};
    SKILL_KEYS.forEach((k) => { skills[k] = avg(db.sessions.map((s) => s.skills[k])); });
    weakest = SKILL_KEYS.reduce((a, b) => (skills[b] < skills[a] ? b : a));
  }

  const dayNumber = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  const daily = PROBLEMS[dayNumber % PROBLEMS.length];

  res.json({
    interviews: db.sessions.length,
    avgScore: avg(db.sessions.map((s) => s.avgScore)),
    quizzes: db.quizAttempts.length,
    solved: new Set(db.solved.map((s) => s.id)).size,
    streak: calcStreak(new Set(Object.keys(activity))),
    todayCount: activity[ymd(new Date())] || 0,
    activity,
    skills,
    weakest,
    recent: db.sessions.slice(-5).reverse(),
    dailyChallenge: {
      id: daily.id,
      title: daily.title,
      difficulty: daily.difficulty,
      solved: db.solved.some((s) => s.id === daily.id),
    },
  });
});

app.get('/api/history', (req, res) => {
  const db = load();
  const items = [];
  db.sessions.forEach((s) => items.push({
    id: s.id, kind: 'Interview', title: s.role, detail: s.level + ', ' + s.count + ' questions', score: s.avgScore, at: s.at,
  }));
  db.quizAttempts.forEach((q) => items.push({
    id: q.id, kind: 'Quiz', title: q.title, detail: q.score + ' of ' + q.total + ' correct', score: Math.round((q.score / q.total) * 100), at: q.at,
  }));
  items.sort((a, b) => (a.at < b.at ? 1 : -1));
  res.json(items);
});

// ---------- interview ----------
app.get('/api/interview/questions', (req, res) => {
  const { role, level } = req.query;
  if (!ROLES.includes(role) || !LEVELS.includes(level)) return res.status(400).json({ error: 'Choose a role and a level.' });
  res.json(getQuestions(role, level).map((q) => ({ id: q.id, text: q.text })));
});

app.post('/api/interview/evaluate', async (req, res, next) => {
  try {
    const { questionId, answer } = req.body || {};
    const q = findQuestion(questionId);
    if (!q) return res.status(404).json({ error: 'Question not found.' });
    if (typeof answer !== 'string' || answer.trim().length < 3 || answer.length > 4000) {
      return res.status(400).json({ error: 'Write an answer between 3 and 4000 characters.' });
    }
    res.json(await evaluate(q, answer.trim(), q.level));
  } catch (e) {
    next(e);
  }
});

app.post('/api/interview/finish', (req, res) => {
  const { role, level, results } = req.body || {};
  if (!ROLES.includes(role) || !LEVELS.includes(level) || !Array.isArray(results) || results.length < 1 || results.length > 10) {
    return res.status(400).json({ error: 'The interview data was not valid.' });
  }
  const clean = results.map((r) => {
    const skills = {};
    SKILL_KEYS.forEach((k) => { skills[k] = clamp(r.skills && r.skills[k]); });
    return { score: clamp(r.score), skills };
  });
  const skills = {};
  SKILL_KEYS.forEach((k) => { skills[k] = avg(clean.map((r) => r.skills[k])); });

  const now = new Date();
  const session = { id: uid(), at: now.toISOString(), date: ymd(now), role, level, count: clean.length, avgScore: avg(clean.map((r) => r.score)), skills };
  const db = load();
  db.sessions.push(session);
  logActivity(db, 'interview', clean.length);
  save(db);
  res.json(session);
});

// ---------- quizzes ----------
app.get('/api/quizzes', (req, res) => {
  const db = load();
  res.json(QUIZZES.map((q) => {
    const percents = db.quizAttempts.filter((a) => a.quizId === q.id).map((a) => Math.round((a.score / a.total) * 100));
    return {
      id: q.id, title: q.title, topic: q.topic, difficulty: q.difficulty, count: q.questions.length,
      best: percents.length ? Math.max(...percents) : null,
    };
  }));
});

app.get('/api/quizzes/:id', (req, res) => {
  const quiz = QUIZZES.find((q) => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });
  res.json({
    id: quiz.id, title: quiz.title, topic: quiz.topic, difficulty: quiz.difficulty,
    questions: quiz.questions.map((q) => ({ text: q.text, options: q.options })),
  });
});

app.post('/api/quizzes/:id/submit', (req, res) => {
  const quiz = QUIZZES.find((q) => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });
  const answers = Array.isArray(req.body && req.body.answers) ? req.body.answers : [];
  const correct = quiz.questions.map((q) => q.answer);
  const score = correct.filter((c, i) => answers[i] === c).length;

  const now = new Date();
  const db = load();
  db.quizAttempts.push({ id: uid(), at: now.toISOString(), date: ymd(now), quizId: quiz.id, title: quiz.title, score, total: correct.length });
  logActivity(db, 'quiz', 1);
  save(db);
  res.json({ score, total: correct.length, correct });
});

// ---------- coding problems ----------
app.get('/api/problems', (req, res) => {
  const db = load();
  const solved = new Set(db.solved.map((s) => s.id));
  res.json(PROBLEMS.map((p) => ({ id: p.id, title: p.title, difficulty: p.difficulty, topic: p.topic, solved: solved.has(p.id) })));
});

app.get('/api/problems/:id', (req, res) => {
  const p = PROBLEMS.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Problem not found.' });
  res.json(p);
});

app.post('/api/problems/:id/solved', (req, res) => {
  const p = PROBLEMS.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Problem not found.' });
  const db = load();
  const firstTime = !db.solved.some((s) => s.id === p.id);
  if (firstTime) {
    db.solved.push({ id: p.id, date: ymd(new Date()) });
    logActivity(db, 'problem', 1);
    save(db);
  }
  res.json({ ok: true, firstTime });
});

// ---------- website files ----------
const dist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(path.join(dist, 'index.html'))) {
  app.use(express.static(dist));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(dist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('The website is not built yet. Stop the server, run "npm run setup" in the interview-coach folder, then run "npm start".');
  });
}

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(err.status || 500).json({ error: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log('');
  console.log('  Rehearse is running.');
  console.log('  Open this in your browser:  http://localhost:' + PORT);
  console.log('  AI scoring: ' + (process.env.ANTHROPIC_API_KEY ? 'on' : 'off (offline keyword scoring is used)'));
  console.log('');
});
