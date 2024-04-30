import {Task} from './Task.js';
import {Users} from './User.js';
export class TaskView {
    constructor(rootDiv){
        this.rootDiv = rootDiv;
        let userLoginDiv = this.userLoginDiv();
        this.rootDiv.appendChild(userLoginDiv);
    }

    userLoginDiv(){
        // Displays the user login div by default but a user can route to the create user div
        let userLoginDiv = document.createElement('div');
        userLoginDiv.classList.add('userLogin');

        // User Login Form
        let userLoginForm = document.createElement('form');
        userLoginForm.classList.add('userLoginForm');

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
            console.log("Entered info, not validated")
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

        // Create User Button. Routes to createUserDiv
        let createUserButton = document.createElement('button');
        createUserButton.innerHTML = "Create User";
        createUserButton.addEventListener('click', (e) => {
            this.rootDiv.innerHTML = "";
            this.rootDiv.appendChild(this.createUserDiv());
        });
        userLoginForm.appendChild(createUserButton);

        userLoginDiv.appendChild(userLoginForm);

        return userLoginDiv;
    }

    createHomeDiv(user){
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
        const loadTasks = async () => {
            const taskList = await Users.getAllUserTasks(user.id);
            taskList.forEach(async(task)=>{
                let seeTasksButton = document.createElement('button');
                seeTasksButton.innerHTML = "See Tasks";
                seeTasksButton.addEventListener('click', async (e) => {
                    let taskDiv = this.createTaskDiv(task); // We are passing in the parsed task
                    let taskList = document.querySelector('.taskList'); // Retrieving the taskList div and adding to it
                    taskList.appendChild(taskDiv);
                });
                homeDiv.appendChild(seeTasksButton);
            })
        }

        loadTasks();

        let phraseDivView = this.createPhraseDiv();
        homeDiv.append(phraseDivView);

        let logoutButton = document.createElement('button');
        logoutButton.innerHTML = "Logout";
        logoutButton.addEventListener('click', (e) => {
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
        `;

        return taskDiv;
    }


    createPhraseDiv(){
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
 
}