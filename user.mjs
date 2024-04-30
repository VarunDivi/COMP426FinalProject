import {db} from './db.mjs';

export class Users {
    id;
    first_name;
    last_name;
    email;
    password;
    zip;

    constructor(id, first_name, last_name, email, password, zip) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.zip = zip;
    }

    static async createUser(data) {
        try {
            if(data.password.length < 8){
                throw new Error("Password must be at least 8 characters long");
            }
            // Check if user exists
            let user_check = await db.get("Select * from Users where email = ?", data.email);
            if(user_check){
                throw new Error("User already exists");
            }

            let user = await db.run("Insert into Users (first_name, last_name, email, password, zip) values (?,?,?,?,?)", data.first_name, data.last_name, data.email, data.password, data.zip);

            return {
                id: user.lastID,
                // id: user.lastID,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
                zip: data.zip
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    static async creatingUserinDB(data){
        try {
            let user = (await db.run("Insert into Users (first_name, last_name, email, password, zip) values (?,?,?,?,?)", data.first_name, data.last_name, data.email, data.password, data.zip));
            return {
                id: user.lastID,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
                zip: data.zip
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    static async getUser(id) {
        let user = await db.get("Select * from Users where id = ?", id);
        return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            zip: user.zip
        }
    }

    static async getAllUsers() {
        let users = await db.all("Select * from Users");
        return users;
    }

    static async countUsers() {
        let userCount = (await db.get("Select count(*) as count from Users")).count;
        return userCount;
    }

    static async findUserIDByEmail(email){
        let user = await db.get("Select Users.id from Users where email = ?", email);
        if(!user){
            return null;
        }
        return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password
        }
    }

    static async userLogin(email, password){
        try {

            // found email but invalid password
            let user = await db.get("Select * from Users where email = ?", email);
            let user_complete = await db.get("Select * from Users where email = ? and password = ?", email, password);
            if(user && !user_complete){
                console.log(user_complete)
                throw new Error("Invalid Password");
            }
            // email not found
            if(!user && !user_complete){
                console.log(user)
                throw new Error("Email not found");
            }
            // email and password match
            return {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: user.password
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    static async updateUser(user_id, data){
        // Check if user exists
        let user_check = await db.get("Select * from Users where id = ?", user_id);
        if(!user_check){
            throw new Error("User does not exist");
        }

        let user = await db.run("Update Users set first_name = ?, last_name = ?, email = ?, password = ?, zip = ? where id = ?", data.first_name, data.last_name, data.email, data.password, data.zip, user_id);
        return {
            id: user_id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: data.password,
            zip: data.zip
        }
    }

    static async getUserTasks(id){
        // Check if user exists
        let user = await db.get("Select * from Users where id = ?", id);
        if(!user){
            return null;
        }
        let taskList = []
        let userTasks = await db.all("Select * from UserTasks where user_id = ?", id);
        for(const task of userTasks){
            let task_data = (await db.get("Select Tasks.id, Tasks.title, Tasks.body, Tasks.deadline from Tasks where id = ?", task.task_id));
            taskList.push(task_data);
        }
        return taskList;
    }

    static async getUserTaskbyTaskId(user_id, task_id){
        let userTask = await db.get("Select * from UserTasks where user_id = ? and task_id = ?", user_id, task_id);
        return userTask;
    }

    static async assignUserTask(user_id, task_id){
        try{
            // Check if user exists
            console.log(user_id, task_id)
            let user = await db.get("Select * from Users where id = ?", user_id);
            if(!user){
                throw new Error("User does not exist");
            }

            //check if task exists
            let task = await db.get("Select * from Tasks where id = ?", task_id);
            if(!task){
                throw new Error("Task does not exist");
            }

            //check if user task exists
            let userTask = await db.get("Select * from UserTasks where user_id = ? and task_id = ?", user_id, task_id);
            if(userTask){
                throw new Error("User Task already exists");
            } else {
                let userTask = await db.run("Insert into UserTasks (user_id, task_id) values (?,?)", user_id, task_id);
                return {user_id: user_id, task_id: task_id};
                }
        } catch (e) {
            console.error(e);
            return null;
        }
 
    }

    static async countUserTask(){
        let userTaskCount = (await db.get("Select count(*) as count from UserTasks")).count;
        return userTaskCount;
    }
}


// Test Users class create user as json object
// {"first_name": "Random", "last_name": "User", "email": "randuser@gmail.com", "password": "password", "zip": 12345}