const FILTER_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendentes" },
  { value: "completed", label: "Concluídas" },
];

function TaskFilter({ currentFilter, onFilterChange }) {
  return (
    <div className="filter-group" aria-label="Filtrar compras">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={
            currentFilter === option.value
              ? "filter-button active"
              : "filter-button"
          }
          onClick={() => onFilterChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default TaskFilter;
