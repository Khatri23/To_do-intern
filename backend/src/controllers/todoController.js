const pool = require('../db/pool');

const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Small helper to keep validation logic in one place.
 * Returns an array of error strings; empty array means valid.
 */
function validateTodoInput({ title, priority, dueDate }, { partial = false } = {}) {
  const errors = [];

  if (!partial || title !== undefined) {
    if (!title || typeof title !== 'string' || !title.trim()) {
      errors.push('Title is required and must be a non-empty string.');
    } else if (title.length > 255) {
      errors.push('Title must be 255 characters or fewer.');
    }
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  if (dueDate !== undefined && dueDate !== null) {
    const parsed = new Date(dueDate);
    if (Number.isNaN(parsed.getTime())) {
      errors.push('Due date must be a valid date (YYYY-MM-DD).');
    }
  }

  return errors;
}

// GET /api/todos
// Supports optional query params: ?completed=true|false&priority=low|medium|high&search=text
async function getAllTodos(req, res, next) {
  try {
    const { completed, priority, search } = req.query;
    const conditions = [];
    const values = [];

    if (completed !== undefined) {
      values.push(completed === 'true');
      conditions.push(`completed = $${values.length}`);
    }

    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ error: `Invalid priority filter. Must be one of: ${VALID_PRIORITIES.join(', ')}.` });
      }
      values.push(priority);
      conditions.push(`priority = $${values.length}`);
    }

    if (search !== undefined && search.trim() !== '') {
      values.push(`%${search.trim()}%`);
      conditions.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
      SELECT id, title, description, completed, priority, due_date, created_at, updated_at
      FROM todos
      ${whereClause}
      ORDER BY completed ASC, created_at DESC
    `;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/todos/:id
async function getTodoById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// POST /api/todos
async function createTodo(req, res, next) {
  try {
    const { title, description = null, priority = 'medium', dueDate = null } = req.body;

    const errors = validateTodoInput({ title, priority, dueDate });
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const result = await pool.query(
      `INSERT INTO todos (title, description, priority, due_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title.trim(), description, priority, dueDate]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/todos/:id
// Full or partial update. Only fields present in the body are changed.
async function updateTodo(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, dueDate } = req.body;

    const errors = validateTodoInput({ title, priority, dueDate }, { partial: true });
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    // Build the SET clause dynamically based on which fields were provided.
    const fields = [];
    const values = [];

    const addField = (column, value) => {
      values.push(value);
      fields.push(`${column} = $${values.length}`);
    };

    if (title !== undefined) addField('title', title.trim());
    if (description !== undefined) addField('description', description);
    if (completed !== undefined) addField('completed', completed);
    if (priority !== undefined) addField('priority', priority);
    if (dueDate !== undefined) addField('due_date', dueDate);

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields provided to update.' });
    }

    values.push(id);
    const query = `
      UPDATE todos
      SET ${fields.join(', ')}
      WHERE id = $${values.length}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/todos/:id
async function deleteTodo(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found.' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
