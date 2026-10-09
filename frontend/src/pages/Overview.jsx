import { Link } from 'react-router-dom';
import { useApi } from '../api.js';
import Heatmap from '../components/Heatmap.jsx';
import Icon from '../components/Icon.jsx';
import SkillBars from '../components/SkillBars.jsx';
import { ErrorBox, Loading } from '../components/Notice.jsx';

const SKILL_NAMES = {
  communication: 'communication',
  technical: 'technical knowledge',
  problemSolving: 'problem solving',
  structure: 'answer structure',
};

const TIPS = {
  communication: 'Practice giving longer, clearer answers out loud.',
  technical: 'Review the core concepts, then retry the questions you missed.',
  problemSolving: 'Explain how you would approach each problem, step by step.',
  structure: 'Answer in this order: what it is, why it matters, then an example.',
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

export default function Overview() {
  const { data: s, error, loading } = useApi('/api/stats');
  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} />;

  const fresh = s.interviews === 0 && s.quizzes === 0 && s.solved === 0;
  const stats = [
    ['Interviews done', s.interviews],
    ['Average score', s.avgScore === null ? '–' : s.avgScore + '%'],
    ['Quizzes taken', s.quizzes],
    ['Problems solved', s.solved],
    ['Day streak', s.streak],
  ];

  return (
    <div>
      <header className="page-head">
        <div>
          <h1>{greeting()}.</h1>
          <p>
            {fresh
              ? 'Start with one short interview. Your progress will appear here.'
              : 'You have done ' + s.todayCount + (s.todayCount === 1 ? ' activity' : ' activities') + ' today.'}
          </p>
        </div>
        <Link to="/interview" className="btn primary">
          <Icon name="interview" size={16} /> Start new interview
        </Link>
      </header>

      <section className="grid-stats">
        {stats.map(([label, value]) => (
          <div className="card stat" key={label}>
            <div className="v">{value}</div>
            <div className="l">{label}</div>
          </div>
        ))}
      </section>

      <section className="card">
        <h2>Daily activity</h2>
        <p className="muted small">Each square is a day. Interview answers, quizzes and solved problems all count. A darker green means a busier day.</p>
        <Heatmap activity={s.activity} />
      </section>

      <section className="two">
        <div className="card">
          <h2>Skill breakdown</h2>
          {s.skills ? (
            <>
              <SkillBars skills={s.skills} />
              <p className="focus">
                Focus next: <strong>{SKILL_NAMES[s.weakest]}</strong>. {TIPS[s.weakest]}
              </p>
            </>
          ) : (
            <p className="muted">Finish one practice interview to see how you score on each skill.</p>
          )}
        </div>

        <div className="card">
          <h2>Daily challenge</h2>
          <p className="challenge-title">{s.dailyChallenge.title}</p>
          <p>
            <span className={'badge ' + s.dailyChallenge.difficulty}>{s.dailyChallenge.difficulty}</span>{' '}
            <span className="muted">{s.dailyChallenge.solved ? 'Solved. Come back tomorrow for a new one.' : 'A new problem every day.'}</span>
          </p>
          <Link to={'/problems/' + s.dailyChallenge.id} className="btn">
            <Icon name="code" size={16} /> {s.dailyChallenge.solved ? 'Open again' : 'Solve it'}
          </Link>
        </div>
      </section>

      <section className="card spaced">
        <h2>Recent interviews</h2>
        {s.recent.length === 0 ? (
          <p className="muted">No interviews yet. Pick a role and answer your first question.</p>
        ) : (
          <ul className="list">
            {s.recent.map((r) => (
              <li key={r.id}>
                <span>
                  <strong>{r.role}</strong> <span className="muted">{r.level}</span>
                </span>
                <span className="muted">{formatDate(r.at)}</span>
                <span className="score-pill">{r.avgScore}%</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
