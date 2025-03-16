export type OutgoingMessage = {
    stream : string,
    data : {
        a : [string,string][],
        b : [string,string][],
        e : "depth"
    }
} | {
    stream : string,
    data: {
        e: "trade",
        t: number,
        m: boolean,
        p: number,
        q: number,
        s: string,
    }
}
