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
        this.deadline = deadline;
        this.created_at = created_at;
        this.completed = completed;
        this.urgency = urgency;
    }

    static async createTask(data){
        let task = (await db.run("Insert into Tasks (category, title, body, deadline, completed, urgency) values (?,?,?,?,?,?)", data.category, data.title, data.body, data.deadline, data.completed, data.urgency)).lastID;
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
        console.log("Updating in prog")
        let task = await db.get("Update Tasks set category = ?, title = ?, body = ?, deadline = ?, created_at = ?, completed = ?, urgency = ? where id = ?", data.category, data.title, data.body, data.deadline, data.created_at, data.completed, data.urgency, task_id);

        return {
            id: task_id,
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

    static async deleteTask(id) {
        let task = await db.run("DELETE FROM Tasks WHERE id = ?", id);
        let task2 = await db.run("DELETE FROM UserTasks WHERE task_id = ?", id);
        return task;
    }
    
}


// {"title": "Insert Title", "body": "Inserted Body", "deadline": "2030-10-13"}