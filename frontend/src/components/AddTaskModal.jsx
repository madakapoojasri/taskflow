import { getErrorMessage } from "../services/api";
import { useState } from "react";

function AddTaskModal({ task, onClose, onSave, onUpdate }) {
  const isEditing = task !== null;
  const [form, setForm] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    category: task?.category ?? "College",
    priority: task?.priority ?? "MEDIUM",
    dueDate: task?.dueDate ?? "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    setError("");
    setServerError("");
    setSaving(true);

    const cleaned = {
      ...form,
      title: form.title.trim(),
      dueDate: form.dueDate || null, // an empty date must be sent as null
    };

    try {
      if (isEditing) {
        await onUpdate(task.id, cleaned);
      } else {
        await onSave(cleaned);
      }
      onClose();
    } catch (err) {
      setServerError(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? "Edit Task" : "Add Task"}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Complete React project"
              value={form.title}
              onChange={handleChange}
            />
            {error && <p className="error-text">{error}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Optional details"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>College</option>
                <option>Coding</option>
                <option>Work</option>
                <option>Personal</option>
                <option>Shopping</option>
                <option>Goals</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due date</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          {serverError && <p className="error-banner">❌ {serverError}</p>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;