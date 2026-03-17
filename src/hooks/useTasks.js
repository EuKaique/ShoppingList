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

function normalizeItem(item) {
  return {
    id: item.id,
    text: item.text ?? "",
    price: Number(item.price ?? 0),
    quantity: Math.max(1, Number(item.quantity ?? 1)),
    completed: Boolean(item.completed),
  };
}

function useTasks() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks).map(normalizeItem) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completedTasksCount = tasks.filter((item) => item.completed).length;
  const hasCompletedTasks = completedTasksCount > 0;
  const totalAmountValue = tasks.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const purchasedAmountValue = tasks
    .filter((item) => item.completed)
    .reduce((total, item) => total + item.price * item.quantity, 0);
  const remainingAmountValue = totalAmountValue - purchasedAmountValue;
  const filteredTasks = tasks.filter((item) => {
    if (statusFilter === "pending") {
      return !item.completed;
    }

    if (statusFilter === "completed") {
      return item.completed;
    }

    return true;
  });

  function addItem(text, priceInput, quantityInput) {
    const trimmedText = text.trim();
    const parsedPrice = parseOptionalPrice(priceInput);
    const parsedQuantity = parseOptionalQuantity(quantityInput);

    if (
      !trimmedText ||
      Number.isNaN(parsedPrice) ||
      parsedPrice < 0 ||
      Number.isNaN(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      return false;
    }

    const newItem = {
      id: Date.now(),
      text: trimmedText,
      price: parsedPrice,
      quantity: parsedQuantity,
      completed: false,
    };

    setTasks((prevTasks) => [newItem, ...prevTasks]);
    return true;
  }

  function toggleItem(id) {
    setTasks((prevTasks) =>
      prevTasks.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function deleteItem(id) {
    setTasks((prevTasks) => prevTasks.filter((item) => item.id !== id));
  }

  function editItem(id, nextText, nextPrice, nextQuantity) {
    const trimmedText = nextText.trim();
    const parsedPrice = parseOptionalPrice(nextPrice);
    const parsedQuantity = parseOptionalQuantity(nextQuantity);

    if (
      !trimmedText ||
      Number.isNaN(parsedPrice) ||
      parsedPrice < 0 ||
      Number.isNaN(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((item) =>
        item.id === id
          ? {
              ...item,
              text: trimmedText,
              price: parsedPrice,
              quantity: parsedQuantity,
            }
          : item
      )
    );
  }

  function clearPurchasedItems() {
    setTasks((prevTasks) => prevTasks.filter((item) => !item.completed));
  }

  return {
    statusFilter,
    setStatusFilter,
    tasks,
    filteredTasks,
    completedTasksCount,
    hasCompletedTasks,
    totalAmount: formatCurrency(totalAmountValue),
    purchasedAmount: formatCurrency(purchasedAmountValue),
    remainingAmount: formatCurrency(remainingAmountValue),
    addItem,
    toggleItem,
    deleteItem,
    editItem,
    clearPurchasedItems,
  };
}

export default useTasks;
