import {Router} from "express"
import { createPool} from "../utils";
export const historyRouter = Router();

historyRouter.get('/fills',async (req,res) => {
    const symbol = req.query.symbol;
    const limit = req.query.limit || 100;
    const user_id = req.query.userId;
    try {
        const pgClient = createPool();
        if(!symbol && user_id){
            const query = `
                SELECT * 
                FROM crypto_trades
                WHERE seller_id = $1 OR buyer_id = $1
                ORDER BY time DESC
                LIMIT $2
            `
            const values = [user_id,limit]
            try {
                const result = await pgClient.query(query,values);
                res.json(result.rows);
            } catch (error) {
                console.log(error)
                res.json({
                    success : false,
                    message : "Error while querying !"
                })
            }
        }else if (symbol && user_id){
            const query = `
                SELECT * 
                FROM crypto_trades
                WHERE seller_id = $1 OR buyer_id = $1 AND symbol = $2
                ORDER BY time DESC
                LIMIT $3
            `
            const values = [user_id,symbol,limit]
            try {
                const result = await pgClient.query(query,values);
                res.json(result.rows)
            } catch (error) {
                console.log(error)
                res.json({
                    success : false,
                    message : "Error while querying !"
                })
            }
        }
    } catch (error) {
        console.log(error);
    }

})



historyRouter.get('/orders',async (req,res) => {
    const symbol = req.query.symbol;
    const limit = req.query.limit || 100;
    const user_id = req.query.userId;
    try {
        const pgClient = createPool();
        if(!symbol && user_id){
            const query = `
                SELECT *
                FROM crypto_orders
                WHERE user_id = $1
                ORDER BY time DESC
                LIMIT $2
            `
            const values = [user_id,limit]
            try{
                const result = await pgClient.query(query,values);
                res.json(result.rows)
            }catch (err) {
                console.log(err);
                res.json({
                    success : false,
                    message : "Error while querying !"
                })
            }
        }else if (symbol && user_id){
            const query = `
                SELECT *
                FROM crypto_orders
                WHERE user_id = $1 AND symbol = $2
                ORDER BY time DESC
                LIMIT $3
            `
            const values = [user_id,symbol,limit]
            try{
                const result = await pgClient.query(query,values);
                res.json(result.rows)
            }catch (err) {
                console.log(err)
                res.json({
                    success : false,
                    message : "Error while querying !"
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
})