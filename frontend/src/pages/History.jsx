import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../api.js';
import ListTools from '../components/ListTools.jsx';
import { ErrorBox, Loading } from '../components/Notice.jsx';

const SORTS = [
  ['newest', 'Newest first'],
  ['oldest', 'Oldest first'],
  ['high', 'Highest score'],
  ['low', 'Lowest score'],
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function History() {
  const { data, error, loading } = useApi('/api/history');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [filter, setFilter] = useState('All');

  const rows = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    const list = data.filter((x) => (filter === 'All' || x.kind === filter) && (x.title + ' ' + x.detail).toLowerCase().includes(q));
    if (sort === 'oldest') return [...list].reverse();
    if (sort === 'high') return [...list].sort((a, b) => b.score - a.score);
    if (sort === 'low') return [...list].sort((a, b) => a.score - b.score);
    return list;
  }, [data, query, sort, filter]);

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      <header className="page-head">
        <div>
          <h1>History</h1>
          <p>Every interview and quiz you have finished.</p>
        </div>
      </header>

      {data.length === 0 ? (
        <section className="card">
          <p className="muted">Nothing here yet. Finish an interview or a quiz and it will show up in this list.</p>
          <div className="actions">
            <Link to="/interview" className="btn primary">Start an interview</Link>
            <Link to="/quizzes" className="btn">Take a quiz</Link>
          </div>
        </section>
      ) : (
        <>
          <ListTools
            query={query} setQuery={setQuery} placeholder="Search by role or quiz name"
            filter={filter} setFilter={setFilter} filterOptions={['All', 'Interview', 'Quiz']}
            sort={sort} setSort={setSort} sortOptions={SORTS}
          />
          {rows.length === 0 ? (
            <p className="muted">Nothing matches your search.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Date</th><th>Type</th><th>Title</th><th>Details</th><th>Score</th></tr>
                </thead>
                <tbody>
                  {rows.map((x) => (
                    <tr key={x.id}>
                      <td>{formatDate(x.at)}</td>
                      <td>{x.kind}</td>
                      <td>{x.title}</td>
                      <td className="muted">{x.detail}</td>
                      <td><span className="score-pill">{x.score}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
