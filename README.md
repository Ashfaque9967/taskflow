# TaskFlow

A full-stack task management API built with **Node.js**, **Express**, **Prisma**, and **PostgreSQL**. Designed for teams to collaborate on projects, assign tasks, track progress, and stay organized.

---

## Features

- **Authentication** — Secure JWT-based auth with bcrypt password hashing
- **Project Management** — Create, update, delete projects with team collaboration
- **Task Management** — Full CRUD with status tracking, priorities, due dates, and assignments
- **Team Collaboration** — Invite members to projects with role-based access
- **Comments** — Discuss tasks in real-time
- **Activity Log** — Track every change across projects and tasks

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcrypt |
| Validation | Zod |

---

## API Reference

**Base URL:** `https://taskflow-api-xwz6.onrender.com`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Login and receive JWT token |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user/me` | Get current user profile |
| `GET` | `/api/users` | List all users (for task assignment) |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/projects` | List all your projects |
| `PATCH` | `/api/projects/:id` | Update a project |
| `DELETE` | `/api/projects/:id` | Delete a project |
| `POST` | `/api/projects/:id/members` | Invite a member |
| `GET` | `/api/projects/:id/members` | List project members |
| `DELETE` | `/api/projects/:id/members/:userId` | Remove a member |
| `GET` | `/api/projects/:id/activity` | View activity log |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tasks` | Create a task in a project |
| `GET` | `/api/tasks` | List tasks (filter by project, status, priority) |
| `PATCH` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `POST` | `/api/tasks/:id/comments` | Add a comment |
| `GET` | `/api/tasks/:id/comments` | List comments |

---

## Quick Start

### Register a new user

```bash
curl -X POST https://taskflow-api-xwz6.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"password123","name":"Your Name"}'
```

### Login

```bash
curl -X POST https://taskflow-api-xwz6.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"password123"}'
```

### Create a project (use token from login)

```bash
curl -X POST https://taskflow-api-xwz6.onrender.com/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"My First Project","description":"Getting started with TaskFlow"}'
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request — validation error |
| `401` | Unauthorized — invalid or missing token |
| `404` | Not Found |
| `500` | Server Error |

---

## Response Format

All responses are JSON:

```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

Errors return:

```json
{
  "error": "Description of what went wrong"
}
```

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Run database migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Start development server
npm run dev
```

---

## Project Structure

```
src/
├── config/           # Database configuration
├── controllers/      # Business logic (auth, project, task, user)
├── middleware/       # Auth middleware
├── routes/           # API route definitions
├── schemas/          # Zod validation schemas
├── tests/            # Test scripts
└── utils/            # Helper functions
```

---

## Database Schema

- **User** — accounts and authentication
- **Project** — project containers with owners
- **Task** — tasks with status, priority, assignment
- **ProjectMember** — team collaboration with roles
- **Comment** — task discussions
- **ActivityLog** — audit trail of all changes

---

## License

MIT

---

Built with care by **Ashfaque**
