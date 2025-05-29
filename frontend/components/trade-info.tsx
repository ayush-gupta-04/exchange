'use client'

import { useState } from "react"
import Balances from "./Main-Page/Trade-Info/balances";
import FillHistory from "./Main-Page/Trade-Info/fill-history";
import OpenOrder from "./Main-Page/Trade-Info/open-order";
import OrderHistory from "./Main-Page/Trade-Info/order-history";

export default function TradeInfo({userId , market} : {userId : string | undefined , market : string}){
    const[info,setInfo] = useState<'fill_history' | 'open_order' | 'order_history' | 'balances'>('fill_history');

    return (
        <div className=" min-h-[356px] bg-base-background-light rounded-lg p-4 flex flex-col gap-4">
            <div className="flex flex-row gap-2">
                <div className={`cursor-pointer text-base-text-white px-3 py-1 rounded-lg ${info == 'balances'?"bg-base-background-light2":""}`} onClick={(e) => {e.stopPropagation();setInfo('balances')}}>Balances</div>
                <div className={`cursor-pointer text-base-text-white px-3 py-1 rounded-lg ${info == 'open_order'?"bg-base-background-light2":""}`} onClick={(e) => {e.stopPropagation();setInfo('open_order')}}>Open Orders</div>
                <div className={`cursor-pointer text-base-text-white px-3 py-1 rounded-lg ${info == 'fill_history'?"bg-base-background-light2":""}`} onClick={(e) => {e.stopPropagation();setInfo('fill_history')}}>Fill History</div>
                <div className={`cursor-pointer text-base-text-white px-3 py-1 rounded-lg ${info == 'order_history'?"bg-base-background-light2":""}`} onClick={(e) => {e.stopPropagation();setInfo('order_history')}}>Order History</div>
            </div>
            <div className="bg-base-background-light2/[50%] flex-1 rounded-lg h-full flex flex-col">
                {info == 'balances' &&
                    <Balances></Balances>
                }
                {info == 'fill_history' && 
                    <FillHistory userId = {userId} market = {market}></FillHistory>
                }
                {info == 'open_order' && 
                    <OpenOrder userId = {userId} market = {market}></OpenOrder>
                }
                {info == 'order_history' && 
                    <OrderHistory userId = {userId} market = {market}></OrderHistory>
                }
            </div>
        </div>
    )
}