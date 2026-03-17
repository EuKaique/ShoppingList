import { SHOPPING_CATEGORIES } from "../constants/shoppingCategories";

function ShoppingCategoryFilter({ currentCategory, onCategoryChange }) {
  return (
    <div className="shopping-category-filter">
      <label htmlFor="category-filter">Categoria</label>
      <select
        id="category-filter"
        value={currentCategory}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        <option value="all">Todas as categorias</option>
        {SHOPPING_CATEGORIES.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ShoppingCategoryFilter;
