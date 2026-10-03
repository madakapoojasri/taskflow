function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const done = task.status === "COMPLETED";

  return (
    <div className={done ? "task-card done" : "task-card"}>
      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggle(task.id)}
      />

      <div className="task-info">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div className="task-meta">
          <span className={`badge priority-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
          {task.category && <span className="badge category">{task.category}</span>}
          {task.dueDate && <span className="task-date">Due {task.dueDate}</span>}
        </div>
      </div>

      <div className="task-actions">
        <button className="btn-edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;