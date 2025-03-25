import {Router} from "express"
import { RedisManager } from "../RedisManager";

export const orderRouter = Router();

orderRouter.post('/',async (req,res) => {
    const { market, price, quantity, side, userId } = req.body;
    const response = await RedisManager.getInstance().sendAndAwait({
        type : "CREATE_ORDER",
        data : {
            market,
            price,
            quantity,
            side,
            userId
        }
    });
    res.json(response.payload);
})

orderRouter.get('/',async (req,res) => {
    const {market , userId} = req.body;
    const response = await RedisManager.getInstance().sendAndAwait({
        type : "GET_OPEN_ORDERS",
        data : {
            market : market,
            userId : userId
        }
    })
    res.json(response.payload)
})


orderRouter.delete('/',async (req,res) => {
    const {market , orderId} = req.body;
    const response = await RedisManager.getInstance().sendAndAwait({
        type : "CANCEL_ORDER",
        data : {
            market : market,
            orderId : orderId
        }
    })
    res.json(response.payload)
})
