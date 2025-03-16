import {Router} from "express"
import { RedisManager } from "../RedisManager";

export const accountRouter = Router();

accountRouter.get('/',async (req,res) => {
    const {userId} = req.body;
    const response = await RedisManager.getInstance().sendAndAwait({
        type : "GET_BALANCE",
        data : {
            userId : userId
        }
    })
    res.json(response.payload)
})
