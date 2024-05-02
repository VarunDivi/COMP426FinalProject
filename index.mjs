import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { Task } from './task.mjs';
import {Users} from './user.mjs';

const app = express();

const port = 3000;

app.use(bodyParser.json());
app.use(cors());


app.get('/weather/:zip', async (req,res) => {
    const params = new URLSearchParams({
        access_key: '828f10461dc621ae54706c2377e48769',
        query: req.params.zip
    });
    
    let response = await fetch(`http://api.weatherstack.com/current?${params}`)
    let weather_raw = await response.json();
    let weather_clean = {
        temperature: weather_raw.current.temperature,
        precipitation: weather_raw.current.precip,
        humidity: weather_raw.current.humidity,
        city: weather_raw.location.name,
        icon: weather_raw.current.weather_icons[0]
    }
    res.status(200).json(weather_clean);
    
})

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

// Deletes a task by ID
app.delete('/tasks/:id', async (req, res) => {
    if (req.params.id == undefined) {
        res.status(400).send("Invalid ID");
        return;
    }

    let deleteTask = await Task.deleteTask(req.params.id);

    res.status(200).json(deleteTask);
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
    console.log("Index user created")
    console.log(user.zip)
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

    // if(tasks.length == 0){
    //     res.status(200).send(`No tasks assigned to user ${id}`)
    //     return;
    // }

    res.status(200).json(tasks);
    return;
})


//Creating default task on startup
console.log(await Task.countTasks());
if(await Task.countTasks() == 0){
    await Task.createTask({
        category: "work",
        title: "Send work email",
        body: "Send an email to manager",
        deadline: "2024-05-05",
        completed: false,
        urgency: 1
    })

    await Task.createTask({
        category: "School",
        title: "Finish 426 Final Project",
        body: "Record video and publis",
        deadline: "2024-05-02",
        completed: false,
        urgency: 6,
    })

    await Task.createTask({
        category: "school",
        title: "Finish 562 Final Project",
        body: "Finish writing paper",
        deadline: "2024-05-1",
        completed: false,
        urgency: 9,
    })

    await Task.createTask({
        category: "personal",
        title: "Car Registration",
        body: "Renew Car Registration",
        deadline: "2024-06-05",
        completed: false,
        urgency: 2,
    })

    await Task.createTask({
        category: "work",
        title: "Submit weekly update",
        body: "Update HR",
        deadline: "2024-05-05",
        completed: false,
        urgency: 6,
    })
}

// Edit example
if(await Users.countUsers() == 0){
    await Users.createUser({
        first_name: "John",
        last_name: "Doe",
        email: "jdoe@gmail.com",
        password: "password",
        zip: 27516
    });
    
    // create
    await Users.createUser({
        first_name: "Deborah",
        last_name: "Doe",
        email: "ddoe@gmail.com",
        password: "password",
        zip: 27514
    });

    // Delete Example
    await Users.createUser({
        first_name: "Ron",
        last_name: "Smith",
        email: "rsmith@gmail.com",
        password: "password",
        zip: 77554
    });

    // New User | ALL demonstration
}

console.log(`Num user tasks ${Users.countUserTask()}`);
if(await Users.countUserTask() == 0){
    // Assigning User 1 to Task 1. John to Task 1
    await Users.assignUserTask(1,1);
    // Assigning User 2 to Task 2. Jane to Task 2
    await Users.assignUserTask(2,2);
    // Assigning User 3 to Task 3. Ron to Task 3
    await Users.assignUserTask(2,3);
    await Users.assignUserTask(2,4);
    await Users.assignUserTask(2,5);
}


app.use('*', (req, res) => {
    console.log(`Unexpected request to ${req.originalUrl}`);
    res.status(404).send('Page not found');
  });
  

app.listen(port, () => {
    console.log(`Running on ${port}`)
})

