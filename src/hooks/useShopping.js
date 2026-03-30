import {
  SHOPPING_CATEGORIES,
  getCategoryLabel,
} from "../constants/shoppingCategories";
import { useEffect, useState } from "react";

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function parseOptionalPrice(priceInput) {
  const normalizedPrice = String(priceInput ?? "").trim();

  if (!normalizedPrice) {
    return 0;
  }

  return Number.parseFloat(normalizedPrice.replace(",", "."));
}

function parseOptionalQuantity(quantityInput) {
  const normalizedQuantity = String(quantityInput ?? "").trim();

  if (!normalizedQuantity) {
    return 1;
  }

  return Number.parseInt(normalizedQuantity, 10);
}

function normalizeShoppingItem(item) {
  return {
    id: item.id,
    text: item.text ?? "",
    price: Number(item.price ?? 0),
    quantity: Math.max(1, Number(item.quantity ?? 1)),
    category:
      item.category &&
      SHOPPING_CATEGORIES.some((category) => category.value === item.category)
        ? item.category
        : "outros",
    completed: Boolean(item.completed),
  };
}

function normalizeHistoryEntry(entry) {
  const items = Array.isArray(entry.items)
    ? entry.items.map(normalizeShoppingItem)
    : [];

  return {
    id: entry.id ?? Date.now(),
    purchasedAt: entry.purchasedAt ?? new Date().toISOString(),
    items: items.map((item) => ({
      ...item,
      categoryLabel: getCategoryLabel(item.category),
    })),
  };
}

function loadShoppingItems() {
  const savedShoppingItems =
    localStorage.getItem("shoppingItems") ?? localStorage.getItem("tasks");

  return savedShoppingItems
    ? JSON.parse(savedShoppingItems).map(normalizeShoppingItem)
    : [];
}

function loadShoppingHistory() {
  const savedShoppingHistory = localStorage.getItem("shoppingHistory");

  return savedShoppingHistory
    ? JSON.parse(savedShoppingHistory).map(normalizeHistoryEntry)
    : [];
}

