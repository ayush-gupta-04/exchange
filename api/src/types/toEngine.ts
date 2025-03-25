export type MessageToEngine = {
    type: "CREATE_ORDER",
    data: {
        market: string,
        price: number,
        quantity: number,
        side: "buy" | "sell",
        userId: string
    }
} | {
    type : "GET_DEPTH",
    data : {
        market : string
    }
} | {
    type : "GET_OPEN_ORDERS",
    data : {
        market : string,
        userId : string
    }
} | {
    type : "CANCEL_ORDER",
    data : {
        market : string,
        orderId : string
    }
} | {
    type : "GET_BALANCE",
    data : {
        userId : string
    }
} | {
    type : "ADD_MARKET",
    data : {
        baseAsset : string,
        quoteAsset : string
    }
} | {
    type : "ADD_USER",
    data : {
        user_id : string
    }
}