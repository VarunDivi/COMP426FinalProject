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
        userEntryDiv.innerHTML = "<h1>Task App</h1>";

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
            console.log("Entered info for UserLoginDiv(), not validated")
            try{
                let user = await Users.userLogin(email, password);
                console.log(user);
                userLoginDiv.innerHTML = ""; // clears page, loads homediv after auth
                userLoginDiv.appendChild(this.createHomeDiv(user));
            } catch (e){
                console.log(e);
                alert(e);
            }
        });
        userLoginForm.appendChild(loginButton);

        userLoginDiv.appendChild(userLoginForm);

        // Test button
        let testButton = document.createElement('button');
        testButton.innerHTML = "Test";
        testButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            let data = {"first_name": "John", "last_name": "Doe", "email": "gmail.com", "password": "password", "zip": 12345};
            let user = await Users.getAllUserTasks(1);
            console.log(user);
        });

        userLoginDiv.appendChild(testButton);


        console.log("Out of userlogin button")
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
                await Users.createUser(data);
                console.log(data)
                // console.log(user)
                // createUserDiv.innerHTML = "";
                // createUserDiv.appendChild(this.createHomeDiv(user));
                console.log("After homediv reroute")
            } catch (e){
                console.log(e);
                alert(e);
            }
        });
        createUserForm.appendChild(createUserButton);

        createUserDiv.appendChild(createUserForm);
        console.log("Out of createuser button")
        return createUserDiv;
    }

    createHomeDiv(user){
        console.log("reach home div")
        console.log(user)
        // Creating home div. Contains space for welcoming user inserting User Name, space to list tasks, weather block at the bottom
        let homeDiv = document.createElement('div');
        homeDiv.classList.add('home');
        
        let welcomeDiv = document.createElement('div');
        welcomeDiv.classList.add('welcome');
        welcomeDiv.innerHTML = `Welcome ${user.first_name} ${user.last_name}. Here are your tasks!`;
        homeDiv.appendChild(welcomeDiv);

        // list of tasks as a div
        let taskList = document.createElement('div');
        taskList.classList.add('taskList');
        homeDiv.appendChild(taskList);

        // loops thru all the tasks via the Task.js method and parses each task from the list
        // Creates a button to view the contents of each task
        // Removes the button after it is clicked
        const loadTasks = async () => {
            console.log(`Reached loadtasks. User id: ${user.id}`)
            const taskList = await Users.getAllUserTasks(user.id);
            taskList.forEach(async(task)=>{
                let taskDiv = this.createTaskDiv(task); // We are passing in the parsed task
                let taskList = document.querySelector('.taskList'); // Retrieving the taskList div and adding to it
                taskList.appendChild(taskDiv);
            })
        }
        loadTasks();

        let logoutButton = document.createElement('button');
        logoutButton.innerHTML = "Logout";
        logoutButton.addEventListener('click', async (e) => {
            console.log("Logout Button Clicked");
            e.preventDefault();
            homeDiv.innerHTML = "";
            homeDiv.appendChild(this.userLoginDiv());
        });
        homeDiv.appendChild(logoutButton);

        // let seeWeatherButton = document.createElement('button');
        // seeWeatherButton.innerHTML = "See Weather";
        // seeWeatherButton.addEventListener('click', async (e) =>{            
        //     homeDiv.appendChild(weatherDiv);
        // });
        // homeDiv.appendChild(seeWeatherButton);
        console.log("reached end of homediv")
        return homeDiv;
    }

    // creates a div for each task
    createTaskDiv(task) {
        let taskDiv = document.createElement('div');
        taskDiv.classList.add('task');

        taskDiv.innerHTML = `
            <h1>${task.title}</h1>
            <p>${task.body}</p>
            <p>${task.due_date}</p>
            <p>${task.id}</p>
        `;

        // Button to edit task. Renders a editTaskDiv in the same div and same location
        let editButton = document.createElement('button');
        editButton.innerHTML = "Edit Task";
        editButton.addEventListener('click', async (e) => {
            e.preventDefault();
            taskDiv.innerHTML = "";
            taskDiv.appendChild(this.editTaskDiv(task));
        });
        taskDiv.appendChild(editButton);

        return taskDiv;
    }

    // creates a div for editing a task
    editTaskDiv(task){
        // Create a form to edit a task
        let editTaskDiv = document.createElement('div');
        editTaskDiv.classList.add('editTask');

        let editTaskForm = document.createElement('form');
        editTaskForm.classList.add('editTaskForm');
        // Prevent default form submission
        editTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        let titleInput = document.createElement('input');
        titleInput.setAttribute('type', 'text');
        titleInput.setAttribute('placeholder', 'Title');
        editTaskForm.appendChild(titleInput);

        let bodyInput = document.createElement('input');
        bodyInput.setAttribute('type', 'text');
        bodyInput.setAttribute('placeholder', 'Body');
        editTaskForm.appendChild(bodyInput);

        let dueDateInput = document.createElement('input');
        dueDateInput.setAttribute('type', 'text');
        dueDateInput.setAttribute('placeholder', 'Due Date');
        editTaskForm.appendChild(dueDateInput);

        let editTaskButton = document.createElement('button');
        editTaskButton.innerHTML = "Edit Task";
        editTaskButton.addEventListener('click', async (e) => {
            e.preventDefault();
            let title = titleInput.value;
            let body = bodyInput.value;
            let due_date = dueDateInput.value;
            console.log("Entered info for editTaskDiv, not validated")
            try{
                let data = {title, body, due_date};
                await Task.updateTask(task.id, data);
                console.log(data)
                // console.log(user)
                // createUserDiv.innerHTML = "";
                // createUserDiv.appendChild(this.createHomeDiv(user));
            } catch (e){
                console.log(e);
                alert(e);
            }
        });
        editTaskForm.appendChild(editTaskButton);
        editTaskDiv.appendChild(editTaskForm);

        return editTaskDiv;

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