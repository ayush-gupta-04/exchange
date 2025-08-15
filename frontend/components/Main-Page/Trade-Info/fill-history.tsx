'use client'
import { fillsHistoryType } from "@/utils/types";
import axios from "axios";
import { useEffect, useState } from "react";


export default function FillHistory({userId,market , type } : {userId : string | undefined,market : string, type : 'user' | 'guest'}){
    const[fillsHistory,setFillsHistory] = useState<fillsHistoryType[]>([]);
    const[loading,setLoading] = useState(false);
    useEffect(() => {
        if(type == 'user'){
            setLoading(true);
            axios.get(`http://localhost:3001/api/v1/history/fills?symbol=${market}&userId=${userId}&limit=100`).then((res) => {
                console.log(res.data)
                setFillsHistory([...res.data]);
                setLoading(false)
            }).catch((e) => {
                console.log(e);
                setLoading(false);
            })
        }
        console.log("gutest is there")
        
    },[])
    console.log(fillsHistory);
    return (
        <div className="flex-1 flex flex-col">
            {!fillsHistory || fillsHistory.length == 0 && 
                <div className="flex-1 flex flex-col justify-center items-center gap-4">
                    <div className="text-2xl text-base-text-white">No Orders</div>
                    <div className="text-xl text-base-dim-text">Place order to show up here</div>
                </div>
            }
            {fillsHistory.length > 0 && 
                <div className="grid grid-cols-7 px-2 py-2 border-b-1 border-gray-700/[30%]">
                    <div className="text-base-dim-text text-start ">Market</div>
                    <div className="text-base-dim-text text-start">Side</div>
                    <div className="text-base-dim-text text-start">Maker/Taker</div>
                    <div className="text-base-dim-text text-end">Price</div>
                    <div className="text-base-dim-text text-end">Quantity</div>
                    <div className="text-base-dim-text text-end">Total Value</div>
                    <div className="text-base-dim-text text-end">Created</div>
                </div>
            }
            {fillsHistory && fillsHistory.map((order,id) => {
                const date = new Date(order.time);
                return (
                    <div key={id} className="hover:bg-base-background-light2/[90%] grid grid-cols-7 border-b-1 border-gray-700/[30%] px-2 items-center py-4">
                        <div className="font-semibold text-base-text-white text-start text-sm ">{market}</div>
                        <div className="font-semibold text-base-text-white text-start text-sm">{userId == order.buyer_id.toString() ? "Buy" : "Sell"}</div>
                        <div className="font-semibold text-base-text-white text-start text-sm">{order.is_buyer_maker ? "Maker" : "Taker"}</div>
                        <div className="font-semibold text-base-text-white text-end text-sm">{order.price}</div>
                        <div className="font-semibold text-base-text-white text-end text-sm">{order.qty}</div>
                        <div className="font-semibold text-base-text-white text-end text-sm">{(order.price*order.qty).toFixed(2)}</div>
                        <div className="font-semibold text-base-text-white text-end text-sm flex flex-col gap-1">
                            <div>{date.toLocaleDateString()}</div>
                            <div>{date.toLocaleTimeString()}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}