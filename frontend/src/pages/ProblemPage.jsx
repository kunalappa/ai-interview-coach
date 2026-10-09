import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, useApi } from '../api.js';
import Icon from '../components/Icon.jsx';
import { runTests } from '../runner.js';
import { ErrorBox, Loading } from '../components/Notice.jsx';

export default function ProblemPage() {
  const { id } = useParams();
  const { data, error, loading } = useApi('/api/problems/' + id);
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const [solvedMsg, setSolvedMsg] = useState('');

  useEffect(() => {
    if (data) {
      setCode(data.starter);
      setOutcome(null);
      setSolvedMsg('');
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} />;

  async function run() {
    setRunning(true);
    setOutcome(null);
    setSolvedMsg('');
    const out = await runTests(code, data.fnName, data.tests);
    setOutcome(out);
    setRunning(false);
    if (out.results && out.results.every((r) => r.ok)) {
      try {
        const r = await api.post('/api/problems/' + id + '/solved');
        setSolvedMsg(r.firstTime ? 'Solved. This counts toward your daily activity.' : 'Solved again. It was already counted.');
      } catch (e) {
        setSolvedMsg('All tests passed, but the result could not be saved.');
      }
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const t = e.target;
      const s = t.selectionStart;
      setCode(code.slice(0, s) + '  ' + code.slice(t.selectionEnd));
      requestAnimationFrame(() => {
        t.selectionStart = s + 2;
        t.selectionEnd = s + 2;
      });
    }
  }

  const passed = outcome && outcome.results ? outcome.results.filter((r) => r.ok).length : 0;

  return (
    <div>
      <header className="page-head">
        <div>
          <h1>{data.title}</h1>
          <p><span className={'badge ' + data.difficulty}>{data.difficulty}</span> <span className="muted">{data.topic}</span></p>
        </div>
        <Link to="/problems" className="btn">All problems</Link>
      </header>

      <div className="split">
        <section className="card">
          <h2>Problem</h2>
          <p className="statement">{data.description}</p>
        </section>

        <section className="card">
          <h2>Your code</h2>
          <textarea
            className="editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck="false"
            aria-label="Code editor"
          />
          <div className="actions">
            <button type="button" className="btn primary" onClick={run} disabled={running}>
              <Icon name="play" size={16} /> {running ? 'Running…' : 'Run tests'}
            </button>
            <button type="button" className="btn" onClick={() => setCode(data.starter)}>Reset code</button>
          </div>
        </section>
      </div>

      {outcome && (
        <section className="card spaced">
          {outcome.error ? (
            <p className="field-error">{outcome.error}</p>
          ) : (
            <>
              <h2>{passed} of {outcome.results.length} tests passed</h2>
              {solvedMsg && <p className="solved-msg">{solvedMsg}</p>}
              <ul className="tests">
                {outcome.results.map((r, i) => (
                  <li key={i} className={r.ok ? 'pass' : 'fail'}>
                    <strong>{r.ok ? 'Passed' : 'Failed'}</strong>
                    <code>{data.fnName}({data.tests[i][0].map((a) => JSON.stringify(a)).join(', ')})</code>
                    {!r.ok && (
                      <span className="muted small">
                        Expected {JSON.stringify(data.tests[i][1])}, got {r.got}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </div>
  );
}
