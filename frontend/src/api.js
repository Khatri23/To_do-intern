const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse(res) {
  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.error || (data.errors && data.errors.join(', ')) || 'Request failed.';
    throw new Error(message);
  }

  return data;
}

export async function fetchTodos(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE_URL}/todos${params ? `?${params}` : ''}`);
  return handleResponse(res);
}

export async function createTodo(todo) {
  const res = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  return handleResponse(res);
}

export async function updateTodo(id, updates) {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
}

export async function deleteTodo(id) {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
