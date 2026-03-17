function TaskForm({
  itemName,
  itemPrice,
  itemQuantity,
  onItemNameChange,
  onItemPriceChange,
  onItemQuantityChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="form">
      <input
        type="text"
        placeholder="Digite um item..."
        value={itemName}
        onChange={(event) => onItemNameChange(event.target.value)}
      />
      <input
        className="price-input"
        type="number"
        min="0"
        step="0.01"
        placeholder="Preço"
        value={itemPrice}
        onChange={(event) => onItemPriceChange(event.target.value)}
      />
      <input
        className="quantity-input"
        type="number"
        min="1"
        step="1"
        placeholder="Qtd."
        value={itemQuantity}
        onChange={(event) => onItemQuantityChange(event.target.value)}
      />
      <button type="submit">Adicionar</button>
    </form>
  );
}

export default TaskForm;
