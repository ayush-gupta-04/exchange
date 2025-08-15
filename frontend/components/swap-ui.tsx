'use client'

import { FormEvent, useState } from "react"
import ClassicBuySellButton from "./small-components/classic-buy-sell-button";
import axios from "axios";
import { getUser } from "@/app/action/getUser";
import DoneIcon from "@/icons/done";
import BigErrorIcon from "@/icons/bigerror";

export default function SwapUI({market} : {market : string}){
    const[side,setSide] = useState<'buy' | 'sell'>("buy");
    const[orderType,setOrderType] = useState("limit")
    const[loading,setLoading] = useState(false);
    const[response,setResponse] = useState<{
        success : true,
        data : {
            orderId : string,
            executedQty : number,
            fills: {
                    price: number,
                    qty: number,
                    tradeId: number
            }[]
        }
    } | {
        success : false,
        data : {
            message : string
        }
    } | null>(null)
    const[input , setInput] = useState<{price : string , quantity : string}>({
        price : "0",
        quantity : "0"
    })

    async function placeOrder(event : FormEvent<HTMLFormElement>){
        event.preventDefault();
        setLoading(true);
        const session = await getUser();
        if(session?.type == 'guest'){
            setResponse({
                success : false,
                data : {
                    message : "Please Login To Make Order!"
                }
            })
            setTimeout(() => {
                setResponse(null)
            }, 4000);
            setLoading(false);
            return;
        }
        const res = await axios.post('http://localhost:3001/api/v1/order',{
            market : market, 
            price : parseFloat(input.price),
            quantity : parseFloat(input.quantity),
            side : side,
            userId : session?.id
        })
        setLoading(false);
        setResponse(res.data);
        setTimeout(() => {
            setResponse(null)
        }, 4000);
    }
    return (
        <>
        {response && response.success && 
            <div className="fixed flex flex-col gap-2 z-30 min-w-1/5 h-fit bg-base-background-light2 rounded-lg shadow-black shadow-lg top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 p-4">
                <div className="flex justify-center items-center text-accent-green mb-2"><DoneIcon></DoneIcon></div>
                <div className="text-accent-green text-2xl mb-4">Order Placed Successfully !</div>
                <div className="flex flex-row items-center gap-2">
                    <div className="text-base-dim-text text-sm">Order Id : </div>
                    <div className="text-sm text-white font-semibold">{response.data.orderId}</div>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <div className="text-base-dim-text text-sm">Executed Quantity : </div>
                    <div className="text-sm text-white font-semibold">{response.data.executedQty}</div>
                </div>
                {response.data.fills.length > 0 && 
                    <div className="text-base-dim-text text-sm flex flex-row justify-between font-semibold">
                    <div>Price</div>
                    <div>Quantity</div>
                </div>
                }
                <div className="overflow-auto max-h-32" style={{scrollbarWidth : 'none'}}>
                    {response.data.fills.map((f,id) => {
                        return (
                            <div key = {id} className="border-b-1  border-base-dim-text/[20%] flex-row flex justify-between py-1">
                                <div className="text-base-text-white">{f.price}</div>
                                <div className="text-base-text-white">{f.qty}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        }

        {response && !response.success && 
            <div className="fixed flex flex-col gap-2 z-30 min-w-1/5 h-fit bg-base-background-light2 rounded-lg shadow-black shadow-lg top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 p-4">
                <div className="flex justify-center items-center text-accent-red mb-2"><BigErrorIcon/></div>
                <div className="text-accent-red text-2xl mb-4 text-center">{response.data.message}</div>
            </div>
        }
        {response && 
            <div className="inset-0 backdrop-brightness-50 h-screen w-screen fixed z-10"></div>
        }
        <div className="rounded-lg bg-base-background-light p-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 w-full bg-base-background-light2 rounded-lg">
                <div className={`cursor-pointer hover:text-accent-green text-center py-3 rounded-lg font-semibold ${side == 'buy' ? "bg-accent-green/[20%] text-accent-green" : "text-base-dim-text"}`} onClick={() => {setSide('buy')}}>Buy</div>
                <div className={`cursor-pointer hover:text-accent-red text-center py-3 rounded-lg font-semibold ${side == 'sell' ? "bg-accent-red/[20%] text-accent-red" : "text-base-dim-text"}`} onClick={() => {setSide('sell')}}>Sell</div>
            </div>
            <div className="flex flex-row gap-2">
                <div className={`cursor-pointer text-base-text-white px-3 py-1 rounded-lg ${orderType == 'limit'?"bg-base-background-light2":""}`} onClick={() => {setOrderType('limit')}}>Limit</div>
                <div className={`cursor-pointer text-base-text-white px-3 py-1 rounded-lg ${orderType == 'market'?"bg-base-background-light2":""}`} onClick={() => {setOrderType('market')}}>Market</div>
            </div>
            <form className="flex flex-col gap-4" onSubmit={placeOrder}>
                <div className="flex flex-col gap-2">
                    <div className="text-base-dim-text">Price</div>
                    <input type="number" placeholder="0" onChange={(e) => {setInput({...input,price : Number(e.target.value).toFixed(2)})}} className=" -webkit-appearance: none text-3xl bg-base-background-dark px-3 py-2 w-full text-base-text-white  focus:outline-hidden focus:ring-accent-blue focus:ring-2  rounded-lg border-1 border-base-background-light2"/>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-base-dim-text">Quantity</div>
                    <input type="number" placeholder="0" onChange={(e) => {setInput({...input,quantity : Number(e.target.value).toFixed(2)})}} className="-webkit-appearance: none text-3xl bg-base-background-dark px-3 py-2 w-full text-base-text-white  focus:outline-hidden focus:ring-accent-blue focus:ring-2  rounded-lg border-1 border-base-background-light2"/>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-base-dim-text">Order value</div>
                    <input type="number" readOnly = {true}  value={(Number(input.price) * Number(input.quantity)).toFixed(2)} className="-webkit-appearance: none text-3xl bg-base-background-dark px-3 py-2 w-full text-base-text-white  focus:outline-hidden focus:ring-accent-blue focus:ring-2  rounded-lg border-1 border-base-background-light2"/>
                </div>
                <ClassicBuySellButton disabled = {loading} loading = {loading} side={side} text={side}></ClassicBuySellButton>
            </form>
        </div>
        </>
    )
}