import * as Sqlite from 'expo-sqlite';

export const getDB = async()=>{
    const db = await Sqlite.openDatabaseAsync("blog-app.db")
//enable foreign key
await db.execAsync("PRAGMA foreign_keys = ON;");

    // create auth table 

  await  db.execAsync(`
        create table if not exists users (
        id  integer primary key autoincrement,
        name text,
     email TEXT UNIQUE,
        password text,
        image text default null,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        
        `)
    // create note table 

await db.execAsync(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    user_id INTEGER,
    isComplete INTEGER default 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
  )
`);


    return db
}