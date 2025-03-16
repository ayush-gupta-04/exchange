import {Router} from "express"

export const tickerRouter = Router();

tickerRouter.get('/get',(req,res) => {
    res.json({
        message : "from ticker"
    })
})