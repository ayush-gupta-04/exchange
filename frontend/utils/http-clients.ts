import axios from "axios";
import { Depth, Ticker, Trade,KLineType } from "./types";

export async function getDepth(market: string): Promise<Depth> {
    try {
        const data = await axios.get(`http://localhost:3001/api/v1/depth?market=${market}`);
        const newAsks : [string,string][] = data.data.asks.map((a : [string,string]) => {
            return [Number(a[0]).toFixed(2),Number(a[1]).toFixed(2)];
        });
        const newBids = data.data.bids.reverse().map((b : [string,string]) => {
            return [Number(b[0]).toFixed(2),Number(b[1]).toFixed(2)];
        });
        console.log("depth")
        console.log({
            asks : newAsks,
            bids : newBids
        })
        return {asks : newAsks,bids : newBids};
    } catch (error) {
        console.log(error)
        return {
            asks : [],
            bids : [],
        }
    }
}

export async function getTrades(market : string) : Promise<Trade[]> {
    try {
        const data = await axios.get(`http://localhost:3001/api/v1/trades?symbol=${market}&limit=100`);
        const trades : Trade[] = data.data;
        console.log("trades")
        console.log(trades)
        return trades
    } catch (error) {
        return []
    }
}

export async function getKlinesData(market : string,interval : string) : Promise<KLineType[]>{
    try {
        const data = await axios.get(`http://localhost:3001/api/v1/klines?symbol=${market}&interval=${interval}`);
        return data.data
    } catch (error) {
        return []
    }
}   

export async function getTicker(market : string) : Promise<Ticker> {
    try {
        const data = await axios.get('http://localhost:3001/api/v1/ticker');
        const tickers : Ticker[] = data.data;
        console.log("tickers")
        console.log(tickers)
        return tickers.find((t : Ticker) => {return t["symbol"] == market}) || {
            "firstPrice" : "0",
            "high" : "0",
            "lastPrice" : "0",
            "low" : "0",
            "priceChange" : "0",
            "priceChangePercent" : "0",
            "quoteVolume" : "0",
            "symbol" : "0",
            "trades" : "0",
            "volume" : "0"
        }
    } catch (error) {
        return {
            "firstPrice" : "0",
            "high" : "0",
            "lastPrice" : "0",
            "low" : "0",
            "priceChange" : "0",
            "priceChangePercent" : "0",
            "quoteVolume" : "0",
            "symbol" : "0",
            "trades" : "0",
            "volume" : "0"
        }
    }

}


