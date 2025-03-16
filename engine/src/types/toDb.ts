export type MessageToDb = {
    type : "NEW_TRADE_ADDED",
    data : {
        tradeId : string,
        price : string,
        quantity : string,
        quoteQuantity : string,
        timestamp : Date,
        isBuyerMaker : Boolean
    }
}