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
    private orderbooks : OrderBook[];
    private balances: Map<string, UserBalance>;


    constructor(){
        this.orderbooks = [new OrderBook('SOL','USDC',[],[],0,0)];
        this.balances = new Map();
        this.setBaseBalances();
    }

    setBaseBalances(){
        this.balances.set('1',{
            ["SOL"] : {
                available : 400,
                locked : 0
            },
            ["USDC"] : {
                available : 50000,
                locked : 0
            }
        })
        this.balances.set('2',{
            ["SOL"] : {
                available : 400,
                locked : 0
            },
            ["USDC"] : {
                available : 50000,
                locked : 0
            }
        })
        this.balances.set('3',{
            ["SOL"] : {
                available : 400,
                locked : 0
            },
            ["USDC"] : {
                available : 50000,
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

            case "ADD_USER" : 
                this.createUser(message.data.user_id);
                RedisManager.getInstance().sendToApi(clientId,{
                    type : "USER_CREATED",
                    payload : {
                        success : true,
                        message : "User created successfully !"
                    }
                })
                break;
            case "ADD_MARKET" : 
                const {baseAsset,quoteAsset} = message.data;
                this.createOrderbook(baseAsset,quoteAsset);
                RedisManager.getInstance().sendToApi(clientId,{
                    type : "MARKET_ADDED",
                    payload : {
                        success : true,
                        message : `${baseAsset}_${quoteAsset} Market added successfully !`
                    }
                })
            default:
                break;
        }
    }

    createOrderbook(baseAsset : string,quoteAsset : string){
        this.orderbooks.push(new OrderBook(baseAsset,quoteAsset,[],[],0,0));
        console.log(this.orderbooks)
    }
    createUser(userId : string){
        this.balances.set(userId,{
            ["SOL"] : {
                available : 400,
                locked : 0
            },
            ["USDC"] : {
                available : 50000,
                locked : 0
            }
        })
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
        //If it throws an error then it will be catched above.....so don't worry buddy.
        this.LockFunds(baseAsset,quoteAsset,quantity,price,side,userId)

        //now create an initial order .. then go on to add that order in orderbook
        const order: Order = {
            orderId : uuid(),
            userId,
            price,
            quantity,
            side,
            filled: 0,
            time : new Date(),
            status : "new"
        }

        const {fills , executedQty } = orderbook.addOrder(order);
        this.updateBalance(userId,baseAsset,quoteAsset,side,fills);
        this.createDbOrders(order,market);
        this.updateDbOrders(fills);
        this.createDbTrades(fills,market,userId,side);        
        this.publishWsDepthUpdates(fills,price,side,market,orderbook);
        this.publishWsTrades(fills,userId,market);
        orderbook.cleanUp();
        this.publishWsBookTickerUpdates(side,orderbook,market);
        return { executedQty, fills,  orderId : order.orderId};
    }

    publishWsBookTickerUpdates(side : "buy" | "sell",orderbook : OrderBook,market : string){
        const {bid,ask}  = orderbook.getBestBidsAsks(side);
        RedisManager.getInstance().publishToWs(`bookTicker@${market}`,{
            stream : `bookTicker@${market}`,
            data : {
                e : "bookTicker",
                s : market,
                a : ask.price.toString(),
                A : ask.qty.toString(),
                b : bid.price.toString(),
                B : bid.qty.toString()
            }
        })
    }

    createDbOrders(order : Order,market : string){
        RedisManager.getInstance().sendToDbQueue('db_processor',{
            type : "CREATE_DB_ORDER",
            data : {
                order_id : order.orderId,
                symbol : market,
                user_id : order.userId,
                time : order.time,
                price : order.price,
                qty : order.quantity,
                filled : order.filled,
                status : order.status,
                side  : order.side
            }
        })
    }

    updateDbOrders(fills : Fill[]){
        fills.forEach(fill => {
            RedisManager.getInstance().sendToDbQueue('db_processor',{
                type : "UPDATE_DB_ORDER",
                data : {
                    order_id : fill.markerOrderId,
                    qty : fill.qty,
                    status : fill.otherOrderStatus
                }
            })
        })
    }

    createDbTrades(fills : Fill[] ,market : string, userId : string ,side : "buy" | "sell"){
        fills.forEach(fill => {
            RedisManager.getInstance().sendToDbQueue("db_processor" , {
                type : "CREATE_DB_TRADE",
                data : {
                    tradeId : fill.tradeId,
                    time : new Date(),
                    market : market,
                    price : fill.price,
                    quantity : fill.qty,
                    quoteQuantity : (fill.qty * fill.price),
                    is_buyer_maker : fill.otherUserId == userId,
                    buyer_id : side == "buy" ?userId:fill.otherUserId,
                    seller_id : side == 'sell'?userId:fill.otherUserId
                }
            })
        })
    }

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
            this.updateDbOrders_cancelled(orderId);
            this.publishWsDepthUpdates_cancelled(open_order.price,orderbook,"buy",market);
            //for bookTicker --> the bids and the asks will always be sorted in any case.
            //just pick the top one.
            this.publishBookTickerUpdated_cancelled(orderbook,market)
        }else{
            orderbook.cancelAsk(orderId);
            this.updateDbOrders_cancelled(orderId);
            this.publishWsDepthUpdates_cancelled(open_order.price,orderbook,"sell",market);
            //for bookTicker --> the bids and the asks will always be sorted in any case.
            //just pick the top one.
            this.publishBookTickerUpdated_cancelled(orderbook,market)
        }
        return {cancelled_order : open_order}
    }


    publishBookTickerUpdated_cancelled(orderbook : OrderBook , market : string){
        const bid = {
            price : orderbook.bids.length == 0 ? 0 : orderbook.bids[0].price,
            qty : orderbook.bids.length == 0 ? 0 : orderbook.bids[0].quantity - orderbook.bids[0].filled,
        }
        const ask = {
            price : orderbook.asks.length == 0 ? 0 : orderbook.asks[0].price,
            qty : orderbook.asks.length == 0 ? 0 : orderbook.asks[0].quantity - orderbook.asks[0].filled,
        }
        RedisManager.getInstance().publishToWs(`bookTicker@${market}`,{
            stream : `bookTicker@${market}`,
            data : {
                e : 'bookTicker',
                s : market,
                a : ask.price.toString(),
                A : ask.qty.toString(),
                b : bid.price.toString(),
                B : bid.qty.toString()
            }
        })
    }
    publishWsDepthUpdates_cancelled(price : number,orderbook : OrderBook,side : "buy" | "sell",market : string){
        const depth = orderbook.getDepths();
        if(side == "buy"){
            //this cancelled_order was on the bids.
            //in bids : ye order jis price m place hua hoga usi price m change aaya hoga.
            //in asks : no change.
            const updatedBids = depth.bids.find(b => Number(b[0]) == price)
            RedisManager.getInstance().publishToWs(`depth@${market}`,{
                stream : `depth@${market}`,
                data : {
                    e : "depth",
                    a : [],
                    b : updatedBids ? [updatedBids] : [[price.toString(),'0']]
                }
            })
        }else{
            //this cancelled_order was on the asks.
            //in asks : ye order jis price m place hua hoga usi price m change aaya hoga.
            //in bids : no change.
            const updatedAsks = depth.asks.find(b => Number(b[0]) == price)
            RedisManager.getInstance().publishToWs(`depth@${market}`,{
                stream : `depth@${market}`,
                data : {
                    e : "depth",
                    a : updatedAsks ? [updatedAsks] : [[price.toString(),'0']],
                    b : []
                }
            })
        }
        
    }

    updateDbOrders_cancelled(orderId : string){
        RedisManager.getInstance().sendToDbQueue('db_processor',{
            type : "UPDATE_DB_ORDER",
            data : {
                order_id : orderId,
                qty : 0,
                status : 'cancelled'
            }
        })
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