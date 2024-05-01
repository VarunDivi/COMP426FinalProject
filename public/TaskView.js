import {Task} from './Task.js';
import {Users} from './User.js';
export class TaskView {
    constructor(rootDiv){
        this.rootDiv = rootDiv;
        let userEntryDiv = this.userEntryDiv();
        this.rootDiv.appendChild(userEntryDiv);
    }

    userEntryDiv(){
        // 2 buttons. One to login, one to create user
        let userEntryDiv = document.createElement('div');
        userEntryDiv.classList.add('userEntry');
        userEntryDiv.innerHTML = "<h1 id = title>Welcome to MyTaskApp</h1>";

        let loginButton = document.createElement('button');
        loginButton.classList.add('loginButton');
        loginButton.innerHTML = "Login";
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Login Button Clicked");
            this.rootDiv.innerHTML = "";
            this.rootDiv.appendChild(this.userLoginDiv());
        });
        userEntryDiv.appendChild(loginButton);

        let createUserButton = document.createElement('button');
        createUserButton.classList.add('createUserButton');
        createUserButton.innerHTML = "Create User";
        createUserButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Create User Button Clicked");
            this.rootDiv.innerHTML = "";
            this.rootDiv.appendChild(this.createUserDiv());
        });
        userEntryDiv.appendChild(createUserButton);

        return userEntryDiv;
    }

    userLoginDiv(){
        console.log("User Login Div routed to")
        // Displays the user login div by default but a user can route to the create user div
        let userLoginDiv = document.createElement('div');
        userLoginDiv.classList.add('userLogin');

        // User Login Form
        let userLoginForm = document.createElement('form');
        userLoginForm.classList.add('userLoginForm');
        // Prevent default form submission
        userLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        let emailInput = document.createElement('input');
        emailInput.setAttribute('type', 'text');
        emailInput.setAttribute('placeholder', 'Email');
        userLoginForm.appendChild(emailInput);

        let passwordInput = document.createElement('input');
        passwordInput.setAttribute('type', 'password');
        passwordInput.setAttribute('placeholder', 'Password');
        userLoginForm.appendChild(passwordInput);

        let loginButton = document.createElement('button');
        loginButton.innerHTML = "Login";
        loginButton.addEventListener('click', async (e) => {
            e.preventDefault();
            let email = emailInput.value;
            let password = passwordInput.value;
            try{
                let user = await Users.userLogin(email, password);
                userLoginDiv.innerHTML = ""; // clears page, loads homediv after auth
                userLoginDiv.appendChild(this.createHomeDiv(user));
            } catch (e){
                console.log(e);
                let error_div = document.createElement('div');
                error_div.classList.add('error');
                error_div.innerHTML = "Invalid email or password";
                userLoginDiv.appendChild(error_div);
            }
        });
        userLoginForm.appendChild(loginButton);

        userLoginDiv.appendChild(userLoginForm);

        //Back to home
        let goHomeButton = document.createElement('button');
        goHomeButton.innerHTML = "Back to Home";
        goHomeButton.addEventListener('click', async (e) => {
            console.log("Back to Login Button Clicked");
            e.preventDefault();
            this.rootDiv.innerHTML = "";
            this.rootDiv.appendChild(this.userEntryDiv());
        });

        userLoginDiv.appendChild(goHomeButton);

        return userLoginDiv;
        
    };

    createUserDiv(){
        console.log("Create User Div routed to");
        // Create User Div. Contains form to create a user
        let createUserDiv = document.createElement('div');
        createUserDiv.classList.add('createUser');

        let createUserForm = document.createElement('form');
        createUserForm.classList.add('createUserForm');
        // Prevent default form submission
        createUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        let firstNameInput = document.createElement('input');
        firstNameInput.setAttribute('type', 'text');
        firstNameInput.setAttribute('placeholder', 'First Name');
        createUserForm.appendChild(firstNameInput);

        let lastNameInput = document.createElement('input');
        lastNameInput.setAttribute('type', 'text');
        lastNameInput.setAttribute('placeholder', 'Last Name');
        createUserForm.appendChild(lastNameInput);

        let emailInput = document.createElement('input');
        emailInput.setAttribute('type', 'text');
        emailInput.setAttribute('placeholder', 'Email');
        createUserForm.appendChild(emailInput);

        let passwordInput = document.createElement('input');
        passwordInput.setAttribute('type', 'password');
        passwordInput.setAttribute('placeholder', 'Password');
        createUserForm.appendChild(passwordInput);

        let zipInput = document.createElement('input');
        zipInput.setAttribute('type', 'text');
        zipInput.setAttribute('placeholder', 'Zip Code');
        createUserForm.appendChild(zipInput);

        let createUserButton = document.createElement('button');
        createUserButton.setAttribute('type', 'submit');
        createUserButton.innerHTML = "Create User";
        createUserButton.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            let first_name = firstNameInput.value;
            let last_name = lastNameInput.value;
            let email = emailInput.value;
            let password = passwordInput.value;
            let zip = zipInput.value;
            console.log("Entered info for createUserDiv, not validated")
            try{
                let data = {first_name, last_name, email, password, zip};
                const user_created = await Users.createUser(data);
                console.log("Printing user retrieved down")
                createUserDiv.innerHTML = "";
                createUserDiv.appendChild(this.createHomeDiv(user_created));
                console.log("After homediv reroute")
            } catch (e){
                let error_mes = document.createElement('p');
                error_mes.innerHTML = "Error creating user. Password must be >8 characters, email must be unique, and zip must be a number.";
                createUserDiv.appendChild(error_mes);
                console.log(e);
            }
        });

        let goHomeButton = document.createElement('button');
        goHomeButton.innerHTML = "Back to Login";
        goHomeButton.addEventListener('click', async (e) => {
            console.log("Back to Login Button Clicked");
            e.preventDefault();
            createUserDiv.innerHTML = "";
            createUserDiv.appendChild(this.userEntryDiv());
        });

        createUserForm.appendChild(createUserButton);
        createUserDiv.appendChild(goHomeButton);
        createUserDiv.appendChild(createUserForm);
        console.log("Out of createuser button")
        return createUserDiv;
    }

    createHomeDiv(user){
        console.log("User info")
        console.log(user)
        console.log("reach home div")
        // Creating home div. Contains space for welcoming user inserting User Name, space to list tasks, weather block at the bottom
        let homeDiv = document.createElement('div');
        homeDiv.classList.add('home');
        
        let welcomeDiv = document.createElement('div');
        welcomeDiv.classList.add('welcome');
        welcomeDiv.innerHTML = `<h1> Welcome ${user.first_name} ${user.last_name}. Here are your tasks! </h1>`;
        homeDiv.appendChild(welcomeDiv);

        // list of tasks as a div
        let taskList = document.createElement('div');
        taskList.classList.add('taskList');
        homeDiv.appendChild(taskList);

        // loops thru all the tasks via the Task.js method and parses each task from the list
        // Creates a button to view the contents of each task
        // Removes the button after it is clicked
        const loadTasks = async () => {
            try {
            console.log(`Reached loadtasks. User id: ${user.id}`)
            const taskList = await Users.getAllUserTasks(user.id);
            taskList.forEach(async(task)=>{
                console.log("Task info")
                let taskDiv = this.loadTaskDiv(task, user); // We are passing in the parsed task
                let taskList = document.querySelector('.taskList'); // Retrieving the taskList div and adding to it
                taskList.appendChild(taskDiv);
            })
        } catch (e) {
            let error_div = document.createElement('div');
            error_div.classList.add('error');
            error_div.innerHTML = "Error loading tasks";
            homeDiv.appendChild(error_div);
        }
        }
        loadTasks();

        let logoutButton = document.createElement('button');
        logoutButton.innerHTML = "Logout";
        logoutButton.addEventListener('click', async (e) => {
            console.log("Logout Button Clicked");
            e.preventDefault();
            this.rootDiv.innerHTML = "";
            this.rootDiv.appendChild(this.userLoginDiv());
        });
        homeDiv.appendChild(logoutButton);

        let createTaskButton = document.createElement('button');
        createTaskButton.innerHTML = "Create Task";
        createTaskButton.addEventListener('click', async (e) => {
            console.log("Create Task Button Clicked");
            e.preventDefault();
            this.rootDiv.innerHTML = "";
            this.rootDiv.appendChild(this.createTaskDiv(user));
        });

        homeDiv.appendChild(createTaskButton);
        let phraseDivView = this.createPhraseDiv();
        homeDiv.append(phraseDivView);

        let weatherDiv = document.createElement('div');
        weatherDiv.classList.add('weather');

        const weather = async () => {
            console.log(user.zip);
            let weather_return = await Users.seeWeather(user.zip);

            weatherDiv.innerHTML = `<p> City: ${weather_return.city} Temperature: ${weather_return.temperature} Humidity: ${weather_return.humidity} </p>`;
            let weather_icon = document.createElement('img');
            weather_icon.src = weather_return.icon;
            weatherDiv.appendChild(weather_icon);
            weather_icon.id = "weather_icon";

            console.log("Weather return")
        }
        homeDiv.appendChild(weatherDiv);

        weather();

        console.log("reached end of homediv")
        return homeDiv;
    }

