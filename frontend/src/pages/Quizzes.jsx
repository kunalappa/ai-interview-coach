import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../api.js';
import ListTools from '../components/ListTools.jsx';
import { ErrorBox, Loading } from '../components/Notice.jsx';

const ORDER = { Easy: 1, Medium: 2, Hard: 3 };
const SORTS = [
  ['default', 'Default order'],
  ['title', 'Title A to Z'],
  ['easy', 'Easiest first'],
  ['hard', 'Hardest first'],
  ['best', 'Best score first'],
];

export default function Quizzes() {
  const { data, error, loading } = useApi('/api/quizzes');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('default');
  const [filter, setFilter] = useState('All');

  const rows = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    const list = data.filter((x) => (filter === 'All' || x.difficulty === filter) && (x.title + ' ' + x.topic).toLowerCase().includes(q));
    if (sort === 'title') return [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'easy') return [...list].sort((a, b) => ORDER[a.difficulty] - ORDER[b.difficulty]);
    if (sort === 'hard') return [...list].sort((a, b) => ORDER[b.difficulty] - ORDER[a.difficulty]);
    if (sort === 'best') return [...list].sort((a, b) => (b.best === null ? -1 : b.best) - (a.best === null ? -1 : a.best));
    return list;
  }, [data, query, sort, filter]);

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      <header className="page-head">
        <div>
          <h1>Quizzes</h1>
          <p>Short multiple-choice quizzes. Each one counts toward your daily activity.</p>
        </div>
      </header>

      <ListTools
        query={query} setQuery={setQuery} placeholder="Search quizzes or topics"
        filter={filter} setFilter={setFilter} filterOptions={['All', 'Easy', 'Medium', 'Hard']}
        sort={sort} setSort={setSort} sortOptions={SORTS}
      />

      {rows.length === 0 ? (
        <p className="muted">No quizzes match your search.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Quiz</th><th>Topic</th><th>Level</th><th>Questions</th><th>Best score</th></tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.id}>
                  <td><Link className="row-link" to={'/quizzes/' + x.id}>{x.title}</Link></td>
                  <td>{x.topic}</td>
                  <td><span className={'badge ' + x.difficulty}>{x.difficulty}</span></td>
                  <td>{x.count}</td>
                  <td>{x.best === null ? <span className="muted">Not taken</span> : x.best + '%'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
