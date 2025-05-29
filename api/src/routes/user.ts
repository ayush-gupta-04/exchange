import {Router} from 'express'
import { RedisManager } from '../RedisManager';
export const userRouter = Router();

userRouter.post('/',async (req,res) => {
    const {user_id} = req.body;
    const response = await RedisManager.getInstance().sendAndAwait({
        type : 'ADD_USER',
        data : {
            user_id : user_id
        }
    })
    res.json(response.payload);
})