import { Pool } from 'pg';

export function createPool(){
    const pool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "newdb",
        password: "secret",
        port: 5432,
        max: 100, // Set max connections
    });
    pool.connect().then(() => {
        console.log("DB connected successfully !")
    }).catch(() => {
        console.log("errror in connecting the DB !")
    })
    return pool
}