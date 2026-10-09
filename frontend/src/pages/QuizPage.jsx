import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, useApi } from '../api.js';
import { ErrorBox, Loading } from '../components/Notice.jsx';

export default function QuizPage() {
  const { id } = useParams();
  const { data, error, loading } = useApi('/api/quizzes/' + id);
  const [picked, setPicked] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} />;

  const answeredAll = data.questions.every((_, i) => picked[i] !== undefined);

  async function submit() {
    setBusy(true);
    setProblem('');
    try {
      const answers = data.questions.map((_, i) => (picked[i] === undefined ? -1 : picked[i]));
      setResult(await api.post('/api/quizzes/' + id + '/submit', { answers }));
      window.scrollTo({ top: 0 });
    } catch (e) {
      setProblem(e.message);
    }
    setBusy(false);
  }

  function retry() {
    setPicked({});
    setResult(null);
    window.scrollTo({ top: 0 });
  }

  return (
    <div>
      <header className="page-head">
        <div>
          <h1>{data.title}</h1>
          <p>{data.topic}, {data.difficulty}</p>
        </div>
        <Link to="/quizzes" className="btn">All quizzes</Link>
      </header>

      {result && (
        <section className="card result-card">
          <div className="score-big">{result.score} of {result.total}</div>
          <p className="muted">{result.score === result.total ? 'Perfect score.' : 'Review the answers below, then try again.'}</p>
          <div className="actions">
            <button type="button" className="btn primary" onClick={retry}>Try again</button>
          </div>
        </section>
      )}

      {data.questions.map((q, qi) => (
        <section className="card spaced" key={q.text}>
          <p className="question small-q">{qi + 1}. {q.text}</p>
          <div className="options">
            {q.options.map((opt, oi) => {
              let cls = 'option';
              if (result) {
                if (oi === result.correct[qi]) cls += ' right';
                else if (picked[qi] === oi) cls += ' wrong';
              } else if (picked[qi] === oi) {
                cls += ' on';
              }
              return (
                <button key={opt} type="button" className={cls} disabled={Boolean(result)} onClick={() => setPicked({ ...picked, [qi]: oi })}>
                  {opt}
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {!result && (
        <div className="actions">
          <button type="button" className="btn primary" onClick={submit} disabled={!answeredAll || busy}>
            {busy ? 'Checking…' : 'Check my answers'}
          </button>
          {!answeredAll && <span className="muted small">Answer every question to continue.</span>}
        </div>
      )}
      {problem && <p className="field-error">{problem}</p>}
    </div>
  );
}
