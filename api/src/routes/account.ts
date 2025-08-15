import {Router} from "express"
import { RedisManager } from "../RedisManager";

export const accountRouter = Router();

accountRouter.get('/',async (req ,res) => {
    const {user_id} = req.body;
    if(!user_id){
        res.json({
            message : 'No userId provided!'
        })
        return;
    }
    const response = await RedisManager.getInstance().sendAndAwait({
        type : "GET_BALANCE",
        data : {
            userId : user_id
        }
    })
    res.json(response.payload)
})



//this will be to add balance.
accountRouter.post('/',async (req,res) => {
    const {user_id,baseAsset,quoteAsset} = req.body;
    const response = await RedisManager.getInstance().sendAndAwait({
        type : "GET_BALANCE",
        data : {
            userId : user_id
        }
    })
    res.json(response.payload)
})
