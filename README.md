# Todo Application

A full-stack Todo app with clean CRUD functionality, split into three independent pieces:

```
todo-app/
├── sql/         → PostgreSQL schema (run this first)
├── backend/     → REST API (Node.js + Express + PostgreSQL)
└── frontend/    → UI (React + Vite)
```

No authentication is included — this is a single-user, open-access app by design.

## 1. Database (`/sql`)

1. Create a database:
   ```bash
   createdb -U postgres todo_db
   ```
2. Run the schema (creates the `todos` table, indexes, an `updated_at` trigger, and a few seed rows):
   ```bash
   psql -U postgres -d todo_db -f sql/schema.sql
   ```

## 2. Backend (`/backend`)

```bash
cd backend
npm install
npm run dev                # starts on http://localhost:5000 (nodemon)
# or: npm start
```

**Endpoints** (base path `/api/todos`):

| Method | Path         | Description                                   |
|--------|--------------|------------------------------------------------|
| GET    | `/`          | List todos. Optional query: `completed`, `priority`, `search` |
| GET    | `/:id`       | Get a single todo                              |
| POST   | `/`          | Create a todo (`title` required)               |
| PUT    | `/:id`       | Update a todo (partial updates supported)       |
| DELETE | `/:id`       | Delete a todo                                   |

Health check: `GET /api/health`

## 3. Frontend (`/frontend`)

```bash
cd frontend
npm install
npm run dev                # starts on http://localhost:5173
```

## Features

- Create, read, update, delete todos
- Mark complete/incomplete
- Priority levels (low / medium / high)
- Optional description and due date
- Client-side filtering (all / active / completed) and search
- Responsive, clean UI — works down to mobile widths
- Centralized error handling and input validation on the API

## Tech stack

- **Frontend:** React 18, Vite
- **Backend:** Node.js, Express, `pg` (node-postgres)
- **Database:** PostgreSQL
