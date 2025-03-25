import {Router} from 'express'
import { pgClient } from '..';
import { RedisFlushModes } from 'redis';
import { RedisManager } from '../RedisManager';
export const userRouter = Router();

userRouter.post('/add',async (req,res) => {
    const {firstName,lastName,email,password} = req.body;
    const query =`
        INSERT INTO crypto_users (user_id,first_name,last_name,email,password)
        VALUES (
            DEFAULT,
            $1,
            $2,
            $3,
            $4
        )
        RETURNING user_id;
    `
    const values = [firstName,lastName,email,password];
    try {
        await pgClient.query("BEGIN")
        const data = await pgClient.query(query,values);
        await pgClient.query("COMMIT")
        if(data.rows[0]){
            const response = await RedisManager.getInstance().sendAndAwait({
                type : "ADD_USER",
                data : {
                    user_id : data.rows[0]
                }
            })
            res.json(response.payload)
        }
        
    } catch (error) {
        console.log(error);
        await pgClient.query("ROLLBACK")
        res.json({
            success : false,
            message : 'Error while creating user !'
        })
    }
})