// This function uses the edit form to create a new task in the createTaskDiv
createTaskDiv(user){
    let createTaskDiv = document.createElement('div');
    createTaskDiv.classList.add('createTask');

    let createTaskForm = document.createElement('form');
    createTaskForm.classList.add('createTaskForm');

    let titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('name', 'title');
    titleInput.setAttribute('placeholder', 'Title');
    createTaskForm.appendChild(titleInput);

    let categoryInput = document.createElement('input');
    categoryInput.setAttribute('type', 'text');
    categoryInput.setAttribute('name', 'category');
    categoryInput.setAttribute('placeholder', 'Category');
    createTaskForm.appendChild(categoryInput);

    let bodyInput = document.createElement('input');
    bodyInput.setAttribute('type', 'text');
    bodyInput.setAttribute('name', 'body');
    bodyInput.setAttribute('placeholder', 'Body');
    createTaskForm.appendChild(bodyInput);

    let deadlineInput = document.createElement('input');
    deadlineInput.setAttribute('type', 'text');
    deadlineInput.setAttribute('name', 'deadline');
    deadlineInput.setAttribute('placeholder', 'Deadline');
    createTaskForm.appendChild(deadlineInput);

    let completedInput = document.createElement('input');
    completedInput.setAttribute('type', 'text');
    completedInput.setAttribute('name', 'completed');
    completedInput.setAttribute('placeholder', 'Completed');
    createTaskForm.appendChild(completedInput);

    let urgencyInput = document.createElement('input');
    urgencyInput.setAttribute('type', 'text');
    urgencyInput.setAttribute('name', 'urgency');
    urgencyInput.setAttribute('placeholder', 'Urgency');
    createTaskForm.appendChild(urgencyInput);

    let createTaskButton = document.createElement('button');
    createTaskButton.innerHTML = "Create Task";
    createTaskButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const formData = new FormData(createTaskForm);
        const data = {
            category: formData.get('category'),
            title: formData.get('title'),
            body: formData.get('body'),
            deadline: formData.get('deadline'),
            completed: formData.get('completed'),
            urgency: formData.get('urgency')
        };
        try {
            let task = await Task.createTask(data);
            console.log(user.id, task.id)
            await Users.assignUserTask(user.id, task.id);
            console.log(task);
            this.rootDiv.innerHTML = "";
            this.rootDiv.appendChild(this.createHomeDiv(user));
        } catch (error) {
            console.error(error);
            let error_div = document.createElement('div');
            error_div.classList.add('error');
            error_div.innerHTML = "Error creating task";
            createTaskDiv.appendChild(error_div);
        }
    });

    createTaskForm.appendChild(createTaskButton);
    createTaskDiv.appendChild(createTaskForm);

    return createTaskDiv;
}

