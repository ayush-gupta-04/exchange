import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import AsksTable from "./asks";
import BidsTable from "./bids";

export default function DepthBook({asks , bids , price ,setRatio} : {asks : [string,string][],bids : [string,string][] , price : string , setRatio : Dispatch<SetStateAction<{
    maxTotalAsks: number;
    maxTotalBids: number;
}>>}){
    const prevPriceRef = useRef<number | null>(null);
    useEffect(() => {
        prevPriceRef.current = Number(price)
    },[price])

    return (
        <div className="flex flex-col overflow-auto" style={{scrollbarWidth : 'none'}}>
            <DepthTableHeader/>
                <AsksTable asks={asks} setRatio = {setRatio}></AsksTable>
                <div className={`px-2 text-xl font-semibold text-base-text-white ${prevPriceRef.current != null && prevPriceRef.current < Number(price) ? "text-accent-green":"text-accent-red"} `}>
                    {price}
                </div>
                <BidsTable bids={bids} setRatio = {setRatio}></BidsTable>
        </div>
    )
}

function DepthTableHeader(){
    return(
        <div className="grid grid-cols-3 px-2 py-2">
            <div className="text-base-dim-text font-semibold text-start text-sm">Price</div>
            <div className="text-base-dim-text font-semibold text-end text-sm">Quantity</div>
            <div className="text-base-dim-text font-semibold text-end text-sm">Total</div>
        </div>
    )
}