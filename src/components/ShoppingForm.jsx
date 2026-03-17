import { SHOPPING_CATEGORIES } from "../constants/shoppingCategories";

function ShoppingForm({
  itemName,
  itemPrice,
  itemQuantity,
  itemCategory,
  onItemNameChange,
  onItemPriceChange,
  onItemQuantityChange,
  onItemCategoryChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="shopping-form">
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
      <select
        className="category-input"
        aria-label="Categoria do item"
        value={itemCategory}
        onChange={(event) => onItemCategoryChange(event.target.value)}
      >
        {SHOPPING_CATEGORIES.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
      <button type="submit">Adicionar</button>
    </form>
  );
}

export default ShoppingForm;
