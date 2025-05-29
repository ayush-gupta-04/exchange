import { Pool } from 'pg';

export function createPool(){
    const pool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "newdb",
        password: "secret",
        port: 5432,
        max: 100,
        idleTimeoutMillis : 10000 // Set max connections
    })
    return pool
}