const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// 1. Connects to (or automatically creates) tasks.db
const db = new Database('tasks.db');

// 2. Create the tasks table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0
  )
`);

// 3. Check if table is empty to prevent duplicate seeds on server restart
const count = db.prepare('SELECT COUNT(*) AS count FROM tasks').get().count;

if (count === 0) {
    const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
    insert.run('Buy milk', 0);
    insert.run('Walk the dog', 0);
    insert.run('Complete W3 assignment', 0);
    console.log('Seeded 3 initial tasks into tasks.db');
}

// Serve Swagger UI at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// In-memory task database
//let tasks = [
//{ id: 1, title: 'Learn HTTP CRUD', done: true },
//{ id: 2, title: 'Build Express routes', done: false },
//{ id: 3, title: 'Test endpoints with curl', done: false }
//];

// Stage 1: Meta & Health
app.get('/', (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});

app.get('/health', (req, res) => {
    res.json({ status: "ok" });
});

// Stage 2: Read endpoints
// 1. Get ALL tasks from database
app.get('/tasks', (req, res) => {
    // .all() executes the SELECT query and returns an array of all matching rows
    const tasks = db.prepare('SELECT * FROM tasks').all();

    // Format done column back to boolean (0 -> false, 1 -> true)
    const formattedTasks = tasks.map(task => ({
        ...task,
        done: Boolean(task.done)
    }));

    res.status(200).json(formattedTasks);
});

// 2. Get a SINGLE task by ID from database
app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;

    // .get(id) safely passes 'id' into the '?' placeholder
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({
        ...task,
        done: Boolean(task.done)
    });
});
// Stage 3: Create endpoint
app.post('/tasks', (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: "Title is required and cannot be empty" });
    }

    const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

    const newTask = {
        id: nextId,
        title: title.trim(),
        done: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Stage 4: Update endpoint
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: `Task ${taskId} not found` });
    }

    const { title, done } = req.body;

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({ error: "Title cannot be empty" });
    }

    if (title !== undefined) {
        tasks[taskIndex].title = title.trim();
    }
    if (done !== undefined) {
        tasks[taskIndex].done = Boolean(done);
    }

    res.json(tasks[taskIndex]);
});

// Stage 4: Delete endpoint
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: `Task ${taskId} not found` });
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});