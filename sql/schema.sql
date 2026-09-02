-- ============================================================
-- Todo Application - PostgreSQL Schema
-- ============================================================

-- Drop existing objects (safe re-run during development)
DROP TRIGGER IF EXISTS trg_todos_updated_at ON todos;
DROP FUNCTION IF EXISTS set_updated_at();
DROP TABLE IF EXISTS todos;

-- Enable UUID generation (built into modern PostgreSQL, but keep pgcrypto as fallback)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------
-- Table: todos
-- ------------------------------------------------------------
CREATE TABLE todos (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(255) NOT NULL CHECK (char_length(trim(title)) > 0),
    description TEXT,
    completed   BOOLEAN NOT NULL DEFAULT FALSE,
    priority    VARCHAR(10) NOT NULL DEFAULT 'medium'
                CHECK (priority IN ('low', 'medium', 'high')),
    due_date    DATE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Indexes for common query patterns
-- ------------------------------------------------------------
CREATE INDEX idx_todos_completed ON todos (completed);
CREATE INDEX idx_todos_due_date  ON todos (due_date);
CREATE INDEX idx_todos_created_at ON todos (created_at DESC);

-- ------------------------------------------------------------
-- Trigger: auto-update updated_at on row modification
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------
-- Seed data (optional - comment out if not needed)
-- ------------------------------------------------------------
INSERT INTO todos (title, description, completed, priority, due_date) VALUES
    ('Set up project repository', 'Initialize git repo and push initial commit', TRUE, 'high', CURRENT_DATE - INTERVAL '2 days'),
    ('Design database schema', 'Create the todos table with proper constraints', TRUE, 'high', CURRENT_DATE - INTERVAL '1 day'),
    ('Build REST API', 'Implement CRUD endpoints for todos', FALSE, 'high', CURRENT_DATE + INTERVAL '2 days'),
    ('Build React frontend', 'Create UI components for listing and managing todos', FALSE, 'medium', CURRENT_DATE + INTERVAL '4 days'),
    ('Write documentation', 'Add README with setup instructions', FALSE, 'low', CURRENT_DATE + INTERVAL '7 days');
