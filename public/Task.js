export class Task {
    #id;
    #title;
    #body;
    #deadline;


    constructor(objJson){
        this.#id = objJson.id;
        this.#title = objJson.title;
        this.#body = objJson.body;
        this.#deadline = objJson.deadline;
    }

    get id(){return this.#id;}
    get title(){return this.#title;}
    get body(){return this.#body;}
    get deadline(){return this.#deadline;}

    set id(id){this.#id = id;}
    set title(title){this.#title = title;}
    set body(body){this.#body = body;}
    set deadline(deadline){this.#deadline = deadline;}


    // Takes in 3 parameters, converts to json and posts
    static async createTask(data){


        let response = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: data.category,
                title: data.title,
                body: data.body,
                deadline: data.deadline,
                created_at: data.created_at,
                completed: data.completed,
                urgency: data.urgency,
            })
        });

        let objJson = await response.json();
        return objJson;
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

            let date = async function(){
                let d = new Date();
                let date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                return date.toString();
            }

            data.created_at = await date();

            console.log(data)
            console.log(task_id)
                let response = await fetch(`http://localhost:3000/tasks/${task_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: task_id,
                        category: data.category,
                        title: data.title,
                        body: data.body,
                        deadline: data.deadline,
                        created_at: data.created_at,
                        completed: data.completed,
                        urgency: data.urgency
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