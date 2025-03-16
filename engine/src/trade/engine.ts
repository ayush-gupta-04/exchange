import { RedisManager } from "../RedisManager";
import { MessageFromApi } from "../types/fromApi";
import { Fill, Order, OrderBook } from "./orderbook";
import {v4 as uuid} from "uuid"

//this is how it was being set.
// balances.set("1",{
//     ["sol"]:{available : 1,locked : 2},
//     ["usdc"]:{available : 1,locked : 2}
// })

export interface UserBalance {
    [key: string]: {
        available: number;
        locked: number;
    }
}

export class Engine {
    private orderbooks : OrderBook[] = [];
    private balances: Map<string, UserBalance> = new Map();


    constructor(){
        this.orderbooks = [new OrderBook('SOL','USDC',[],[],0,0)]
        this.setBaseBalance();
    }

    setBaseBalance(){
        this.balances.set("1",{
            ["SOL"] : {
                available : 200,
                locked : 0
            },
            ["USDC"] : {
                available : 1000,
                locked : 0
            }
        })
        this.balances.set("2",{
            ["SOL"] : {
                available : 200,
                locked : 0
            },
            ["USDC"] : {
                available : 1000,
                locked : 0
            }
        })
        this.balances.set("3",{
            ["SOL"] : {
                available : 200,
                locked : 0
            },
            ["USDC"] : {
                available : 1000,
                locked : 0
            }
        })
    }
    process({ message, clientId } : {message: MessageFromApi, clientId: string}){
        switch (message.type) {
            case "CREATE_ORDER":
                try {
                    //Go to orderbook....create order...return (executedQty, fills, orderId)
                    const { executedQty, fills, orderId } = this.createOrder(message.data.market,message.data.price, message.data.quantity, message.data.side, message.data.userId);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "ORDER_PLACED",
                        payload: {
                            orderId,
                            executedQty,
                            fills
                        }
                    });
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "ORDER_CANCELLED",
                        payload: {
                            orderId: "",
                            executedQty: 0,
                            remainingQty: message.data.quantity
                        }
                    });
                }
                break;

            case "GET_OPEN_ORDERS" : 
                try {
                    const orderbook = this.orderbooks.find((orderbook) => orderbook.ticker() == message.data.market);
                    if(!orderbook){
                        throw new Error("No orderbook found!")
                    }
                    const getOpenOrders = orderbook.getOpenOrders(message.data.userId);
                    RedisManager.getInstance().sendToApi(clientId , {
                        type : "OPEN_ORDERS",
                        payload : {
                            asks : getOpenOrders.asks,
                            bids : getOpenOrders.bids
                        }
                    })
                } catch (error) {
                    console.log(error)
                    RedisManager.getInstance().sendToApi(clientId , {
                        type : "OPEN_ORDERS",
                        payload : {
                            asks : [],
                            bids : []
                        }
                    })
                }
                break;
            case "GET_DEPTH" : 
                try {
                    const orderbook = this.orderbooks.find((orderbook) => orderbook.ticker() == message.data.market);
                    if(!orderbook){
                        throw new Error("No orderbook found!")
                    }
                    const depth = orderbook.getDepths()
                    RedisManager.getInstance().sendToApi(clientId , {
                        type : "DEPTH",
                        payload : {
                            asks : depth.asks,
                            bids : depth.bids
                        }
                    })
                } catch (error) {
                    console.log(error)
                    RedisManager.getInstance().sendToApi(clientId , {
                        type : "DEPTH",
                        payload : {
                            asks : [],
                            bids : []
                        }
                    })
                }
                break;
            case "CANCEL_ORDER" :  
                try {
                    const {cancelled_order} = this.cancelOrder(message.data.market,message.data.orderId);
                    RedisManager.getInstance().sendToApi(clientId , {
                        type : "ORDER_CANCELLED",
                        payload : {
                            orderId : cancelled_order.orderId,
                            executedQty : cancelled_order.filled,
                            remainingQty : cancelled_order.quantity - cancelled_order.filled
                        }
                    })
                } catch (e) {
                    console.log(e)
                    RedisManager.getInstance().sendToApi(clientId , {
                        type : "ORDER_CANCELLED",
                        payload : {
                            orderId : message.data.orderId,
                            executedQty : 0,
                            remainingQty : 0
                        }
                    })
                }
                break;

            case "GET_BALANCE" : 
                try {
                    const {user_balance} = this.getUserBalance(message.data.userId);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type : "BALANCE",
                        payload : {
                            balances : user_balance
                        }
                    })
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type : "BALANCE",
                        payload : {
                            balances : {}
                        }
                    })
                }

                break;
            default:
                break;
        }
    }

    
    getUserBalance(userId : string) : {user_balance : UserBalance}{
        const user_balance = this.balances.get(userId);
        if(!user_balance){
            throw new Error("No balances found")
        }
        return {user_balance}
    }

    createOrder(market: string, price: number, quantity: number, side: "buy" | "sell", userId: string){
        const orderbook = this.orderbooks.find((orderbook) => {
            if(orderbook.ticker() == market){
                return orderbook
            }else{
                return null
            }
        })
        if (!orderbook) {
            throw new Error("No orderbook found");
        }
        const baseAsset = orderbook.baseAsset;
        const quoteAsset = orderbook.quoteAsset;

        //Lock the funds before any trade happens.
        //If it throws an error then it will be catched above.....do don't worry buddy.
        this.LockFunds(baseAsset,quoteAsset,quantity,price,side,userId)

        //now create an initial order .. then go on to add that order in orderbook
        const order: Order = {
            price,
            quantity,
            orderId : uuid(),
            filled: 0,
            side,
            userId
        }

        const {fills , executedQty } = orderbook.addOrder(order);
        this.updateBalance(userId,baseAsset,quoteAsset,side,fills);
        this.publishWsDepthUpdates(fills,price,side,market,orderbook);
        this.publishWsTrades(fills,userId,market)
        orderbook.cleanUp()
        // this.createDbTrades(fills,market,userId)
        return { executedQty, fills,  orderId : order.orderId}

    }

    // createDbTrades(fills : Fill[] ,market : string, userId : string ){
    //     fills.forEach(fill => {
    //         RedisManager.getInstance().sendToDbQueue("db_processor" , {
                
    //         })
    //     })
    // }

    publishWsTrades(fills: Fill[], userId: string, market: string) {
        fills.forEach(fill => {
            RedisManager.getInstance().publishToWs(`trade@${market}`, {
                stream: `trade@${market}`,
                data: {
                    e: "trade",
                    t: fill.tradeId,
                    m: fill.otherUserId === userId,
                    p: fill.price,
                    q: fill.qty,
                    s: market,
                    T : new Date()
                }
            });
        });
    }



    publishWsDepthUpdates(fills : Fill[] , price : number , side : "buy" | "sell",market : string,orderbook : OrderBook){
        const depth = orderbook.getDepths();
        if(side == "buy"){
            const price_fills = fills.map(f => f.price)
            //depth m se vo saari prices and unki quantities ko filter kro jo prices fills m h .. kyunki unhi prices m changes aaya hoga.
            const updatedAsks = depth.asks.filter(a => price_fills.includes(Number(a[0])))
            const updatedBids = depth.bids.find(b => Number(b[0]) === price);
            RedisManager.getInstance().publishToWs(`depth@${market}` , {
                stream : `depth@${market}`,
                data : {
                    a : updatedAsks,
                    b : updatedBids? [updatedBids] : [],
                    e : "depth"
                }
            })
        }else {
            const price_fills = fills.map(f => f.price)
            //depth m se vo saari prices and unki quantities ko filter kro jo prices fills m h .. kyunki unhi prices m changes aaya hoga.
            const updatedBids = depth.bids.filter(a => price_fills.includes(Number(a[0])))
            const updatedAsks = depth.asks.find(b => Number(b[0]) === price);
            RedisManager.getInstance().publishToWs(`depth@${market}` , {
                stream : `depth@${market}`,
                data : {
                    a : updatedAsks ? [updatedAsks] : [],
                    b : updatedBids,
                    e : "depth"
                }
            })
        }
    }





    //for buying --> reduce the available balance and increase the locked balance.
    //for selling --> reduce the available asset and increase the locked asset. 
    LockFunds(baseAsset : string, quoteAsset : string, quantity : number,price : number,side : "buy"|"sell",userId : string){
        if(side == 'buy'){
            const user_balance = this.balances.get(userId);
            if(user_balance && user_balance[quoteAsset]){
                const available_QuoteAsset = user_balance[quoteAsset].available;
                const locked_QuoteAsset = user_balance[quoteAsset].locked;
                if(available_QuoteAsset < price * quantity){
                    throw new Error("Insufficient balance!")
                }else{
                    user_balance[quoteAsset].available = available_QuoteAsset - (price * quantity);
                    user_balance[quoteAsset].locked = locked_QuoteAsset + (price * quantity);
                }
            }else{
                throw new Error("No balance found !")
            }
        }else{
            const user_balance = this.balances.get(userId);
            if(user_balance && user_balance[baseAsset]){
                const available_BaseAsset = user_balance[baseAsset].available;
                const locked_BaseAsset = user_balance[baseAsset].locked;
                if(available_BaseAsset < quantity){
                    throw new Error("Insufficient Funds!")
                }else{
                    user_balance[baseAsset].available = available_BaseAsset - (quantity);
                    user_balance[baseAsset].locked = locked_BaseAsset + (quantity);
                }
            }else{
                throw new Error("No balance found !")
            }
        }
    }

    updateBalance(userId : string, baseAsset : string , quoteAsset : string, side : "buy" | "sell" , fills : Fill[]){
        if(side == "buy"){
            fills.forEach((fill) => {
                const my_balance = this.balances.get(userId);
                const other_balance = this.balances.get(fill.otherUserId);
                if(my_balance && my_balance[quoteAsset] && my_balance[baseAsset] && other_balance && other_balance[quoteAsset] && other_balance[baseAsset]){
                    //My-balance
                    //QuoteAsset (USDC) --> Locked USDC will be reducted.
                    //baseAsset (SOL) --> Availale will be increased.
                    my_balance[quoteAsset].locked = my_balance[quoteAsset].locked - (fill.qty * fill.price)
                    my_balance[baseAsset].available = my_balance[baseAsset].available + (fill.qty)

                    //other-balance
                    //QuoteAsset (USDC) --> Available USDC will be increased.
                    //baseAsset (SOL) --> locked SOL will be reducted.
                    other_balance[quoteAsset].available = other_balance[quoteAsset].available + (fill.qty * fill.price)
                    other_balance[baseAsset].locked = other_balance[baseAsset].locked - (fill.qty)
                }else{
                    throw new Error("No balances found!")
                }
            })
        }else{
            fills.forEach((fill) => {
                const my_balance = this.balances.get(userId);
                const other_balance = this.balances.get(fill.otherUserId);
                if(my_balance && my_balance[quoteAsset] && my_balance[baseAsset] && other_balance && other_balance[quoteAsset] && other_balance[baseAsset]){
                    //My-balance
                    //QuoteAsset (USDC) --> Available USDC will be increased.
                    //baseAsset (SOL) --> Locked SOL will be reducted.
                    my_balance[quoteAsset].available = my_balance[quoteAsset].available + (fill.qty * fill.price)
                    my_balance[baseAsset].locked = my_balance[baseAsset].locked - (fill.qty)

                    //other-balance
                    //QuoteAsset (USDC) --> Locked USDC will be reducted.
                    //baseAsset (SOL) --> Available SOL will be increased.
                    other_balance[quoteAsset].locked = other_balance[quoteAsset].locked - (fill.qty * fill.price)
                    other_balance[baseAsset].available = other_balance[baseAsset].available + (fill.qty)
                }else{
                    throw new Error("No balances found!")
                }
            })
        }
    }




    cancelOrder(market : string, orderId : string) : {cancelled_order : Order}{
        const orderbook = this.orderbooks.find((orderbook) => orderbook.ticker() == market);
        if(!orderbook){
            throw new Error("No orderbook found!");
        }
        const quoteAsset = orderbook.quoteAsset;
        const baseAsset = orderbook.baseAsset;
        //finding the order of orderId.
        const open_order = orderbook.bids.find(o => o.orderId == orderId) || orderbook.asks.find(o => o.orderId == orderId)
        if(!open_order){
            throw new Error("No order found")
        }
        this.updateBalance_cancelled(open_order , quoteAsset, baseAsset);
        if(open_order.side == 'buy'){
            orderbook.cancelBid(orderId);
        }else{
            orderbook.cancelAsk(orderId);
        }
        return {cancelled_order : open_order}
    }

    updateBalance_cancelled(open_order : Order , quoteAsset : string,baseAsset : string){
        if(open_order.side == "buy"){
            //Quote-Asset --> increase the available balance.....reduce the locked balance.
            const UserBalance = this.balances.get(open_order.userId)
            if(UserBalance && UserBalance[quoteAsset]){
                UserBalance[quoteAsset].available += ((open_order.quantity - open_order.filled)*open_order.price);
                UserBalance[quoteAsset].locked -= ((open_order.quantity - open_order.filled)*open_order.price);
            }else{
                throw new Error("No balances found!")
            }
        }else{
            //base-Asset --> increase the available asset.....reduce the locked asset.
            const UserBalance = this.balances.get(open_order.userId)
            if(UserBalance && UserBalance[quoteAsset]){
                UserBalance[baseAsset].available += (open_order.quantity - open_order.filled);
                UserBalance[baseAsset].locked -= (open_order.quantity - open_order.filled);
            }else{
                throw new Error("No balances found!")
            }
        }
    }
}