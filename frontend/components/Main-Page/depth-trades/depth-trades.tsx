'use client'

import { useEffect, useRef, useState } from "react"
import DepthBook from "./depth";
import Trades from "./trades";
import { getDepth, getTrades } from "@/utils/http-clients";
import { BookTickerWS, Depth, Trade, TradeWs } from "@/utils/types";
import { SignalingManager } from "@/utils/Signalling-Manager";

export default function DepthAndTrades({userId , market} : {userId : string | undefined , market : string}){
    const[asks , setAsks] = useState<[string,string][]>([]);
    const[bids , setBids] = useState<[string,string][]>([]);
    const[price,setPrice] = useState<string>('0');
    const[trades,setTrades] = useState<Trade[]>([]);
    const[info,setInfo] = useState('book');
    const[ratio,setRatio] = useState<{maxTotalAsks : number,maxTotalBids : number}>({
        maxTotalAsks : 0,
        maxTotalBids : 0
    })
    useEffect(() => {
        SignalingManager.getInstance(userId || "").registerCallback('depth',(data : Depth) => {
            setBids((oldBids) => {
                const newBids = [...oldBids];
                for(let i = 0 ;i < newBids.length ; i++){
                    for(let j = 0 ; j < data.bids.length; j++){
                        if(newBids[i][0] == data.bids[j][0]){  // if prices match -> uss price ka quantity must be updated.
                            //update the quantity.
                            newBids[i][1] = data.bids[j][1];
                            if (Number(newBids[i][1]) === 0) {
                                newBids.splice(i, 1);
                            }
                            break;
                        }
                    }
                }

                for(let j = 0; j < data.bids.length ; j++){
                    if(Number(data.bids[j][1]) != 0 && !newBids.find((b) => b[0] == data.bids[j][0])){
                        newBids.push(data.bids[j]);
                    }
                }
                newBids.sort((x,y) => Number(x[0]) > Number(y[0]) ? -1 : 1 )
                return newBids;
            })


            setAsks((oldAsks) => {
                const newAsks = [...oldAsks];
                for(let i = 0 ; i < newAsks.length ; i++){
                    for(let j = 0 ; j < data.asks.length; j++){
                        if(newAsks[i][0] == data.asks[j][0]){  // if prices match -> uss price ka quantity must be updated.
                            //update the quantity.
                            newAsks[i][1] = data.asks[j][1];
                            if (Number(newAsks[i][1]) === 0) {
                                newAsks.splice(i, 1);
                            }
                            break;
                        }
                    }
                }

                for(let j = 0; j < data.asks.length ; j++){
                    if(Number(data.asks[j][1]) != 0 && !newAsks.find((a) => a[0] == data.asks[j][0])){
                        newAsks.push(data.asks[j]);
                    }
                }
                newAsks.sort((x,y) => Number(x[0]) > Number(y[0]) ? 1 : -1 )
                return newAsks;
            })

        },"1")
        SignalingManager.getInstance(userId || "").registerCallback('trade',(data : Trade) => {
            setTrades((t) => {
                const newTrade = {
                    "id": data.id,
                    "isBuyerMaker": data.isBuyerMaker,
                    "price": data.price,
                    "quantity": data.quantity,
                    "quoteQuantity": data.quoteQuantity,
                    "timestamp": data.timestamp
                }
                const newTrades = [newTrade,...t];
                if(t.length == 200){
                    t.splice(200,1);
                }
                return newTrades;
            })
            setPrice(t => data.price)
        },"2")

        SignalingManager.getInstance(userId || "").registerCallback('bookTicker',(data : BookTickerWS) => {
            setBids((oldBids) => {
                const newBids = [...oldBids]
                // for(let i = 0 ; i < 10 ; i++){
                //     console.log(newBids[i][0])
                // }
                // console.log("............")
                let index = -1;
                let found = false;
                for(let i = 0; i < newBids.length ; i++){
                    if(newBids[i][0] == data.b){
                        index = i;
                        found = true;
                        break;
                    }else if (newBids[i][0] < data.b){
                        index = i;
                        break;
                    }
                }
                const updatedBids = newBids.slice(index);
                //if price == bestPrice from bookticker....update the quantity.
                if(found){
                    updatedBids[index][1] = data.B
                }else{
                    updatedBids.push([data.b,data.B]);
                }
                updatedBids.sort((x,y) => Number(x[0]) > Number(y[0]) ? -1 : 1 )
                return updatedBids;
            })
            setAsks((oldAsks) => {
                const newAsks = [...oldAsks]
                // for(let i = 0 ; i < 10 ; i++){
                //     console.log(newAsks[i][0])
                // }
                // console.log("............")
                //if price == bestPrice from bookticker....update the quantity.
                let index = -1;
                let found = false;
                for(let i = 0; i < newAsks.length ; i++){
                    if(newAsks[i][0] == data.a){
                        index = i;
                        found = true;
                        break;
                    }else if (newAsks[i][0] > data.a){
                        index = i;
                        break;
                    }
                }
                const updatedAsks = newAsks.slice(index);
                if(found){
                    updatedAsks[index][1] = data.A
                }else{
                    updatedAsks.push([data.a,data.A]);
                }
                // console.log(newAsks[0])
                updatedAsks.sort((x,y) => Number(x[0]) > Number(y[0]) ? 1 : -1 )
                return updatedAsks;
            })
        },'3')
        SignalingManager.getInstance(userId || "").sendMessage({"method":"SUBSCRIBE","params":[`depth.${market}`]});
        SignalingManager.getInstance(userId || "").sendMessage({"method":"SUBSCRIBE","params":[`trade.${market}`]});
        SignalingManager.getInstance(userId || "").sendMessage({"method":"SUBSCRIBE","params":[`bookTicker.${market}`]});

        getDepth(market).then((d) => {
            setAsks(d.asks);
            setBids(d.bids);
        })
        getTrades(market).then((t) => {
            setTrades(t);
            setPrice(t[0]?.price)
        })
        return () => {
            SignalingManager.getInstance(userId || "").sendMessage({"method":"UNSUBSCRIBE","params":[`depth.${market}`]});
            SignalingManager.getInstance(userId || "").sendMessage({"method":"UNSUBSCRIBE","params":[`trade.${market}`]});
            SignalingManager.getInstance(userId || "").sendMessage({"method":"UNSUBSCRIBE","params":[`bookTicker.${market}`]});
            SignalingManager.getInstance(userId || "").deRegisterCallback("depth", '1');
            SignalingManager.getInstance(userId || "").deRegisterCallback("trade", '2');
            SignalingManager.getInstance(userId || "").deRegisterCallback("bookTicker", '3');
        }
    },[])
    

    return (
        <div className="w-1/4 h-full bg-base-background-light rounded-lg flex flex-col">
            <div className="px-4 py-4 flex flex-row gap-2">
                <div className={`cursor-pointer font-semibold text-base-dim-text px-3 py-1 rounded-lg ${info == 'book'?"bg-base-background-light2 text-base-text-white":""}`} onClick={() => {setInfo('book')}}>Book</div>
                <div className={`cursor-pointer font-semibold text-base-dim-text px-3 py-1 rounded-lg ${info == 'trades'?"bg-base-background-light2 text-base-text-white":""}`} onClick={() => {setInfo('trades')}}>Trades</div>
            </div>
            {info == 'book' && 
                <>
                    <DepthBook asks = {asks} bids = {bids} price = {price} setRatio={setRatio}></DepthBook>
                    <Ratio totalAsks={ratio.maxTotalAsks} totalBids={ratio.maxTotalBids}></Ratio>
                </>
            }
            {info == 'trades' &&
                <Trades trades = {trades}></Trades>
            }
        </div>
    )
}

function Ratio({totalAsks,totalBids} : {totalAsks : number, totalBids : number}){
    const total = totalAsks + totalBids;
    return(
        <div className="w-full relative flex justify-between my-1 px-2 py-2">
            <div
                style={{
                position: "absolute",
                top: 0,
                left : 0,
                width: `${((100 * Number(totalBids)) / total)-0.5}%`,
                height: "100%",
                background: "rgba(0, 194, 120, 0.16)",
                transition: "width 0.4s ease-in-out"
                }}
            ></div>
            <div
                style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: `${((100 * Number(totalAsks)) / total)-0.5}%`,
                height: "100%",
                background: "rgba(253, 75, 78, 0.16)",
                transition: "width 0.4s ease-in-out",
            
                }}
            ></div>
            <div className="text-start text-sm text-accent-green">{((totalBids/total)*100).toFixed(2)}</div>
            <div  className="text-end text-sm text-accent-red">{((totalAsks/total)*100).toFixed(2)}</div>
        </div>
    )
}