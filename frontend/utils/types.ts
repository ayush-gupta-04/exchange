
export type BackendResponseWithToken = {
    success : boolean | null,
    message : string,
    token? : string
}
export type SendEmailArg = {
    email : string,
    otp : string
}
export type BackendResponse = {
    success : boolean | null,
    message : string
}
export type OpenOrderType   =  {
    orderId : string,
    userId : string,
    price : number,
    quantity : number,
    side : "buy" | "sell",
    filled: number,
    time : Date,
    status : ORDER_STATUS
}
export type OrderHisoryType = {
    order_id : string,
    symbol : string,
    user_id : string,
    price : number,
    qty : number,
    side : "buy" | "sell",
    filled: number,
    time : Date,
    status : ORDER_STATUS
}
export type fillsHistoryType = {
    trade_id : number,
    time : Date,
    market : string,
    price : number,
    qty : number,
    is_buyer_maker : boolean,
    buyer_id : string,
    seller_id : string,
}

export type ORDER_STATUS = "new" | "filled" | "cancelled" | "partially_filled";


export interface Depth {
    bids: [string, string][],
    asks: [string, string][]
}
export type Ticker = {
    "firstPrice" : string,
    "high" : string,
    "lastPrice" : string,
    "low" : string,
    "priceChange" : string,
    "priceChangePercent" : string,
    "quoteVolume" : string,
    "symbol" : string,
    "trades" : string,
    "volume" : string
}


export type TradesData = {
    trade_id: number,
    symbol: string,
    time: Date,
    price: number,
    quantity: number,
    quote_quantity: number,
    is_buyer_maker: false
}

export interface Trade {
    "id": number,
    "isBuyerMaker": boolean,
    "price": string,
    "quantity": string,
    "quoteQuantity": string,
    "timestamp": number
}

export type TradeWs = {
    e: "trade",
    t: number,
    m: boolean,
    p: number,
    q: number,
    s: string,
    T : Date
}

export type BookTickerWS = {
    e : "bookTicker",
    s : string,
    a : string,   //best ask price
    A : string,   //best ask qty
    b : string,
    B : string
}

export type DepthWS = {
    a : [string,string][],
    b : [string,string][],
    e : "depth"
}

export type KLineType = {
    "close": string,
    "end": string,
    "high": string,
    "low": string,
    "open":string,
    "quoteVolume": string,
    "start": string,
    "trades": string,
    "volume": string
}