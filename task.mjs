import {db} from './db.mjs';

export class Task {
    id;
    title;
    body;
    due_date;

    constructor(id, title, body, due_date){
        this.id = id;
        this.title = title;
        this.body = body;
        this.due_date = due_date;
    }

    static async createTask(data){
        let task = (await db.run("Insert into Tasks (title, body, due_date) values (?,?,?)", data.title, data.body, data.due_date)).lastID;
        return {
            id: task.lastID,
            title: data.title,
            body: data.body,
            due_date: data.due_date
        }
    }

    static async getTask(id){
        let task = await db.get("Select * from Tasks where id = ?", id);
        return {
            id: task.id,
            title: task.title,
            body: task.body,
            due_date: task.due_date
        }
    }

    static async getAllTasks(){
        let tasks = await db.all("Select * from Tasks");
        return tasks
    }

    static async countTasks(){
        let taskCount = (await db.get("Select count(*) as count from Tasks")).count;
        return taskCount;
    }

    
}


// {"title": "Insert Title", "body": "Inserted Body", "due_date": "2030-10-13"}