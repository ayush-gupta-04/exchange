import { BookTickerWS, Depth, DepthWS, Trade, TradeWs } from "./types";

const WEBSOCKET_URL = 'ws://localhost:8080'
export class SignalingManager{
    private ws : WebSocket;
    private static instance : SignalingManager;
    private bufferedMessages : any[];
    private callbacks : {[key : string] : [
        {callback : (data : any) => void,id : string}
    ]} = {};
    private initialised : boolean = false;


    private constructor(id : string){
        this.ws = new WebSocket(WEBSOCKET_URL+'?id=' + id);
        this.bufferedMessages = [];
        this.initialiseEmmision();
    }

    public static getInstance(id : string){
        if(!SignalingManager.instance){
            SignalingManager.instance = new SignalingManager(id)
        }
        return SignalingManager.instance;
    }

    private initialiseEmmision(){
        this.ws.onopen = () => {
            this.initialised = true;
            this.bufferedMessages.forEach(message => {
                this.ws.send(JSON.stringify(message));
            });
            this.bufferedMessages = [];
        }

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const type = message.data.e;
            if(this.callbacks[type]){
                this.callbacks[type].forEach(({callback}) => {
                    if(type == 'trade'){
                        console.log(message.data)
                        const newTrade : Trade = {
                            "id": message.data.t,
                            "isBuyerMaker": message.data.m,
                            "price": Number(message.data.p).toFixed(2),
                            "quantity": Number(message.data.q).toFixed(2),
                            "quoteQuantity": (Number(message.data.p) * Number(message.data.q)).toString(),
                            "timestamp": message.data.T
                        }
                        callback(newTrade);
                    }else if(type == 'bookTicker'){
                        const newBookTicker : BookTickerWS = {
                            e : message.data.e,
                            s : message.data.s,
                            a : message.data.a,   //best ask price
                            A : message.data.A,   //best ask qty
                            b : message.data.b,
                            B : message.data.B
                        }
                        callback(newBookTicker);
                    }else if(type == 'depth'){
                        const newDepth : Depth = {
                            asks : message.data.a.map((a : [string,string]) => {return [Number(a[0]).toFixed(2),Number(a[1]).toFixed(2)]}),
                            bids : message.data.b.map((b : [string,string]) => {return [Number(b[0]).toFixed(2),Number(b[1]).toFixed(2)]}),
                        }
                        console.log(newDepth);
                        callback(newDepth);
                    }
                })
            }
        }
    }



    public sendMessage(message: any) {
        const messageToSend = {
            ...message
        }
        if (!this.initialised) {
            this.bufferedMessages.push(messageToSend);
            return;
        }
        this.ws.send(JSON.stringify(messageToSend));
    }

    async registerCallback(type: string, callback: (data : any) => void, id: string) {
        this.callbacks[type] = this.callbacks[type] || [];
        this.callbacks[type].push({ callback, id });
    }

    async deRegisterCallback(type: string, id: string) {
        if (this.callbacks[type]) {
            const index = this.callbacks[type].findIndex(callback => callback.id === id);
            if (index !== -1) {
                this.callbacks[type].splice(index, 1);
            }
        }
    }
}