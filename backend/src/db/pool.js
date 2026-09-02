const { Pool } = require('pg');
require('dotenv').config();

// Central connection pool, reused across the app.
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  // Catches errors on idle clients so the process doesn't crash silently.
  console.error('Unexpected PostgreSQL pool error:', err);
});

module.exports = pool;
