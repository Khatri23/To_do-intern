const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function FilterBar({ activeFilter, onFilterChange, search, onSearchChange, stats }) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__tabs">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-tab ${activeFilter === f.key ? 'filter-tab--active' : ''}`}
            onClick={() => onFilterChange(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <input
        type="search"
        className="filter-bar__search"
        placeholder="Search todos…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <span className="filter-bar__stats">
        {stats.remaining} left · {stats.completed} done
      </span>
    </div>
  );
}
