import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme !== null) {
      return JSON.parse(savedTheme);
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(darkMode));
  }, [darkMode]);

  function handleAddTask(e) {
    e.preventDefault();

    const trimmedTask = task.trim();
    if (!trimmedTask) return;

    const newTask = {
      id: Date.now(),
      text: trimmedTask,
      completed: false,
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setTask("");
  }

  function handleToggleTask(id) {
    setTasks((prevTasks) =>
      prevTasks.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function handleDeleteTask(id) {
    setTasks((prevTasks) => prevTasks.filter((item) => item.id !== id));
  }

  function handleClearCompleted() {
    setTasks((prevTasks) => prevTasks.filter((item) => !item.completed));
  }

  return (
    <div className={darkMode ? "container dark" : "container"}>
      <div className="todo-card">
        <div className="header">
          <h1>Lista de tarefas</h1>
          <button
            className="theme-button"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <form onSubmit={handleAddTask} className="form">
          <input
            type="text"
            placeholder="Digite uma tarefa..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button type="submit">Adicionar</button>
        </form>

        <div className="info">
          <span>Total: {tasks.length}</span>
          <span>
            Concluídas: {tasks.filter((item) => item.completed).length}
          </span>
        </div>

        <ul className="task-list">
          {tasks.length === 0 ? (
            <p className="empty-message">Nenhuma tarefa cadastrada.</p>
          ) : (
            tasks.map((item) => (
              <li key={item.id} className="task-item">
                <label className="task-content">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleTask(item.id)}
                  />
                  <span className={item.completed ? "completed" : ""}>
                    {item.text}
                  </span>
                </label>

                <button
                  className="delete-button"
                  onClick={() => handleDeleteTask(item.id)}
                >
                  Excluir
                </button>
              </li>
            ))
          )}
        </ul>

        {tasks.some((item) => item.completed) && (
          <button className="clear-button" onClick={handleClearCompleted}>
            Limpar concluídas
          </button>
        )}
      </div>
    </div>
  );
}

export default App;