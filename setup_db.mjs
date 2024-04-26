import {db} from './db.mjs';

await db.run(`
            CREATE TABLE Users (
                id INTEGER PRIMARY KEY,
                FirstName varchar(30),
                LastName varchar(30)
            )`
        );


await db.run(`
            CREATE TABLE Tasks (
                id INTEGER PRIMARY KEY,
                title varchar(30),
                body varchar(255),
                due_date DATE
            )`
        );

