import { useState } from 'react';

const PRIORITY_LABEL = { low: 'Low', medium: 'Medium', high: 'High' };

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [priority, setPriority] = useState(todo.priority);
  const [dueDate, setDueDate] = useState(todo.due_date ? todo.due_date.slice(0, 10) : '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleToggleComplete = async () => {
    setBusy(true);
    try {
      await onUpdate(todo.id, { completed: !todo.completed });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!title.trim()) {
      setError('Title cannot be empty.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onUpdate(todo.id, {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        dueDate: dueDate || null,
      });
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleCancelEdit = () => {
    setTitle(todo.title);
    setDescription(todo.description || '');
    setPriority(todo.priority);
    setDueDate(todo.due_date ? todo.due_date.slice(0, 10) : '');
    setIsEditing(false);
    setError('');
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await onDelete(todo.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (isEditing) {
    return (
      <li className="todo-item todo-item--editing">
        <div className="todo-item__edit-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={255}
            autoFocus
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
          />
          <div className="todo-form__meta-row">
            <label className="todo-form__field">
              <span>Priority</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="todo-form__field">
              <span>Due date</span>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </label>
          </div>
          {error && <p className="todo-form__error">{error}</p>}
          <div className="todo-item__edit-actions">
            <button className="btn btn--primary" onClick={handleSaveEdit} disabled={busy}>
              Save
            </button>
            <button className="btn btn--ghost" onClick={handleCancelEdit} disabled={busy}>
              Cancel
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? 'todo-item--completed' : ''} ${busy ? 'todo-item--busy' : ''}`}>
      <label className="todo-item__checkbox-wrap">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          disabled={busy}
        />
        <span className="todo-item__checkbox-custom" />
      </label>

      <div className="todo-item__content">
        <div className="todo-item__title-row">
          <span className="todo-item__title">{todo.title}</span>
          <span className={`badge badge--${todo.priority}`}>{PRIORITY_LABEL[todo.priority]}</span>
        </div>
        {todo.description && <p className="todo-item__description">{todo.description}</p>}
        {todo.due_date && (
          <span className="todo-item__due-date">Due {formatDate(todo.due_date)}</span>
        )}
        {error && <p className="todo-form__error">{error}</p>}
      </div>

      <div className="todo-item__actions">
        <button className="icon-btn" title="Edit" onClick={() => setIsEditing(true)} disabled={busy}>
          ✎
        </button>
        <button className="icon-btn icon-btn--danger" title="Delete" onClick={handleDelete} disabled={busy}>
          🗑
        </button>
      </div>
    </li>
  );
}
