function TaskCard({ task }) {
  const done = task.status === "COMPLETED";

  return (
    <div className={done ? "task-card done" : "task-card"}>
      <input type="checkbox" checked={done} readOnly />

      <div className="task-info">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div className="task-meta">
          <span className={`badge priority-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
          <span className="badge category">{task.category}</span>
          <span className="task-date">Due {task.dueDate}</span>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;