export type MessageToDb = {
    type : "NEW_TRADE_ADDED",
    data : {
        market : string,
        tradeId : number,
        price : number,
        quantity : number,
        quoteQuantity : number,
        timeStamp : Date,
        isBuyerMaker : boolean
    }
}