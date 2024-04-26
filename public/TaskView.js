import {Task} from './Task.js';
export class TaskView {
    constructor(rootDiv){
        this.rootDiv = rootDiv;
        this.homeDiv = this.createHomeDiv();

        this.rootDiv.appendChild(this.homeDiv);
    }

    createHomeDiv(){
        // Creating home div
        let homeDiv = document.createElement('div');
        homeDiv.classList.add('home');

        // list of tasks as a div
        let taskList = document.createElement('div');
        taskList.classList.add('taskList');
        homeDiv.appendChild(taskList);

        // loops thru all the tasks via the Task.js method and parses each task from the list
        // Creates a button to view the contents of each task
        const loadTasks = async () => {
            const taskList = await Task.findAllTasks();
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