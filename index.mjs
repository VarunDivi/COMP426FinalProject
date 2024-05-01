import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { Task } from './task.mjs';
import {Users} from './user.mjs';

const app = express();

const port = 3000;

app.use(bodyParser.json());
app.use(cors());


// Task routes

// Get all Tasks, no params
app.get('/tasks', async (req,res) => {
    let tasks = await Task.getAllTasks();
    if(tasks.length == 0){
        res.status(404).send("No tasks found");
        return;
    }
    // console.log(await Users.assignUserTask(4,3));
    res.status(200).json(tasks);
    return;
})

// Get a specific task, takes task id
app.get('/tasks/:id', async (req,res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id) || typeof id !== 'number' || id <= 0){
        res.status(400).send("Specified ID should be Positive numeric");
        return;
    }

    let task = await Task.getTask(id)

    res.status(200).json(task);
    return;
})

// Create a task, takes in a json object
// {"title": "Insert Title", "body": "Inserted Body", "deadline": "2030-10-13"}
app.post('/tasks', async (req,res) => {
    if(req.body.title == undefined || req.body.body == undefined || req.body.deadline == undefined){
        res.status(400).send("Invalid body")
        return;
    }

    let task = await Task.createTask(req.body)

    res.status(200).json(task);
    return;
})
// Update a task, takes in a json object

app.put('/tasks/:id', async (req,res) => {
    if(req.body.id == undefined){
        res.status(400).send("Invalid body")
        return;
    }

    let updatedTask = await Task.updateTask(req.params.id, req.body);

    res.status(200).json(updatedTask);
    return;
});


// User Routes

// Get all users, no params
app.get('/users', async (req,res) =>{
    let users = await Users.getAllUsers();
    if(users.length == 0){
        res.status(404).send("No users found");
        return;
    }

    res.status(200).json(users);
    return;
})

// Get a specific user, takes user id
app.get('/users/:id', async (req,res) => {
    const id = parseInt(req.params.id);

    if(isNaN(id) || typeof id !== 'number' || id <= 0){
        res.status(400).send("Specified ID should be Positive numeric");
        return;
    }

    let user = await Users.getUser(id);

    res.status(200).json(user);
    return;
})

// Get a specific user ID by email, takes email
app.get('/users/email/:email', async (req,res) => {
    let user = await Users.findUserIDByEmail(req.params.email);

    if(user == null){
        res.status(404).send("User not found")
        return;
    }

    res.status(200).json(user);
    return;
});

// Create a user, takes in a json object
// {"first_name": "Random", "last_name": "User", "email": "randuser@gmail.com", "password": "password", "zip": 12345}
app.post('/users', async (req,res) => {
    if(req.body.first_name == undefined || req.body.last_name == undefined || req.body.email == undefined || req.body.password == undefined || req.body.zip == undefined){
        res.status(400).send("Invalid body")
        return;
    }

    if(req.body.password.length < 8){
        console.log("Invalid password length")
        res.status(400).send("Password must be at least 8 characters long")
        return;
    }

    let user = await Users.createUser(req.body);
    console.log(user)
    if(user){
        res.status(200).json(user);
        return;
    } else {
        res.status(500).send("User already exists")
        return;
    }
})

// Log in a user, takes in a json object
// {"email": "jdoe@gmail.com", "password": "password"}
app.post('/login', async (req,res) => {
    if(req.body.email == undefined || req.body.password == undefined){
        res.status(400).send("Invalid body")
        return;
    }

    let user = await Users.userLogin(req.body.email, req.body.password);
    if(user == null){
        res.status(404).send("Invalid email or password")
        return;
    }

    res.status(200).json(user);
    return;

})

// Update a user, takes in a json object. Finds user id from json email attribute
// {"first_name": "Random_updated", "last_name": "User", "email": "randuser@gmail.com", "password": "password", "zip": 12345}
app.put('/users', async (req,res) => {
    if(req.body.email == undefined){
        res.status(400).send("Invalid body")
        return;
    }

    let user_id = await Users.findUserIDByEmail(req.body.email);
    if(user_id == null){
        res.status(404).send("User not found")
        return;
    }

    let updatedUser = await Users.updateUser(user_id.id, req.body);

    res.status(200).json(updatedUser);
    return;
})

// Assigning a task to a user, takes in a json object
// {"user_id": 1, "task_id": 1}
app.post('/users/assign', async (req,res) => {
    if(req.body.user_id == undefined || req.body.task_id == undefined){
        res.status(400).send("Invalid body")
        return;
    }

    let assignment = await Users.assignUserTask(req.body.user_id, req.body.task_id);

    if(assignment == null){
        res.status(404).send("User or Task not found or UserTask already exists")
        return;
    }

    res.status(200).json(assignment);
    return;
})

// Get all tasks assigned to a user, takes in user id
app.get('/users/:id/tasks', async (req,res) => {
    const id = parseInt(req.params.id);

    if(isNaN(id) || typeof id !== 'number' || id <= 0){
        res.status(400).send("Specified ID should be Positive numeric");
        return;
    }

    let tasks = await Users.getUserTasks(id);

    if(tasks == null){
        res.status(404).send("User not found")
        return;
    }

    if(tasks.length == 0){
        res.status(200).send(`No tasks assigned to user ${id}`)
        return;
    }

    res.status(200).json(tasks);
    return;
})


//Creating default task on startup
console.log(await Task.countTasks());
if(await Task.countTasks() == 0){
    await Task.createTask({
        category: "work",
        title: "Task 1",
        body: "This is the first task",
        deadline: "2024-4-30",
        completed: false,
        urgency: 1
    })

    await Task.createTask({
        category: "work",
        title: "Task 2",
        body: "This is the second task",
        deadline: "2024-4-30",
        completed: false,
        urgency: 0,
    })

    await Task.createTask({
        category: "work",
        title: "Task 3",
        body: "This is the third task",
        deadline: "2024-4-30",
        completed: false,
        urgency: 0,
    })

    await Task.createTask({
        category: "work",
        title: "Task 4",
        body: "This is the fourth task",
        deadline: "2024-4-30",
        completed: false,
        urgency: 0,
    })

    await Task.createTask({
        category: "work",
        title: "Task 5",
        body: "This is the fifth task",
        deadline: "2024-4-30",
        completed: false,
        urgency: 0,
    })
}

if(await Users.countUsers() == 0){
    Users.createUser({
        first_name: "John",
        last_name: "Doe",
        email: "jdoe@gmail.com",
        password: "password",
        zip: 12345
    });
    
    Users.createUser({
        first_name: "Jane",
        last_name: "Doe",
        email: "Janedoe@gmail.com",
        password: "password",
        zip: 12345
    });

    Users.createUser({
        first_name: "Ron",
        last_name: "Smith",
        email: "rsmith@gmail.com",
        password: "password",
        zip: 12345
    });
}

console.log(`Num user tasks ${Users.countUserTask()}`);
if(await Users.countUserTask() == 0){
    // Assigning User 1 to Task 1. John to Task 1
    Users.assignUserTask(1,1);
    // Assigning User 2 to Task 2. Jane to Task 2
    Users.assignUserTask(1,2);
    // Assigning User 3 to Task 3. Ron to Task 3
    Users.assignUserTask(2,3);
}


app.use('*', (req, res) => {
    console.log(`Unexpected request to ${req.originalUrl}`);
    res.status(404).send('Page not found');
  });
  

app.listen(port, () => {
    console.log(`Running on ${port}`)
})