// This function loads a div for each task
loadTaskDiv(task, user) {
    console.log("1." + user)
    let taskDiv = document.createElement('div');
    taskDiv.classList.add('task');

    this.updateTaskDivContent(taskDiv, task, user);

    return taskDiv;
}

// Updates the content of the taskDiv with task details
updateTaskDivContent(taskDiv, task, user) {
    console.log("2." + user);
    taskDiv.innerHTML = `
        <h1>${task.title}</h1>
        <p>Category: ${task.category}</p>
        <p>Body: ${task.body}</p>
        <p>Deadline: ${task.deadline}</p>
        <p>Updated on: ${task.created_at}</p>
        <p>Complete: ${task.completed}</p>
        <p>Urgency: ${task.urgency}</p>
        <button id=edit>Edit Task</button>
        <button id=delete>Delete Task</button>
    `;

    taskDiv.querySelector('#edit').addEventListener('click', (e) => {
        e.preventDefault();
        this.showEditForm(taskDiv, task, user);
    });
    taskDiv.querySelector('#delete').addEventListener('click', async (e) => {
        e.preventDefault();
        await Task.deleteTask(task.id);
        this.rootDiv.innerHTML = '';
        this.rootDiv.appendChild(this.createHomeDiv(user));
    });
    
}

// Show edit form in the taskDiv
showEditForm(taskDiv, task, user) {
    taskDiv.innerHTML = ''; // Clear the existing content
    let form = document.createElement('form');
    form.innerHTML = `
        <input type="text" name="title" placeholder="Title" value="${task.title}">
        <input type="text" name="category" placeholder="Category" value="${task.category}">
        <input type="text" name="body" placeholder="Body" value="${task.body}">
        <input type="text" name="deadline" placeholder="Deadline" value="${task.deadline}">
        <input type="text" name="completed" placeholder="Completed" value="${task.completed}">
        <input type="text" name="urgency" placeholder="Urgency" value="${task.urgency}">
        <button type="submit">Save Changes</button>
    `;
    taskDiv.appendChild(form);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            title: formData.get('title'),
            category: formData.get('category'),
            body: formData.get('body'),
            deadline: formData.get('deadline'),
            completed: formData.get('completed'),
            urgency: formData.get('urgency')
        };
        try {
            let updatedTask = await Task.updateTask(task.id, data);
            this.updateTaskDivContent(taskDiv, updatedTask, user);
        } catch (error) {
            console.error(error);
            let error_div = document.createElement('div');
            error_div.classList.add('error');
            error_div.innerHTML = "Error updating task";
            taskDiv.appendChild(error_div);
        }
    });
}

