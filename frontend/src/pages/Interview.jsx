import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, useApi } from '../api.js';
import Icon from '../components/Icon.jsx';
import SkillBars from '../components/SkillBars.jsx';
import { ErrorBox, Loading } from '../components/Notice.jsx';

const LEVELS = [
  ['beginner', 'Beginner', 'Core concepts and definitions.'],
  ['intermediate', 'Intermediate', 'Situations from real projects.'],
  ['advanced', 'Advanced', 'Design, performance and tricky cases, with follow-up questions.'],
];

function verdict(score) {
  if (score >= 80) return 'Strong answer';
  if (score >= 60) return 'Good answer';
  if (score >= 40) return 'Needs more work';
  return 'Keep practicing';
}

export default function Interview() {
  const meta = useApi('/api/meta');
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('beginner');
  const [phase, setPhase] = useState('setup');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  useEffect(() => () => {
    if (recRef.current) recRef.current.stop();
  }, []);

  if (meta.loading) return <Loading />;
  if (meta.error) return <ErrorBox message={meta.error} />;

  const chosenRole = role || meta.data.roles[0];

  function stopMic() {
    if (recRef.current) {
      recRef.current.stop();
      recRef.current = null;
    }
    setListening(false);
  }

  function startMic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setError('Voice input works in Chrome or Edge. You can type your answer instead.');
      return;
    }
    setError('');
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en-US';
    const base = answer ? answer.trim() + ' ' : '';
    rec.onresult = (e) => {
      let text = '';
      for (let i = 0; i < e.results.length; i += 1) text += e.results[i][0].transcript + ' ';
      setAnswer(base + text.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  }

  async function start() {
    setBusy(true);
    setError('');
    try {
      const qs = await api.get('/api/interview/questions?role=' + encodeURIComponent(chosenRole) + '&level=' + level);
      setQuestions(qs);
      setIndex(0);
      setAnswer('');
      setResult(null);
      setResults([]);
      setSummary(null);
      setPhase('question');
    } catch (e) {
      setError(e.message);
    }
    setBusy(false);
  }

  async function submitAnswer() {
    if (answer.trim().length < 5) {
      setError('Write a few words before you submit.');
      return;
    }
    stopMic();
    setBusy(true);
    setError('');
    try {
      const r = await api.post('/api/interview/evaluate', { questionId: questions[index].id, answer });
      setResult(r);
      setResults((prev) => [...prev, { questionId: questions[index].id, score: r.score, skills: r.skills }]);
    } catch (e) {
      setError(e.message);
    }
    setBusy(false);
  }

  async function next() {
    setError('');
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setAnswer('');
      setResult(null);
      return;
    }
    setBusy(true);
    try {
      const s = await api.post('/api/interview/finish', { role: chosenRole, level, results });
      setSummary(s);
      setPhase('summary');
    } catch (e) {
      setError(e.message);
    }
    setBusy(false);
  }

  if (phase === 'setup') {
    return (
      <div>
        <header className="page-head">
          <div>
            <h1>Practice interview</h1>
            <p>Choose a role and a level. You will get three questions, one at a time.</p>
          </div>
        </header>

        <section className="card">
          <h2>Role</h2>
          <div className="choice-grid">
            {meta.data.roles.map((r) => (
              <button key={r} type="button" className={'choice' + (chosenRole === r ? ' on' : '')} onClick={() => setRole(r)}>
                <strong>{r}</strong>
              </button>
            ))}
          </div>
        </section>

        <section className="card spaced">
          <h2>Level</h2>
          <div className="choice-grid">
            {LEVELS.map(([value, label, text]) => (
              <button key={value} type="button" className={'choice' + (level === value ? ' on' : '')} onClick={() => setLevel(value)}>
                <strong>{label}</strong>
                <span>{text}</span>
              </button>
            ))}
          </div>
        </section>

        <p className="muted small">
          {meta.data.aiEnabled
            ? 'AI scoring is on.'
            : 'Answers are scored offline with keyword checks. Add an API key in backend/.env to turn on AI scoring.'}
        </p>
        {error && <p className="field-error">{error}</p>}
        <button type="button" className="btn primary" onClick={start} disabled={busy}>
          <Icon name="play" size={16} /> {busy ? 'Starting…' : 'Start interview'}
        </button>
      </div>
    );
  }

  if (phase === 'summary') {
    return (
      <div>
        <header className="page-head">
          <div>
            <h1>Interview complete</h1>
            <p>{chosenRole}, {level}</p>
          </div>
        </header>
        <section className="card">
          <div className="score-big">{summary.avgScore}%</div>
          <p className="muted">Average score across {summary.count} questions</p>
          <SkillBars skills={summary.skills} />
        </section>
        <div className="actions">
          <button type="button" className="btn primary" onClick={() => setPhase('setup')}>Practice again</button>
          <Link to="/" className="btn">Back to overview</Link>
        </div>
      </div>
    );
  }

  const isLast = index + 1 === questions.length;

  return (
    <div>
      <header className="page-head">
        <div>
          <h1>Question {index + 1} of {questions.length}</h1>
          <p>{chosenRole}, {level}</p>
        </div>
      </header>

      <section className="card">
        <p className="question">{questions[index].text}</p>
        <textarea
          className="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer, or press the microphone and speak."
          disabled={Boolean(result)}
          aria-label="Your answer"
        />
        {error && <p className="field-error">{error}</p>}
        {!result && (
          <div className="actions">
            <button type="button" className="btn primary" onClick={submitAnswer} disabled={busy}>
              {busy ? 'Scoring…' : 'Submit answer'}
            </button>
            <button type="button" className={'btn' + (listening ? ' live' : '')} onClick={listening ? stopMic : startMic}>
              <Icon name="mic" size={16} /> {listening ? 'Stop listening' : 'Speak your answer'}
            </button>
          </div>
        )}
      </section>

      {result && (
        <section className="card spaced">
          <div className="score-row">
            <div className="score-big">{result.score}%</div>
            <div>
              <h2>{verdict(result.score)}</h2>
              <p className="muted small">{result.mode === 'ai' ? 'Scored by AI' : 'Scored offline with keyword checks'}</p>
            </div>
          </div>
          <SkillBars skills={result.skills} />

          {result.strengths.length > 0 && (
            <>
              <h3>What went well</h3>
              <ul className="plain">{result.strengths.map((t) => <li key={t}>{t}</li>)}</ul>
            </>
          )}
          {result.improvements.length > 0 && (
            <>
              <h3>How to improve</h3>
              <ul className="plain">{result.improvements.map((t) => <li key={t}>{t}</li>)}</ul>
            </>
          )}
          <h3>A strong answer sounds like this</h3>
          <p className="sample">{result.sample}</p>
          {result.followUp && <p className="followup">{result.followUp}</p>}

          <div className="actions">
            <button type="button" className="btn primary" onClick={next} disabled={busy}>
              {isLast ? 'Finish interview' : 'Next question'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
