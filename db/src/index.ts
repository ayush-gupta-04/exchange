import { createClient } from "redis";
import { MessageFromEngine } from "./types/fromEngine";
import { getClient } from "./utils";

//1. Always use like this pgClient.query(query,values).....it will ensure the correct datatypes + ensures no SQL injection.
async function main(){
    const pgClient = await getClient();
    const redis = createClient();
    try {
        await redis.connect();
        console.log("redis connected !")
        while(true){
            const dataFromEngine = await redis.brPop('db_processor',0);
            if(dataFromEngine){
                const {type,data : {tradeId,market,price,quantity,quoteQuantity,timeStamp,isBuyerMaker}} = JSON.parse(dataFromEngine.element) as MessageFromEngine;
                if(type == "NEW_TRADE_ADDED"){
                    try {
                        //pushing to trades.
                        const trade_query = `
                            INSERT INTO crypto_trades (trade_id, symbol,time, price, quantity, quote_quantity, is_buyer_maker)
                            VALUES($1, $2, $3, $4, $5, $6, $7);
                        `
                        const trade_values = [tradeId,market,timeStamp,price,quantity,quoteQuantity,isBuyerMaker];
                        await pgClient.query(trade_query,trade_values) 
                        
                        console.log("Data inserted successfully !")
                    } catch (error) {
                        await pgClient.query(`ROLLBACK`)
                        console.log(error)
                        console.log("Rolled back to initial state !")
                    }
                }
            }
        }
    } catch (error) {
        console.log(error)
        console.log("redis connection error !")
    }
}

main()