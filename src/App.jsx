import { useEffect, useState } from "react";
import "./App.css";
import ShoppingCategoryFilter from "./components/ShoppingCategoryFilter";
import ShoppingFilter from "./components/ShoppingFilter";
import ShoppingForm from "./components/ShoppingForm";
import ShoppingHistory from "./components/ShoppingHistory";
import ShoppingList from "./components/ShoppingList";
import ShoppingHeader from "./components/ShoppingHeader";
import ShoppingNameFilter from "./components/ShoppingNameFilter";
import useShopping from "./hooks/useShopping";
import useTheme from "./hooks/useTheme";

const HISTORY_PATH = "/historico";

function App() {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQuantity, setItemQuantity] = useState("1");
  const [itemCategory, setItemCategory] = useState("outros");
  const [installPrompt, setInstallPrompt] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { darkMode, toggleTheme } = useTheme();
  const {
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    nameFilter,
    setNameFilter,
    shoppingItems,
    filteredShoppingItems,
    purchasedItemsCount,
    hasPurchasedItems,
    shoppingHistory,
    totalAmount,
    purchasedAmount,
    remainingAmount,
    addShoppingItem,
    toggleShoppingItem,
    deleteShoppingItem,
    editShoppingItem,
    clearPurchasedItems,
    editHistoryItem,
    deleteHistoryItem,
    clearShoppingHistory,
    repeatHistoryMonth,
  } = useShopping();
  const isHistoryRoute = currentPath === HISTORY_PATH;

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setInstallPrompt(event);
    }

    function handleAppInstalled() {
      setInstallPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    function handlePopState() {
      setCurrentPath(window.location.pathname);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (!themeColorMeta) {
      return;
    }

    themeColorMeta.setAttribute("content", darkMode ? "#111827" : "#4f46e5");
  }, [darkMode]);

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

  async function handleInstallClick() {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  function navigateTo(path) {
    if (window.location.pathname === path) {
      return;
    }

    window.history.pushState({}, "", path);
    setCurrentPath(path);
  }

  return (
    <div className={darkMode ? "container dark" : "container"}>
      <div className="shopping-card">
        <ShoppingHeader
          title={isHistoryRoute ? "Histórico de compras" : "Lista de compras"}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          canInstall={Boolean(installPrompt)}
          onInstallClick={handleInstallClick}
          isHistoryRoute={isHistoryRoute}
          onNavigateToHistory={() => navigateTo(HISTORY_PATH)}
          onNavigateToList={() => navigateTo("/")}
        />

        {isHistoryRoute ? (
          <ShoppingHistory
            shoppingHistory={shoppingHistory}
            onEditHistoryItem={editHistoryItem}
            onDeleteHistoryItem={deleteHistoryItem}
            onClearShoppingHistory={clearShoppingHistory}
            onRepeatHistoryMonth={repeatHistoryMonth}
          />
        ) : (
          <>
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

            <ShoppingNameFilter
              currentValue={nameFilter}
              onValueChange={setNameFilter}
            />

            <ShoppingList
              shoppingItems={filteredShoppingItems}
              onToggleShoppingItem={toggleShoppingItem}
              onEditShoppingItem={editShoppingItem}
              onDeleteShoppingItem={deleteShoppingItem}
            />

            {hasPurchasedItems && (
              <button className="clear-button" onClick={clearPurchasedItems}>
                Salvar compra no histórico
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
