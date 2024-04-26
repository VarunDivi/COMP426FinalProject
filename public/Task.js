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





}