import { ORDER_STATUS } from "."

export type MessageToDb = {
    type : "CREATE_DB_TRADE",
    data : {
        tradeId : number,
        time : Date,
        market : string,
        price : number,
        quantity : number,
        quoteQuantity : number,
        is_buyer_maker : boolean,
        buyer_id : string,
        seller_id : string
    }
} | {
    type : "CREATE_DB_ORDER",
    data : {
        order_id : string,
        symbol : string,
        user_id : string,
        time : Date,
        price : number,
        qty : number,
        filled : number,
        status : ORDER_STATUS,
        side : "buy" | "sell"
    }
} | {
    type : "UPDATE_DB_ORDER",
    data : {
        order_id : string,
        qty : number,
        status : ORDER_STATUS
    }
} | {

}