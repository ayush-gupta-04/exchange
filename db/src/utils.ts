import {Client} from 'pg';


export async function getClient(){
    const client = new Client({
        user : "postgres",
        password : "secret",
        host : "localhost",
        port : 5432,
        database : "newdb"
    })
    try {
        await client.connect();
        console.log("Connected to mydb!")
    } catch (error) {
        console.log('Connection Error ' + error)
    }
    return client;
} 