function useShopping() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [nameFilter, setNameFilter] = useState("");
  const [shoppingItems, setShoppingItems] = useState(loadShoppingItems);
  const [shoppingHistory, setShoppingHistory] = useState(loadShoppingHistory);

  useEffect(() => {
    localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems));
  }, [shoppingItems]);

  useEffect(() => {
    localStorage.setItem("shoppingHistory", JSON.stringify(shoppingHistory));
  }, [shoppingHistory]);

  const purchasedItemsCount = shoppingItems.filter(
    (item) => item.completed
  ).length;
  const hasPurchasedItems = purchasedItemsCount > 0;
  const totalAmountValue = shoppingItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const purchasedAmountValue = shoppingItems
    .filter((item) => item.completed)
    .reduce((total, item) => total + item.price * item.quantity, 0);
  const remainingAmountValue = totalAmountValue - purchasedAmountValue;
  const filteredShoppingItems = shoppingItems.filter((item) => {
    const matchesStatus =
      statusFilter === "pending"
        ? !item.completed
        : statusFilter === "completed"
          ? item.completed
          : true;

    const matchesCategory =
      categoryFilter === "all" ? true : item.category === categoryFilter;
    const normalizedNameFilter = nameFilter.trim().toLocaleLowerCase();
    const matchesName = normalizedNameFilter
      ? item.text.toLocaleLowerCase().includes(normalizedNameFilter)
      : true;

    return matchesStatus && matchesCategory && matchesName;
  });

  function addShoppingItem(text, priceInput, quantityInput, categoryInput) {
    const trimmedText = text.trim();
    const parsedPrice = parseOptionalPrice(priceInput);
    const parsedQuantity = parseOptionalQuantity(quantityInput);
    const normalizedCategory =
      SHOPPING_CATEGORIES.find((category) => category.value === categoryInput)
        ?.value ?? "outros";

    if (
      !trimmedText ||
      Number.isNaN(parsedPrice) ||
      parsedPrice < 0 ||
      Number.isNaN(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      return false;
    }

    const newShoppingItem = {
      id: Date.now(),
      text: trimmedText,
      price: parsedPrice,
      quantity: parsedQuantity,
      category: normalizedCategory,
      completed: false,
    };

    setShoppingItems((previousShoppingItems) => [
      newShoppingItem,
      ...previousShoppingItems,
    ]);
    return true;
  }

  function toggleShoppingItem(id) {
    setShoppingItems((previousShoppingItems) =>
      previousShoppingItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function deleteShoppingItem(id) {
    setShoppingItems((previousShoppingItems) =>
      previousShoppingItems.filter((item) => item.id !== id)
    );
  }

  function editShoppingItem(
    id,
    nextText,
    nextPrice,
    nextQuantity,
    nextCategory
  ) {
    const trimmedText = nextText.trim();
    const parsedPrice = parseOptionalPrice(nextPrice);
    const parsedQuantity = parseOptionalQuantity(nextQuantity);
    const normalizedCategory =
      SHOPPING_CATEGORIES.find((category) => category.value === nextCategory)
        ?.value ?? "outros";

    if (
      !trimmedText ||
      Number.isNaN(parsedPrice) ||
      parsedPrice < 0 ||
      Number.isNaN(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      return;
    }

    setShoppingItems((previousShoppingItems) =>
      previousShoppingItems.map((item) =>
        item.id === id
          ? {
              ...item,
              text: trimmedText,
              price: parsedPrice,
              quantity: parsedQuantity,
              category: normalizedCategory,
            }
          : item
      )
    );
  }

  function clearPurchasedItems() {
    const purchasedItems = shoppingItems.filter((item) => item.completed);

    if (purchasedItems.length === 0) {
      return;
    }

    setShoppingHistory((previousShoppingHistory) => [
      normalizeHistoryEntry({
        id: Date.now(),
        purchasedAt: new Date().toISOString(),
        items: purchasedItems,
      }),
      ...previousShoppingHistory,
    ]);
    setShoppingItems((previousShoppingItems) =>
      previousShoppingItems.filter((item) => !item.completed)
    );
  }

  function editHistoryItem(id, nextText, nextPrice, nextQuantity, nextDate) {
    const trimmedText = nextText.trim();
    const parsedPrice = parseOptionalPrice(nextPrice);
    const parsedQuantity = parseOptionalQuantity(nextQuantity);
    const parsedDate = new Date(nextDate);

    if (
      !trimmedText ||
      Number.isNaN(parsedPrice) ||
      parsedPrice < 0 ||
      Number.isNaN(parsedQuantity) ||
      parsedQuantity < 1 ||
      Number.isNaN(parsedDate.getTime())
    ) {
      return false;
    }

    setShoppingHistory((previousShoppingHistory) =>
      previousShoppingHistory.map((historyEntry) => {
        const hasTargetItem = historyEntry.items.some((item) => item.id === id);

        if (!hasTargetItem) {
          return historyEntry;
        }

        return normalizeHistoryEntry({
          ...historyEntry,
          purchasedAt: parsedDate.toISOString(),
          items: historyEntry.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  text: trimmedText,
                  price: parsedPrice,
                  quantity: parsedQuantity,
                }
              : item
          ),
        });
      })
    );

    return true;
  }

  function deleteHistoryItem(id) {
    setShoppingHistory((previousShoppingHistory) =>
      previousShoppingHistory
        .map((historyEntry) =>
          normalizeHistoryEntry({
            ...historyEntry,
            items: historyEntry.items.filter((item) => item.id !== id),
          })
        )
        .filter((historyEntry) => historyEntry.items.length > 0)
    );
  }

  function clearShoppingHistory() {
    setShoppingHistory([]);
  }

  function repeatHistoryMonth(itemIds) {
    const idsToRepeat = new Set(itemIds);
    const itemsToRepeat = shoppingHistory.flatMap((historyEntry) =>
      historyEntry.items.filter((item) => idsToRepeat.has(item.id))
    );

    if (itemsToRepeat.length === 0) {
      return;
    }

    const baseId = Date.now();
    const repeatedItems = itemsToRepeat.map((item, index) => ({
      id: baseId + index,
      text: item.text,
      price: item.price,
      quantity: item.quantity,
      category: item.category,
      completed: false,
    }));

    setShoppingItems((previousShoppingItems) => [
      ...repeatedItems,
      ...previousShoppingItems,
    ]);
  }

  return {
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
    totalAmount: formatCurrency(totalAmountValue),
    purchasedAmount: formatCurrency(purchasedAmountValue),
    remainingAmount: formatCurrency(remainingAmountValue),
    addShoppingItem,
    toggleShoppingItem,
    deleteShoppingItem,
    editShoppingItem,
    clearPurchasedItems,
    editHistoryItem,
    deleteHistoryItem,
    clearShoppingHistory,
    repeatHistoryMonth,
  };
}

export default useShopping;
