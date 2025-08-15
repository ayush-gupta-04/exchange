'use client'

import { getTicker } from "@/utils/http-clients";
import { SignalingManager } from "@/utils/Signalling-Manager";
import { Ticker, Trade } from "@/utils/types";
import { useEffect, useState } from "react"

export default function MarketBar({market,userId} : {market : string,userId : string | undefined}){
    const[lastPrice,setLastPrice] = useState(0);
    const[tickerData,setTickerData] = useState<Ticker>();

    useEffect(() => {
        SignalingManager.getInstance(userId || "").registerCallback('trade',(data : Trade) => {
            setLastPrice(Number(data.price));
        },'4')

        SignalingManager.getInstance(userId || "").sendMessage({"method":"SUBSCRIBE","params":[`trade.${market}`]});
        getTicker(market).then((t) => {
            setTickerData(t);
            setLastPrice(Number(t.lastPrice));
        })
        return () => {
            SignalingManager.getInstance(userId || "").deRegisterCallback('trade','4');
            SignalingManager.getInstance(userId || "").sendMessage({"method":"UNSUBSCRIBE","params":[`trade.${market}`]});
        }
    },[])
    return (
        <div className="h-[72px] w-full bg-base-background-light rounded-lg px-8 py-2 flex felx-row gap-12 ">
            <div className=" flex justify-center items-center text-2xl font-semibold text-white">
                {lastPrice}
            </div>
            <div className="flex flex-col justify-center">
                <div className="text-base-dim-text text-sm">24H Change</div>
                <div className={`text-start ${Number(tickerData?.priceChange) < 0 ? "text-accent-red": "text-accent-green"}`}>{Number(tickerData?.priceChange).toFixed(2)}</div>
            </div>
            <div className="flex flex-col justify-center">
                <div className="text-base-dim-text text-sm">24H Change %</div>
                <div className={`text-start ${Number(tickerData?.priceChangePercent) < 0 ? "text-accent-red": "text-accent-green"}`}>{(Number(tickerData?.priceChangePercent)*100).toFixed(2)}</div>
            </div>
            <div className="flex flex-col justify-center">
                <div className="text-base-dim-text text-sm">24H High</div>
                <div className="text-base-text-white">{Number(tickerData?.high).toFixed(2)}</div>
            </div>
            <div className="flex flex-col justify-center">
                <div className="text-base-dim-text text-sm">24H Low</div>
                <div className="text-base-text-white">{Number(tickerData?.low).toFixed(2)}</div>
            </div>
            <div className="flex flex-col justify-center">
                <div className="text-base-dim-text text-sm">24H Volume(SOL)</div>
                <div className="text-base-text-white">{Number(tickerData?.volume).toFixed(2)}</div>
            </div>
            <div className="flex flex-col justify-center">
                <div className="text-base-dim-text text-sm">24H Volume(USDC)</div>
                <div className="text-base-text-white">{Number(tickerData?.quoteVolume).toFixed(2)}</div>
            </div>
        </div>
    )
}