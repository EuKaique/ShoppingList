const FILTER_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendentes" },
  { value: "completed", label: "Concluídas" },
];

function ShoppingFilter({ currentFilter, onFilterChange }) {
  return (
    <div className="shopping-filter-group" aria-label="Filtrar compras">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={
            currentFilter === option.value
              ? "shopping-filter-button active"
              : "shopping-filter-button"
          }
          onClick={() => onFilterChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ShoppingFilter;
