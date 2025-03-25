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
                const {type,data} = JSON.parse(dataFromEngine.element) as MessageFromEngine;
                    if(type == 'CREATE_DB_TRADE'){
                        const {
                            tradeId,
                            time,
                            market,
                            price,
                            quantity,
                            quoteQuantity,
                            is_buyer_maker,
                            buyer_id,
                            seller_id
                        } = data
                        console.log(data);
                        try {
                            //pushing to trades.
                            const trade_query = `
                                INSERT INTO crypto_trades (trade_id, symbol,time, price, qty, quote_qty, is_buyer_maker,seller_id,buyer_id)
                                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);
                            `
                            const trade_values = [tradeId,market,time,price,quantity,quoteQuantity,is_buyer_maker,seller_id,buyer_id];
                            await pgClient.query(trade_query,trade_values) 
                            console.log(" Order Data inserted successfully !")
                        } catch (error) {
                            console.log(error)
                            console.log("Rolled back to initial state !")
                        }
                    }
                    else if(type == "CREATE_DB_ORDER"){
                        const {
                            order_id,
                            symbol,
                            user_id,
                            time,
                            price,
                            qty,
                            filled,
                            status,
                            side
                        } = data
                        console.log(data)
                        try {
                            //pushing to order table.
                            const query = `
                                INSERT INTO crypto_orders (order_id,symbol,user_id,price,qty,filled,status,time,side)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                            `
                            const values = [order_id,symbol,user_id,price,qty,filled,status,time,side]
                            await pgClient.query(query,values);
                            console.log(" Order Data inserted successfully !")
                        } catch (error) {
                            console.log(error)
                            console.log("Error : Inserting error !")
                        }
                    }else if (type == "UPDATE_DB_ORDER"){
                        const {
                            order_id,
                            qty,
                            status
                        } = data

                        const query = `
                            UPDATE crypto_orders
                            SET status = $1,
                            filled = filled + $2
                            WHERE order_id = $3
                        `
                        const values = [status,qty,order_id]
                        try {
                            await pgClient.query(query,values);
                            console.log("Order updated successfully !")
                        } catch (error) {
                            console.log(error);
                            console.log("Error : Inserting error !")
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