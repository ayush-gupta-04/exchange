"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const utils_1 = require("./utils");
//1. Always use like this pgClient.query(query,values).....it will ensure the correct datatypes + ensures no SQL injection.
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const redis = (0, redis_1.createClient)();
        try {
            const pgClient = (0, utils_1.createPool)();
            yield redis.connect();
            console.log("redis connected !");
            while (true) {
                const dataFromEngine = yield redis.brPop('db_processor', 0);
                if (dataFromEngine) {
                    const { type, data } = JSON.parse(dataFromEngine.element);
                    if (type == 'CREATE_DB_TRADE') {
                        const { trade_id, time, market, price, quantity, is_buyer_maker, buyer_id, seller_id, } = data;
                        console.log(data);
                        try {
                            //pushing to trades.
                            const trade_query = `
                                INSERT INTO crypto_trades (trade_id, symbol,time, price, qty, is_buyer_maker,seller_id,buyer_id,quote_qty)
                                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);
                            `;
                            const trade_values = [trade_id, market, time, price, quantity, is_buyer_maker, seller_id, buyer_id, parseFloat((price * quantity).toFixed(2))];
                            yield pgClient.query(trade_query, trade_values);
                            console.log(" Trade Data inserted successfully !");
                        }
                        catch (error) {
                            console.log(error);
                            console.log("Rolled back to initial state !");
                        }
                    }
                    else if (type == "CREATE_DB_ORDER") {
                        const { order_id, symbol, user_id, time, price, qty, filled, status, side } = data;
                        console.log(data);
                        try {
                            //pushing to order table.
                            const query = `
                                INSERT INTO crypto_orders (order_id,symbol,user_id,price,qty,filled,status,time,side)
                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                            `;
                            const values = [order_id, symbol, user_id, price, qty, filled, status, time, side];
                            yield pgClient.query(query, values);
                            console.log(" Order Data inserted successfully !  for user : " + user_id);
                        }
                        catch (error) {
                            console.log(error);
                            console.log("Error : Inserting error !");
                        }
                    }
                    else if (type == "UPDATE_DB_ORDER") {
                        const { order_id, qty, status } = data;
                        const query = `
                            UPDATE crypto_orders
                            SET status = $1,
                            filled = filled + $2
                            WHERE order_id = $3
                        `;
                        const values = [status, qty, order_id];
                        try {
                            yield pgClient.query(query, values);
                            console.log("Order updated successfully !");
                        }
                        catch (error) {
                            console.log(error);
                            console.log("Error : Inserting error !");
                        }
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
            console.log("redis connection error !");
        }
    });
}
main();
