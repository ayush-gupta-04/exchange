'use client'
import { redirect } from "next/navigation";
import { TickerType } from "./Markets";

export default function Ticker({data} : {data : TickerType}){   
    return(
        <div className="cursor-pointer hover:bg-base-hover h-16 w-full grid grid-cols-5 px-2 border-b-1 border-base-background-light2" onClick={() => {redirect(`/trade/${data.symbol}`)}}>
            <div className="self-center text-base-text-white flex flex-col">
                <div className="text-lg ">{data.name}</div>
                <div className="text-xs text-gray-400 font-semibold">{data.symbol}</div>
            </div>
            <div className="self-center text-base-text-white justify-self-end font-semibold">{data.price}</div>
            <div className="self-center text-base-text-white justify-self-end font-semibold">{data["24h Volume"]}</div>
            <div className="self-center text-base-text-white justify-self-end font-semibold">{data["24h Change"]} %</div>
            <div className="self-center text-base-text-white justify-self-end">zcx</div>
        </div>
    )
}