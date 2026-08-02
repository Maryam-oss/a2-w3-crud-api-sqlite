# Persistent Task Manager API (SQLite)

A RESTful CRUD API for managing tasks, built with **Node.js**, **Express**, and **SQLite** (`better-sqlite3`).

---

## Database Schema

The SQLite database (`tasks.db`) contains a single `tasks` table with the following schema:

| Field   | Type      | Details                     |
|---------|-----------|------------------------------|
| `id`    | `INTEGER` | Primary Key, Auto-increment  |
| `title` | `TEXT`    | Required                     |
| `done`  | `INTEGER` | `0` (false) or `1` (true)    |

![DB Browser Screenshot](./db-screenshot.png)

---

## API Endpoints

| Method   | Endpoint      | Description               | Status Code                                     |
|----------|---------------|-----------------------------|--------------------------------------------------|
| `GET`    | `/tasks`      | Retrieve all tasks          | `200 OK`                                         |
| `GET`    | `/tasks/:id`  | Retrieve a task by ID       | `200 OK` / `404 Not Found`                       |
| `POST`   | `/tasks`      | Create a new task           | `201 Created` / `400 Bad Request`                |
| `PUT`    | `/tasks/:id`  | Update an existing task     | `200 OK` / `400 Bad Request` / `404 Not Found`   |
| `DELETE` | `/tasks/:id`  | Delete a task               | `204 No Content` / `404 Not Found`               |

---

## Setup & Running

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the server:**

   ```bash
   node index.js
   ```

   The API will start listening on `http://localhost:3000`.