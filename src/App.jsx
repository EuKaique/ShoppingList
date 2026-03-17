import { useState } from "react";
import "./App.css";
import TaskFilter from "./components/TaskFilter";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TodoHeader from "./components/TodoHeader";
import useTasks from "./hooks/useTasks";
import useTheme from "./hooks/useTheme";

function App() {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQuantity, setItemQuantity] = useState("1");
  const { darkMode, toggleTheme } = useTheme();
  const {
    statusFilter,
    setStatusFilter,
    tasks,
    filteredTasks,
    completedTasksCount,
    hasCompletedTasks,
    totalAmount,
    purchasedAmount,
    remainingAmount,
    addItem,
    toggleItem,
    deleteItem,
    editItem,
    clearPurchasedItems,
  } = useTasks();

  function handleAddItem(event) {
    event.preventDefault();

    const didAddItem = addItem(itemName, itemPrice, itemQuantity);
    if (didAddItem) {
      setItemName("");
      setItemPrice("");
      setItemQuantity("1");
    }
  }

  return (
    <div className={darkMode ? "container dark" : "container"}>
      <div className="todo-card">
        <TodoHeader darkMode={darkMode} onToggleTheme={toggleTheme} />

        <TaskForm
          itemName={itemName}
          itemPrice={itemPrice}
          itemQuantity={itemQuantity}
          onItemNameChange={setItemName}
          onItemPriceChange={setItemPrice}
          onItemQuantityChange={setItemQuantity}
          onSubmit={handleAddItem}
        />

        <div className="info">
          <span>Itens: {tasks.length}</span>
          <span>Comprados: {completedTasksCount}</span>
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

        <TaskFilter
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        <TaskList
          tasks={filteredTasks}
          onToggleTask={toggleItem}
          onEditTask={editItem}
          onDeleteTask={deleteItem}
        />

        {hasCompletedTasks && (
          <button className="clear-button" onClick={clearPurchasedItems}>
            Limpar comprados
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
