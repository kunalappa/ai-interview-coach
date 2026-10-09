import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../api.js';
import Icon from '../components/Icon.jsx';
import ListTools from '../components/ListTools.jsx';
import { ErrorBox, Loading } from '../components/Notice.jsx';

const ORDER = { Easy: 1, Medium: 2, Hard: 3 };
const SORTS = [
  ['default', 'Default order'],
  ['title', 'Title A to Z'],
  ['easy', 'Easiest first'],
  ['hard', 'Hardest first'],
  ['unsolved', 'Unsolved first'],
];

export default function Problems() {
  const { data, error, loading } = useApi('/api/problems');
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
    if (sort === 'unsolved') return [...list].sort((a, b) => Number(a.solved) - Number(b.solved));
    return list;
  }, [data, query, sort, filter]);

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} />;

  const solvedCount = data.filter((p) => p.solved).length;

  return (
    <div>
      <header className="page-head">
        <div>
          <h1>Coding problems</h1>
          <p>Write JavaScript and run it against tests. {solvedCount} of {data.length} solved.</p>
        </div>
      </header>

      <ListTools
        query={query} setQuery={setQuery} placeholder="Search problems or topics"
        filter={filter} setFilter={setFilter} filterOptions={['All', 'Easy', 'Medium', 'Hard']}
        sort={sort} setSort={setSort} sortOptions={SORTS}
      />

      {rows.length === 0 ? (
        <p className="muted">No problems match your search.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th className="narrow">Status</th><th>Problem</th><th>Topic</th><th>Level</th></tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.id}>
                  <td className="narrow">{x.solved ? <span className="solved"><Icon name="check" size={16} /></span> : <span className="muted">–</span>}</td>
                  <td><Link className="row-link" to={'/problems/' + x.id}>{x.title}</Link></td>
                  <td>{x.topic}</td>
                  <td><span className={'badge ' + x.difficulty}>{x.difficulty}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
