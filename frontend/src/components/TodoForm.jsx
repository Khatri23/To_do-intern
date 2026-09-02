import { useState } from 'react';

export default function TodoForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setExpanded(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onCreate({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        dueDate: dueDate || null,
      });
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__row">
        <input
          type="text"
          className="todo-form__title-input"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          maxLength={255}
        />
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add Todo'}
        </button>
      </div>

      {expanded && (
        <div className="todo-form__details">
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                resetForm();
              }}
            >
              Collapse
            </button>
          </div>
        </div>
      )}

      {error && <p className="todo-form__error">{error}</p>}
    </form>
  );
}
