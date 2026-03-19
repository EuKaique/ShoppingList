function ShoppingNameFilter({ currentValue, onValueChange }) {
  return (
    <div className="shopping-name-filter">
      <label htmlFor="name-filter">Nome do item</label>
      <input
        id="name-filter"
        type="text"
        placeholder="Filtrar por nome..."
        value={currentValue}
        onChange={(event) => onValueChange(event.target.value)}
      />
    </div>
  );
}

export default ShoppingNameFilter;
