import {Router} from "express"
import { RedisManager } from "../RedisManager";
import { pgClient } from "..";

export const marketRouter = Router();


marketRouter.post('/add',async  (req,res) => {
    const {baseAsset,quoteAsset,name} = req.body;
    const query = `
        INSERT INTO crypto_assets (symbol,name,created_at)
        VALUES ($1,$2,$3)
    `
    const values = [baseAsset + '_' + quoteAsset,name,new Date()]
        try {
            await pgClient.query('BEGIN');
            await pgClient.query(query,values);
            await pgClient.query('COMMIT');
            const response = await RedisManager.getInstance().sendAndAwait({
                type : "ADD_MARKET",
                data : {
                    baseAsset,
                    quoteAsset
                }
            });
            res.json(response.payload)
        } catch (error) {
            await pgClient.query('ROLLBACK')
            res.json({
                success : false,
                message : "Rolled back to initial state !"
            })
        }
})