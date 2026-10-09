import Icon from './Icon.jsx';

// Search box, filter buttons and sort menu shared by every list page.
export default function ListTools({ query, setQuery, placeholder, filter, setFilter, filterOptions, sort, setSort, sortOptions }) {
  return (
    <div className="tools">
      <label className="search">
        <Icon name="search" size={16} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} aria-label="Search" />
      </label>
      <div className="chips">
        {filterOptions.map((f) => (
          <button key={f} type="button" className={'chip' + (filter === f ? ' on' : '')} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
        {sortOptions.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}
