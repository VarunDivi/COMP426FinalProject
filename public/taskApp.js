import {Task} from './Task.js';
import { TaskView } from './TaskView.js';

console.log("Ran app");


// Simply starts the view attached to the taskManager div
new TaskView(document.querySelector('#taskManager'));
