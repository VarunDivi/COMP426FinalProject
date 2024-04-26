import express from 'express'
import bodyParser from 'body-parser'
import { Task } from './task.mjs';

const app = express();

const port = 3000;

app.use(bodyParser.json());

app.get('/', async (req,res) => {
    res.send("Hi");
})

app.get('/tasks', async (req,res) => {
    let tasks = await Task.getAllTasks();
    res.status(200).json(tasks);
})

app.get('/tasks/:id', async (req,res) => {
    if(isNaN(id) || typeof id !== 'number' || id <= 0){
        res.status(400).send("Specified ID should be Positive numeric");
    }

    const id = parseInt(req.params.id);
    let task = await Task.getTask(id)

    res.status(200).json(task);
})

app.post('/tasks', async (req,res) => {
    if(req.body.title == undefined || req.body.body == undefined || req.body.due_date == undefined){
        res.status(400).send("Invalid body")
    }

    let task = await Task.createTask(req.body)

    res.status(200).json(task);
})

//Creating default task on startup
Task.createTask({
    title: "Task 1",
    body: "This is the first task",
    due_date: "2024-4-30"
})

Task.createTask({
    title: "Task 2",
    body: "This is the second task",
    due_date: "2024-4-30"
})



app.listen(port, () => {
    console.log(`Running on ${port}`)
})

