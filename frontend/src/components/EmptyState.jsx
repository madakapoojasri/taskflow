function EmptyState({ icon, title, text, actionLabel, onAction }) {
  return (
    <div className="empty-card">
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      {text && <p className="empty-text">{text}</p>}
      {actionLabel && (
        <button type="button" className="btn-add" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;