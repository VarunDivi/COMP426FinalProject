import {db} from './db.mjs';

await db.run(`
            CREATE TABLE Users (
                id INTEGER PRIMARY KEY,
                FirstName varchar(30),
                LastName varchar(30)
            )`
        );