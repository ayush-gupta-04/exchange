import {Router} from "express"

export const tradesRouter = Router();

tradesRouter.get('/get',(req,res) => {
    res.json({
        message : "from trades"
    })
})