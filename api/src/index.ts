import express from "express"
import cors from "cors"
import { depthRouter } from "./routes/depth";
import { orderRouter } from "./routes/order";
import { klinesRouter } from "./routes/klines";
import { tradesRouter } from "./routes/trades";
import { tickerRouter } from "./routes/ticker";
import { accountRouter } from "./routes/account";
import { marketRouter } from "./routes/market";
import { dbRouter } from "./routes/db";
import { userRouter } from "./routes/user";
import { historyRouter } from "./routes/history";
import { botRouter } from "./routes/bot";

const app = express();
app.use(cors())
app.use(express.json());

app.use('/api/v1/depth', depthRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/klines', klinesRouter)
app.use('/api/v1/trades', tradesRouter)
app.use('/api/v1/ticker', tickerRouter)
app.use('/api/v1/account', accountRouter)
app.use('/api/v1/market',marketRouter);
app.use('/api/v1/db',dbRouter);
app.use('/api/v1/user',userRouter)
app.use('/api/v1/history',historyRouter)
app.use('/api/v1/bot',botRouter)

app.get('/',(req,res) => {
    const a = req.query.a;
    if(a && parseInt(a.toString())== 1){
        res.status(400).json({error : "errro!"})
        return;
    }
    res.json({success : "hello"});
})

app.listen(3001, () => {
    console.log("Server running on port 3001")
})
