import { TickerType } from "./Markets";

export default function Ticker({data} : {data : TickerType}){   
    return(
        <div className="hover:bg-base-hover h-16 w-full grid grid-cols-5">
            <div className="self-end text-base-text-white">{data.name}</div>
            <div className="self-end text-base-text-white">{data.price}</div>
            <div className="self-end text-base-text-white">{data["24h Volume"]}</div>
            <div className="self-end text-base-text-white">{data["24h Change"]}</div>
            <div className="self-end text-base-text-white">zcx</div>
        </div>
    )
}