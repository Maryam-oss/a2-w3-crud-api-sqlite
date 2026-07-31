const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// In-memory task store
let tasks = [
    { id: 1, title: 'Learn HTTP CRUD', done: true },
    { id: 2, title: 'Build Express routes', done: false },
    { id: 3, title: 'Test endpoints with curl', done: false }
];

// Stage 1 endpoints
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

// Stage 2 endpoints
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: `Task ${taskId} not found` });
    }

    res.json(task);
});

// Stage 3: POST /tasks - Create a new task with validation
app.post('/tasks', (req, res) => {
    const { title } = req.body;

    // Validation: check if title exists and is not just empty whitespace
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: "Title is required and cannot be empty" });
    }

    // Generate a new ID (highest existing ID + 1)
    const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

    const newTask = {
        id: nextId,
        title: title.trim(),
        done: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});