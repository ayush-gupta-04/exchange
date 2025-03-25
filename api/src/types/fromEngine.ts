export type MessageFromEngine = {
    type: "ORDER_PLACED",
    payload: {
        orderId: string,
        executedQty: number,
        fills: [
            {
                price: number,
                qty: number,
                tradeId: number
            }
        ]
    }
} | {
    type : "DEPTH",
    payload : {
        asks : [string,string][],
        bids : [string,string][]
    }
} | {
    type : "OPEN_ORDERS",
    payload : {
        asks : {
            price: number;
            quantity: number;
            orderId: string;
            filled: number; 
            side: "buy" | "sell";
            userId: string;
        }[],
        bids : {
            price: number;
            quantity: number;
            orderId: string;
            filled: number; 
            side: "buy" | "sell";
            userId: string;
        }[]
    }
} | {
    type: "ORDER_CANCELLED",
    payload: {
        orderId: string,
        executedQty: number,
        remainingQty: number
    }
} | {
    type : "BALANCE",
    payload : {
        balances : {
            [key : string] : {
                available : number,
                locked : number
            }
        }
    }
} | {
    type : "MARKET_ADDED",
    payload : {
        success : boolean,
        message : string
    }
} | {
    type : "USER_CREATED",
    payload : {
        success : boolean,
        message : string
    }
}
