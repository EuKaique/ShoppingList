import TaskItem from "./TaskItem";

function TaskList({ tasks, onToggleTask, onEditTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return <p className="empty-message">Nenhum item cadastrado.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
        />
      ))}
    </ul>
  );
}

export default TaskList;