createPhraseDiv() {
    let phraseDiv = document.createElement('div');
    phraseDiv.classList.add('phrase');

    phraseDiv.innerHTML = `
        <div>
        <button id=phrase-button>Get Inspirational Phrase</button>
        </div>
    `;
    let query = phraseDiv.querySelector('#phrase-button');

    let inspirationalPhraseDiv = document.createElement('h5');
    query.addEventListener('click', async () => {

        let phrase = (await fetch("https://corporatebs-generator.sameerkumar.website/"));
        let phraseJson = await phrase.json();

        let inspirationalPhrase = phraseJson.phrase;
        
        inspirationalPhraseDiv.innerHTML = `<p>${inspirationalPhrase}</p>`;
        phraseDiv.append(inspirationalPhraseDiv);

    });

    return phraseDiv;
}


    // createWeatherDiv(){
    //     let weatherDiv = document.createElement('div');
    //     weatherDiv.classList.add('weather');

    //     let weather = await fetch("http://localhost:3000/weather");
    //     let weatherJson = await weather.json();

    //     weatherDiv.innerHTML = `
    //         <h1>${weatherJson.city}</h1>
    //         <p>${weatherJson.temperature}</p>
    //         <p>${weatherJson.weather}</p>
    //     `;

    //     return weatherDiv;
    // }
}

