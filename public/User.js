import { Task } from './Task.js';

export class Users {
    #id;
    #firstName;
    #lastName;
    #email;
    #password;
    #zip;

    constructor(objJson) {
        this.#id = objJson.id;
        this.#firstName = objJson.first_name;
        this.#lastName = objJson.last_name;
        this.#email = objJson.email;
        this.#password = objJson.password;
        this.#zip = objJson.zip;
    }

    get id(){return this.id;}
    get firstName(){return this.firstName;}
    get lastName(){return this.lastName;}
    get email(){return this.email;}
    get password(){return this.password;}
    get zip(){return this.zip;}

    set id(id){this.id = id;}
    set firstName(firstName){this.firstName = firstName;}
    set lastName(lastName){this.lastName = lastName;}
    set email(email){this.email = email;}
    set password(password){this.password = password;}
    set zip(zip){this.zip = zip;}


    
    static async seeWeather(zip){
        try {
            let response = await fetch(`http://localhost:3000/weather/${zip}`);
            let objJson = await response.json();
            return objJson;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    static async createUser(data) {
        try{
            let json_string = JSON.stringify({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
                zip: data.zip
            });
    
            let response = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: json_string
            });
    
            let objJson = response.json();
            console.log(objJson)
            return objJson;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    static async getUser(id) {
        try{
            if(isNaN(id) || typeof id !== 'number' || id <= 0){
                throw new Error("Specified ID should be Positive numeric");
            }

            let response = await fetch(`http://localhost:3000/users/${id}`);
            let objJson = await response.json();
            return new User(objJson);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    static async getAllUsers() {
        let response = await fetch("http://localhost:3000/users");
        let objJson = await response.json();
        return objJson
    }

    static async userLogin(email, password) {
        let json_string = JSON.stringify({
            email: email,
            password: password
        });

        let response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: json_string
        });

        let objJson = await response.json();
        return objJson;
    }


    static async updateUser(data) {
        if(isNaN(id) || typeof id !== 'number' || id <= 0){
            throw new Error("Specified ID should be Positive numeric");
        }

        let json_string = JSON.stringify({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: data.password,
            zip: data.zip
        });

        let response = await fetch(`http://localhost:3000/users`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: json_string
        });

        let objJson = await response.json();
        return objJson;
    }

    static async assignUserTask(user_id, task_id) {
        let json_string = JSON.stringify({
            user_id: user_id,
            task_id: task_id
        });

        let response = await fetch("http://localhost:3000/users/assign", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: json_string
        });

        let objJson = await response.json();
        return objJson;
        
    }


    static async getAllUserTasks(id) {
        try{
            if(isNaN(id) || typeof id !== 'number' || id <= 0){
                throw new Error("Specified ID should be Positive numeric");
            }

            let response = await fetch(`http://localhost:3000/users/${id}/tasks`);
            let objJson = await response.json();
            return objJson
        } catch (e) {
            console.error(e);
            throw e;
        }
    }



}