import {Client} from 'pg';


export function getClient(){
    const client = new Client({
        user : "postgres",
        password : "secret",
        host : "localhost",
        port : 5432,
        database : "newdb"
    })
    client.connect().then(() => {
        console.log("Connected to mydb !")
    }).catch((error) => {
        console.log(error);
        console.log("Error in connecting mydb !")
    });
    return client;
} 