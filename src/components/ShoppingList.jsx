import ShoppingItem from "./ShoppingItem";

function ShoppingList({
  shoppingItems,
  onToggleShoppingItem,
  onEditShoppingItem,
  onDeleteShoppingItem,
}) {
  if (shoppingItems.length === 0) {
    return <p className="empty-message">Nenhum item cadastrado.</p>;
  }

  return (
    <ul className="shopping-list">
      {shoppingItems.map((shoppingItem) => (
        <ShoppingItem
          key={shoppingItem.id}
          shoppingItem={shoppingItem}
          onToggleShoppingItem={onToggleShoppingItem}
          onEditShoppingItem={onEditShoppingItem}
          onDeleteShoppingItem={onDeleteShoppingItem}
        />
      ))}
    </ul>
  );
}

export default ShoppingList;
