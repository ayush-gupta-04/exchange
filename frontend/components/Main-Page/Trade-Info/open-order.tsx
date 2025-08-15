'use client'
import BigErrorIcon from "@/icons/bigerror";
import DeleteIcon from "@/icons/delete";
import DoneIcon from "@/icons/done";
import { OpenOrderType } from "@/utils/types";
import axios from "axios"
import { open } from "node:inspector/promises";
import { use, useEffect, useState } from "react"

export default function OpenOrder({userId,market,type} : {userId : string | undefined,market : string,type : 'user' | 'guest'}){
    const[openOrders,setOpenOrders] = useState<OpenOrderType[]>([]);
    const[loading,setLoading] = useState(false);
    const[delLoader,setDelLoader] = useState(false);
    const[state,setState] = useState<'confirm'|null>(null);
    const[deleteOrder,setDeleteOrder] = useState<{orderId : string,market: string}>({
        orderId : '',
        market : ''
    });
    const[response,setResponse] = useState<{
        success : true,
        data : {
            orderId: string,
            executedQty: number,
            remainingQty: number
        }
    }|{
        success : false,
        data : {
            message: string,
            executedQty: number,
            remainingQty: number
        }
    }|null>(null)
    useEffect(() => {
        if(type == 'user'){
            setLoading(true);
            axios.get(`http://localhost:3001/api/v1/order?market=${market}&userId=${userId}`).then((res) => {
                setOpenOrders([...res.data.asks,...res.data.bids]);
                setLoading(false)
            }).catch((e) => {
                console.log(e);
                setLoading(false);
            })
        }
        
    },[])
    function onClickHandler(orderId : string,market :string){
        if(state == null){
            setState('confirm')
            setDeleteOrder({orderId,market})
        }
    }
    async function onDeleteHandler(orderId : string,market :string){
        setDelLoader(true);
        try {
            const res = await axios.delete('http://localhost:3001/api/v1/order',{
                data : {
                    market : market,
                    orderId : orderId
                }
            })
            setResponse(res.data);
        } catch (error) {
            console.log(error)
        }
        setTimeout(() => {
            setResponse(null);
        }, 5000);
        setDelLoader(false);
        setDeleteOrder({orderId : '',market : ''})
        setState(null)
    }
    console.log(openOrders)
    return (
        <div className="flex-1 flex flex-col">
            {(state == 'confirm' || response ) && 
                <div className="h-screen w-screen inset-0 z-20 backdrop-brightness-50 fixed" onClick={(e) => {e.stopPropagation()}}></div>
            }
            {state == 'confirm' && 
                <div className="rounded-lg top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 fixed z-30 bg-base-background-light2 shadow-lg shadow-black flex flex-col gap-2 w-1/5 p-4">
                    <div className="text-center text-white text-xl p-4">Confirm Cancel Order</div>
                    <div className="flex flex-row gap-2 w-full ">
                        <div className="w-full bg-gray-700 py-2 text-center rounded-lg text-white font-semibold cursor-pointer" onClick={() => {setState(null)}} >back</div>
                        <div aria-disabled = {delLoader} className="w-full bg-accent-red py-2 text-center rounded-lg hover:bg-accent-red/[70%] text-white font-semibold" onClick={() => {onDeleteHandler(deleteOrder.orderId,deleteOrder.market)}}>{delLoader?"Cancelling...":"Cancel"}</div>
                    </div>
                </div>
            }
            {response && 
                <div className="rounded-lg top-1/2 left-1/2 transition-all -translate-x-1/2 -translate-y-1/2 fixed z-20 bg-base-background-light2 shadow-lg shadow-black flex flex-col gap-2 w-1/5 p-4">
                    <div className="text-accent-green  flex justify-center items-center mb-4">{response.success?<DoneIcon/>:<BigErrorIcon/>}</div>
                    <div className="flex flex-row gap-4">
                        <div className="text-base-dim-text text-xl">Executed Quantity : </div>
                        <div className="text-xl font-semibold text-base-text-white">{response.success ? (response.data.executedQty/response.data.remainingQty)*100 : 0} %</div>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="text-base-dim-text  text-xl">Remaining Quantity : </div>
                        <div className="text-xl font-semibold text-base-text-white">{response.data.remainingQty}</div>
                    </div>
                    {!response.success && 
                        <div className="text-xl font-semibold text-accent-red">{response.data.message}</div>
                    }
                </div>
            }
            {!openOrders || openOrders.length == 0 && 
                <div className="flex-1 flex flex-col justify-center items-center gap-4">
                    <div className="text-2xl text-base-text-white">No Open Orders</div>
                    <div className="text-xl text-base-dim-text">Place order to show up here</div>
                </div>
            }
            {openOrders.length > 0 && 
                <div className="grid grid-cols-7 px-2 py-2 border-b-1 border-gray-700/[30%]">
                    <div className="text-base-dim-text text-start">Market</div>
                    <div className="text-base-dim-text text-start">Side</div>
                    <div className="text-base-dim-text text-end">Price</div>
                    <div className="text-base-dim-text text-end">Quantity</div>
                    <div className="text-base-dim-text text-end">Filled</div>
                    <div className="text-base-dim-text text-end">Created</div>
                    <div className="text-base-dim-text text-center">Delete</div>
                </div>
            }
            {openOrders && openOrders.map((order,id) => {
                const date = new Date(order.time);
                return (
                    <div key={id} className="hover:bg-base-background-light2/[90%] grid grid-cols-7 border-b-1 border-gray-700/[30%] px-2 items-center py-2">
                        <div className="text-base-text-white font-semibold text-start text-sm py-2">{market}</div>
                        <div className="text-base-text-white font-semibold text-start text-sm py-2">{order.side}</div>
                        <div className="text-base-text-white font-semibold text-end text-sm py-2">{order.price}</div>
                        <div className="text-base-text-white font-semibold text-end text-sm py-2">{order.quantity}</div>
                        <div className="text-base-text-white font-semibold text-end text-sm py-2">{(order.filled/order.quantity)*100}%</div>
                        <div className="text-base-text-white font-semibold text-end text-sm flex flex-col gap-1 py-2">
                            <div>{date.toLocaleDateString()}</div>
                            <div>{date.toLocaleTimeString()}</div>
                        </div>
                        <div className="ml-6 mr-4 h-full bg-gray-600 flex justify-center items-center rounded-lg hover:bg-accent-red/[60%] cursor-pointer" 
                            onClick={() => {onClickHandler(order.orderId,market)}}
                        ><DeleteIcon></DeleteIcon></div>
                    </div>
                )
            })}
        </div>
    )
}

const openOrdersDummy : OpenOrderType[] = [
    {
        orderId : 'dsbsas-skasdddd-ddsdsdsdsds-d',
        userId : '55',
        price : 23,
        quantity : 3,
        side : "buy",
        filled: 2,
        time : new Date(),
        status :  'partially_filled'
    },
    {
        orderId : 'dsbsas-skasdddd-ddsdsdsdsds-d',
        userId : '55',
        price : 23,
        quantity : 3,
        side : "buy",
        filled: 2,
        time : new Date(),
        status :  'partially_filled'
    },
    {
        orderId : 'dsbsas-skasdddd-ddsdsdsdsds-d',
        userId : '55',
        price : 23,
        quantity : 3,
        side : "buy",
        filled: 2,
        time : new Date(),
        status :  'partially_filled' 
    }
]