import { useEffect, useMemo, useState } from 'react';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import FilterBar from './components/FilterBar.jsx';
import * as api from './api.js';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const loadTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleCreate = async (payload) => {
    const newTodo = await api.createTodo(payload);
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleUpdate = async (id, updates) => {
    const updated = await api.updateTodo(id, updates);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDelete = async (id) => {
    await api.deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTodos = useMemo(() => {
    return todos
      .filter((t) => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      })
      .filter((t) => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q)
        );
      });
  }, [todos, filter, search]);

  const stats = useMemo(
    () => ({
      remaining: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    }),
    [todos]
  );

  return (
    <div className="app">
      <header className="app__header">
        <h1>Todo</h1>
        <p>Stay on top of things, one task at a time.</p>
      </header>

      <main className="app__main">
        <TodoForm onCreate={handleCreate} />

        <FilterBar
          activeFilter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
          stats={stats}
        />

        {error && (
          <div className="app__error">
            <span>{error}</span>
            <button onClick={loadTodos}>Retry</button>
          </div>
        )}

        <TodoList
          todos={filteredTodos}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          loading={loading}
        />
      </main>
    </div>
  );
}
