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
        const pgClient = yield (0, utils_1.getClient)();
        const redis = (0, redis_1.createClient)();
        try {
            yield redis.connect();
            console.log("redis connected !");
            while (true) {
                const dataFromEngine = yield redis.brPop('db_processor', 0);
                if (dataFromEngine) {
                    const { type, data: { tradeId, market, price, quantity, quoteQuantity, timeStamp, isBuyerMaker } } = JSON.parse(dataFromEngine.element);
                    if (type == "NEW_TRADE_ADDED") {
                        try {
                            //pushing to trades.
                            const trade_query = `
                            INSERT INTO crypto_trades (trade_id, symbol,time, price, quantity, quote_quantity, is_buyer_maker)
                            VALUES($1, $2, $3, $4, $5, $6, $7);
                        `;
                            const trade_values = [tradeId, market, timeStamp, price, quantity, quoteQuantity, isBuyerMaker];
                            yield pgClient.query(trade_query, trade_values);
                            console.log("Data inserted successfully !");
                        }
                        catch (error) {
                            yield pgClient.query(`ROLLBACK`);
                            console.log(error);
                            console.log("Rolled back to initial state !");
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
