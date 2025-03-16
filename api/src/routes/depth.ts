import {Router} from "express"
import { RedisManager } from "../RedisManager";

export const depthRouter = Router();

depthRouter.get('/',async (req,res) => {
    const {market} = req.body;
    const response = await RedisManager.getInstance().sendAndAwait({
        type : "GET_DEPTH",
        data : {
            market : market
        }
    })
    res.json(response.payload)
})
