require('dotenv').config();
const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

// ---------- Routes ----------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/todos', todoRoutes);

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ---------- Centralized error handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Postgres-specific error codes we want to surface cleanly
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Duplicate entry.' });
  }
  if (err.code === '22P02') {
    return res.status(400).json({ error: 'Invalid input format (e.g. malformed UUID).' });
  }

  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Todo API server running on http://localhost:${PORT}`);
});
console.log('PGHOST:', process.env.PGHOST);
console.log('PGPORT:', process.env.PGPORT);
console.log('PGUSER:', process.env.PGUSER);
console.log('PGPASSWORD:', process.env.PGPASSWORD);
console.log('PGDATABASE:', process.env.PGDATABASE);