import TodoItem from './TodoItem.jsx';

export default function TodoList({ todos, onUpdate, onDelete, loading }) {
  if (loading) {
    return <p className="todo-list__status">Loading todos…</p>;
  }

  if (todos.length === 0) {
    return (
      <div className="todo-list__empty">
        <p>Nothing here yet.</p>
        <span>Add a todo above to get started.</span>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}
