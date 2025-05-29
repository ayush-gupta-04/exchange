'use client'

import { Dispatch, SetStateAction, useEffect } from "react";

export default function BidsTable({bids,setRatio} : {bids : [string,string][],setRatio : Dispatch<SetStateAction<{
    maxTotalAsks: number;
    maxTotalBids: number;
}>>}){
    const relevantBids = bids.slice(0,15);
    let currtotal = 0;
    const bidsWithTotal : [string,string,string][] = relevantBids.map(([p,q]) => [p , q , (currtotal += Number(q)).toFixed(2)]);
    useEffect(() => {
        setRatio((r) => ({...r,maxTotalBids : currtotal}))
    },[currtotal])
    return (
        <div className="flex flex-col w-full gap-1">
            {bidsWithTotal.map((a,id) => 
                <Bid price = {a[0]} quantity = {a[1]} total = {a[2]} key={id} maxTotal = {currtotal}></Bid>
            )}
        </div>
    )
}

function Bid({price , quantity, total,maxTotal} : {price : string,quantity : string, total : string,maxTotal : number}){
    return (
        <div style={{
                display: "flex",
                position: "relative",
                width: "100%",
                backgroundColor: "transparent",
                overflow: "hidden",
        }}>

            <div
                style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: `${(100 * Number(total)) / maxTotal}%`,
                height: "100%",
                background: "rgba(0, 194, 120, 0.16)",
                transition: "width 0.4s ease-in-out",
                }}
            ></div>
            <div
                style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: `${(100 * Number(quantity)) / maxTotal}%`,
                height: "100%",
                background: "rgba(0, 194, 120, 0.32)",
                transition: "width 0.4s ease-in-out",
                }}
            ></div>
            <div className="grid grid-cols-3 justify-between items-center px-2 w-full text-sm">
                <div className='text-accent-green/[85%] text-start'>{price}</div>
                <div className="text-base-text-white text-end">{quantity}</div>
                <div className="text-base-text-white text-end">{total}</div>
            </div>
        </div>
    )
}

