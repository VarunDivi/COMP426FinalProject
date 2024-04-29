import {Task} from './Task.js';
import { TaskView } from './TaskView.js';

console.log("Ran app");


// Simply starts the view attached to the container div
new TaskView(document.querySelector('.container'));
