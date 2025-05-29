import { Trade } from "@/utils/types";

export default function Trades({trades} : {trades : Trade[]}){
    const relevantTrades = trades.slice(0,200);
    return(
        <div className="flex flex-col overflow-auto" style={{scrollbarWidth : 'none'}}>
            <TradesTableHeader/>
            <div className="flex flex-col">
                { relevantTrades.map((t,i) => {
                    const inc = i < relevantTrades.length - 1 &&  Number(t.price) >= Number(relevantTrades[i+1].price) ? true:false;
                    return <div key={i} className="grid grid-cols-3 px-2">
                        <div className={` font-semibold text-start ${inc ? "text-accent-green" : "text-accent-red"}`}>{t.price}</div>
                        <div className="text-base-text-white font-semibold text-end">{t.quantity}</div>
                        <div className="text-base-dim-text text-end">{(new Date(t.timestamp)).toLocaleTimeString()}</div>   
                    </div>
                })}
            </div>
        </div>
    )
}

function TradesTableHeader(){
    return(
        <div className="grid grid-cols-3 px-2 py-2">
            <div className="text-base-dim-text font-semibold text-start text-sm">Price</div>
            <div className="text-base-dim-text font-semibold text-end text-sm">Quantity</div>
            <div className="text-base-dim-text font-semibold text-end text-sm">Time</div>
        </div>
    )
}