import {Router} from "express"

export const klinesRouter = Router();

klinesRouter.get('/get',(req,res) => {
    res.json({
        message : "from klines"
    })
})