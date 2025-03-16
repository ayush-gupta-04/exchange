//if i place an order...and my half qty is filled by orderId = 2....and i ate whole qty of orderId = 2....the orderId = 2 will be removed from the orderBook.
//how will the person with orderId = 2 will know ki uska pura filled ho gya tha. ????


//Check if the user itself doesn't trade with himself
export interface Order {
    price: number;
    quantity: number;
    orderId: string;
    filled: number;    //The current quantity of this order is quantity - filled.
    side: "buy" | "sell";
    userId: string;
}

export interface Fill {
    price: number;
    qty: number;
    tradeId: number;
    otherUserId: string;
    markerOrderId: string;
}


export class OrderBook {
    bids : Order[];
    asks : Order[];
    baseAsset : string;
    quoteAsset : string;
    lastTradeId : number;
    currentPrice : number;

    constructor(baseAsset: string, quoteAsset : string, bids: Order[], asks: Order[], lastTradeId: number, currentPrice: number) {
        this.bids = bids;
        this.asks = asks;
        this.baseAsset = baseAsset;
        this.quoteAsset = quoteAsset;
        this.lastTradeId = lastTradeId || 0;
        this.currentPrice = currentPrice ||0;
    }

    //It returns the market of the orderbook.
    ticker() {
        return `${this.baseAsset}_${this.quoteAsset}`;
    }


    getOpenOrders(userId : string){
        const asks = this.asks.filter((order) => order.userId == userId)
        const bids = this.bids.filter((order) => order.userId == userId)
        return {
            asks : asks,
            bids : bids
        }
    }

    getDepths() : {asks : [string,string][] , bids : [string,string][]}{
        const aggregated_bids: [string , string][] = [];
        const aggregated_asks: [string , string][] = [];


        //Will be like a map to store (price) and its (quantity).
        //It's like ... iss price m TOTAL itna quantity h.
        const bids_obj : { [key : string] : number } = {};
        const asks_obj : { [key : string] : number } = {};

        this.bids.forEach((order) => {
            const price = order.price;

            //if ( price : quantity ) is not created in bids_obj --> then create it with 0 quantity.
            if(!bids_obj[price]){
                bids_obj[price] = 0;
            }
            bids_obj[price] = bids_obj[price] + (order.quantity - order.filled);
        })

        this.asks.forEach((order) => {
            const price = order.price;

            //if ( price : quantity ) is not created in asks_obj --> then create it with 0 quantity.
            if(!asks_obj[price]){
                asks_obj[price] = 0;
            }
            asks_obj[price] = asks_obj[price] + (order.quantity - order.filled);
        })

        for(const price in bids_obj){
            aggregated_bids.push([price , bids_obj[price].toString()])
        }
        for(const price in asks_obj){
            aggregated_asks.push([price , asks_obj[price].toString()])
        }

        return {bids : aggregated_bids , asks : aggregated_asks}
    }

    addOrder(order : Order) : {fills : Fill[] , executedQty : number}{
        if(order.side == "buy"){
            const {fills,executedQty} = this.match_BidsToAsks(order);
            order.filled = executedQty;
            if(executedQty == order.quantity){
                return {
                    fills,
                    executedQty
                }
            }
            this.bids.push(order);
            return {
                fills,
                executedQty
            }
        }else{
            const {executedQty, fills} = this.match_AsksToBids(order);
            order.filled = executedQty;
            if (executedQty === order.quantity) {
                return {
                    executedQty,
                    fills
                }
            }
            this.asks.push(order);
            return {
                executedQty,
                fills
            }
        }
        
    }


    //If i want to buy ... my order will be matched in the asks.
    //Order will be matched starting from the best to worst asks.
    //Least asks is the best asks.
    //so, Sort in ascending order....start from first.
    match_BidsToAsks(order : Order) : {fills : Fill[] , executedQty : number}{
        const fills : Fill[] = [];
        let executedQty : number = 0;
        this.asks.sort((o1,o2) => o1.price - o2.price);
         //TODO : Don't let the user trade with himself .... done
        for(let i = 0; i < this.asks.length ; i++){
            if(this.asks[i].price <= order.price && order.quantity > executedQty && order.userId != this.asks[i].userId){
                const remainingQty = order.quantity - executedQty;
                const filledQty = Math.min( remainingQty , this.asks[i].quantity);
                executedQty += filledQty;
                this.asks[i].filled += filledQty
                fills.push({
                    price : this.asks[i].price,
                    qty : filledQty,
                    tradeId : this.lastTradeId++,
                    otherUserId : this.asks[i].userId,
                    markerOrderId : this.asks[i].orderId
                })

                //don't do it right now. do this after i have updated the ws server
                //since this order was removed from the orderBook . . how will that person know kii uska order fill ho gya.
                // if(this.asks[i].filled == this.asks[i].quantity){
                //     this.asks.splice(i,1);
                //     i--;
                // }
            }else{
                break;
            }
        }
        return {
            fills,
            executedQty
        }

    }


    //If i want to sell ... my order will be matched in the bids.
    //Order will be matched starting from the best to worst bids.
    //highest bids is the best bids.
    //so, Sort in descending order....start from first.
    match_AsksToBids(order : Order) : {fills : Fill[] , executedQty : number}{
        const fills : Fill[] = []
        let executedQty : number = 0;
        this.bids.sort((o1,o2) => o2.price - o1.price);
         //TODO : Don't let the user trade with himself.....done
        for(let i = 0 ; i < this.bids.length ; i++){
            if(this.bids[i].price >= order.price && order.quantity > executedQty && order.userId != this.bids[i].userId){
                const remainingQty = order.quantity - executedQty;
                const filledQty = Math.min( remainingQty , this.bids[i].quantity);
                executedQty += filledQty
                this.bids[i].filled += filledQty
                fills.push({
                    price : this.bids[i].price,
                    qty : filledQty,
                    tradeId : this.lastTradeId++,
                    otherUserId : this.bids[i].userId,
                    markerOrderId : this.bids[i].orderId
                })

                //don't do it right now. do this after i have updated the ws server
                //since this order was removed from the orderBook . . how will that person know kii uska order fill ho gya.
                // if(this.bids[i].filled == this.bids[i].quantity){
                //     this.bids.splice(i,1);
                //     i--;
                // }
            }
        }
        return {
            fills,
            executedQty
        }
    }


    cancelBid(orderId : string){
        const index = this.bids.findIndex(b => b.orderId == orderId)
        if(index != -1){
            this.bids.splice(index,1);
        }
    }
    cancelAsk(orderId : string){
        const index = this.asks.findIndex(a => a.orderId == orderId)
        if(index != -1){
            this.asks.splice(index,1);
        }
    }
    cleanUp(){
        for(let i = 0; i < this.asks.length ; i++){
            if(this.asks[i].quantity == this.asks[i].filled){
                this.asks.splice(i,1);
                i--;
            }
        }
        for(let i = 0; i < this.bids.length ; i++){
            if(this.bids[i].quantity == this.bids[i].filled){
                this.bids.splice(i,1);
                i--;
            }
        }
    }
}