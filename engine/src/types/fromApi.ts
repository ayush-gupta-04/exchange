
export type MessageFromApi = {
    type: "CREATE_ORDER",
    data: {
        market: string,
        price: number,
        quantity: number,
        side: "buy" | "sell",
        userId: string
    }
} | {
    type : "GET_OPEN_ORDERS",
    data : {
        market : string,
        userId : string
    }
} | {
    type : "GET_DEPTH",
    data : {
        market : string
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
}