import {db} from './db.mjs';

// `
// CREATE TABLE Tasks (
//     id INTEGER PRIMARY KEY,
//     category CHECK(category IN ('work', 'school', 'personal')) DEFAULT 'personal',
//     title varchar(30),
//     body varchar(255),
//     deadline TEXT,
//     created_at TEXT DEFAULT CURRENT_TIMESTAMP
//     completed BOOLEAN DEFAULT FALSE
//     urgency INTEGER DEFAULT 0
// )`

export class Task {
    id;
    title;
    body;
    deadline;
    created_at;
    completed;
    urgency;

    constructor(id, category, title, body, deadline, created_at, completed, urgency){
        this.id = id;
        this.category = category;
        this.title = title;
        this.body = body;
        this.deadline = due_date;
        this.created_at = created_at;
        this.completed = completed;
        this.urgency = urgency;
    }

    static async createTask(data){
        let task = (await db.run("Insert into Tasks (title, body, deadline) values (?,?,?)", data.title, data.body, data.deadline)).lastID;
        return {
            id: task.lastID,
            category: data.category,
            title: data.title,
            body: data.body,
            deadline: data.deadline,
            created_at: data.created_at,
            completed: data.completed,
            urgency: data.urgency
        }
    }

    static async updateTask(task_id, data) {
        let task = await db.get("Update Tasks set title = ?, body = ?, deadline = ? where id = ?", data.title, data.body, data.deadline, task_id);

        return {
            id: task.lastID,
            category: data.category,
            title: data.title,
            body: data.body,
            deadline: data.deadline,
            created_at: data.created_at,
            completed: data.completed,
            urgency: data.urgency
        }

    };

    static async getTask(id){
        let task = await db.get("Select * from Tasks where id = ?", id);
        return {
            id: task.lastID,
            category: data.category,
            title: data.title,
            body: data.body,
            deadline: data.deadline,
            created_at: data.created_at,
            completed: data.completed,
            urgency: data.urgency
        }
    }

    // Gets a json list of all tasks. Can be parsed
    static async getAllTasks(){
        let tasks = await db.all("Select * from Tasks");
        return tasks
    }

    // counts tasks
    static async countTasks(){
        let taskCount = (await db.get("Select count(*) as count from Tasks")).count;
        return taskCount;
    }
    
}


// {"title": "Insert Title", "body": "Inserted Body", "due_date": "2030-10-13"}