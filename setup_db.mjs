import {db} from './db.mjs';

await db.run(`
            CREATE TABLE Users (
                id INTEGER PRIMARY KEY,
                first_name varchar(30),
                last_name varchar(30),
                email varchar(30),
                password varchar(30),
                zip INTEGER
            )`
        );

await db.run(`
            CREATE TABLE Tasks (
                id INTEGER PRIMARY KEY,
                category TEXT default 'personal',
                title varchar(30),
                body varchar(255),
                deadline TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                completed BOOLEAN DEFAULT FALSE,
                urgency INTEGER DEFAULT 0
            )`
        );

await db.run(`
            CREATE TABLE UserTasks (
                id INTEGER PRIMARY KEY,
                user_id INTEGER,
                task_id INTEGER
            )`
        );

