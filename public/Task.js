export class Task {
    #id;
    #title;
    #body;
    #due_date;


    constructor(objJson){
        this.#id = objJson.id;
        this.#title = objJson.title;
        this.#body = objJson.body;
        this.#due_date = objJson.due_date;
    }

    get id(){return this.#id;}
    get title(){return this.#title;}
    get body(){return this.#body;}
    get due_date(){return this.#due_date;}

    set id(id){this.#id = id;}
    set title(title){this.#title = title;}
    set body(body){this.#body = body;}
    set due_date(due_date){this.#due_date = due_date;}


    // Takes in 3 parameters, converts to json and posts
    static async createTask(title, body, due_date){
        let json_string = JSON.stringify({
            title: title,
            body: body,
            due_date: due_date
        });

        let response = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: json_string
        });

        let objJson = await response.json();
        return new Task(objJson);
        }


    // Finds a task by ID. Returns a Task object that you can then access after its creation using getters
    static async findTask(id){
        try{
            if(isNaN(id) || typeof id !== 'number' || id <= 0){
                throw new Error("Specified ID should be Positive numeric");
            }

            let response = await fetch(`http://localhost:3000/tasks/${id}`);
            let objJson = await response.json();
            return new Task(objJson);
        } catch (e) {
            console.error(e);
            throw e;
        }

    }

    // gets all tasks as a list of objects
    static async findAllTasks() {
        try {
            let response = await fetch("http://localhost:3000/tasks");
            let objJson = await response.json();
            return objJson.map((task) => new Task(task));
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    static async updateTask(task_id, data){
        try {
            console.log(data)
            console.log(task_id)
                let response = await fetch(`http://localhost:3000/tasks/${task_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: task_id,
                        title: data.title,
                        body: data.body,
                        due_date: data.due_date
                    })
                });

                let objJson = await response.json();
                console.log('This is the objson')
                console.log(objJson);
                return objJson;
            } catch (e) {
                console.error(e);
                throw e;
        }
    }





}