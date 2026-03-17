import { useState } from "react";
import "./App.css";
import ShoppingCategoryFilter from "./components/ShoppingCategoryFilter";
import ShoppingFilter from "./components/ShoppingFilter";
import ShoppingForm from "./components/ShoppingForm";
import ShoppingList from "./components/ShoppingList";
import ShoppingHeader from "./components/ShoppingHeader";
import useShopping from "./hooks/useShopping";
import useTheme from "./hooks/useTheme";

function App() {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQuantity, setItemQuantity] = useState("1");
  const [itemCategory, setItemCategory] = useState("outros");
  const { darkMode, toggleTheme } = useTheme();
  const {
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    shoppingItems,
    filteredShoppingItems,
    purchasedItemsCount,
    hasPurchasedItems,
    totalAmount,
    purchasedAmount,
    remainingAmount,
    addShoppingItem,
    toggleShoppingItem,
    deleteShoppingItem,
    editShoppingItem,
    clearPurchasedItems,
  } = useShopping();

  function handleAddItem(event) {
    event.preventDefault();

    const didAddItem = addShoppingItem(
      itemName,
      itemPrice,
      itemQuantity,
      itemCategory
    );
    if (didAddItem) {
      setItemName("");
      setItemPrice("");
      setItemQuantity("1");
      setItemCategory("outros");
    }
  }

  return (
    <div className={darkMode ? "container dark" : "container"}>
      <div className="shopping-card">
        <ShoppingHeader darkMode={darkMode} onToggleTheme={toggleTheme} />

        <ShoppingForm
          itemName={itemName}
          itemPrice={itemPrice}
          itemQuantity={itemQuantity}
          itemCategory={itemCategory}
          onItemNameChange={setItemName}
          onItemPriceChange={setItemPrice}
          onItemQuantityChange={setItemQuantity}
          onItemCategoryChange={setItemCategory}
          onSubmit={handleAddItem}
        />

        <div className="info">
          <span>Itens: {shoppingItems.length}</span>
          <span>Comprados: {purchasedItemsCount}</span>
        </div>

        <div className="summary-grid">
          <div className="summary-card">
            <strong>Total</strong>
            <span>{totalAmount}</span>
          </div>
          <div className="summary-card">
            <strong>Comprado</strong>
            <span>{purchasedAmount}</span>
          </div>
          <div className="summary-card">
            <strong>Restante</strong>
            <span>{remainingAmount}</span>
          </div>
        </div>

        <ShoppingFilter
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        <ShoppingCategoryFilter
          currentCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />

        <ShoppingList
          shoppingItems={filteredShoppingItems}
          onToggleShoppingItem={toggleShoppingItem}
          onEditShoppingItem={editShoppingItem}
          onDeleteShoppingItem={deleteShoppingItem}
        />

        {hasPurchasedItems && (
          <button className="clear-button" onClick={clearPurchasedItems}>
            Limpar comprados
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
