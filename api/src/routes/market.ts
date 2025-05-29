import {Router} from "express"
import { RedisManager } from "../RedisManager";
import { createPool } from "../utils";

export const marketRouter = Router();


marketRouter.post('/add',async  (req,res) => {
    const {baseAsset,quoteAsset,name} = req.body;
       
        const query = `
            INSERT INTO crypto_assets (symbol,name,created_at)
            VALUES ($1,$2,$3)
            ON CONFLICT (symbol) DO NOTHING;
        `
        const values = [baseAsset + '_' + quoteAsset,name,new Date()]
            try {
                const response = await RedisManager.getInstance().sendAndAwait({
                    type : "ADD_MARKET",
                    data : {
                        baseAsset,
                        quoteAsset
                    }
                });
                const pgClient = createPool();
                await pgClient.query(query,values);
                res.json(response.payload);
            } catch (error) {
                res.json({
                    success : false,
                    message : "Error in creating market !"
                })
            }
})