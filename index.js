const express = require('express');
const app = express();
const PORT = 3000;

// Stage 2: In-memory task store pre-filled with 3 sample tasks
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

// Stage 2: GET /tasks - Return all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Stage 2: GET /tasks/:id - Return a single task by ID
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: `Task ${taskId} not found` });
    }

    res.json(task);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});