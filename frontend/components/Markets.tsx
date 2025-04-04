import Ticker from "./Ticker"

export type TickerType = {
    symbol : string,
    name : string,
    price : string,
    "24h Change" : string,
    "24h Volume" : string,
}
const symbols : TickerType[] = [
    {
        symbol : "SOL_USDC",
        name : "Solana",
        price : "145.3",
        "24h Change" : "0.78",
        "24h Volume" : "1396429",
    },
    {
        symbol : "ETH_USDC",
        name : "Ethereum",
        price : "145.3",
        "24h Change" : "0.78",
        "24h Volume" : "1396429",
    },
    {
        symbol : "BTC_USDC",
        name : "Bitcoin",
        price : "145.3",
        "24h Change" : "0.78",
        "24h Volume" : "1396429",
    },
    {
        symbol : "LINK_USDC",
        name : "Chainlink",
        price : "145.3",
        "24h Change" : "0.78",
        "24h Volume" : "1396429",
    },
    {
        symbol : "PEPE_USDC",
        name : "Pepe",
        price : "145.3",
        "24h Change" : "0.78",
        "24h Volume" : "1396429",
    },
    {
        symbol : "ENA_USDC",
        name : "Ethena",
        price : "145.3",
        "24h Change" : "0.78",
        "24h Volume" : "1396429",
    },
    {
        symbol : "RENDER_USDC",
        name : "Render",
        price : "145.3",
        "24h Change" : "0.78",
        "24h Volume" : "1396429",
    }

]

export default function Markets(){
    return(
        <div className="h-56 w-4/6 bg-base-background-light px-4 py-4 rounded-lg flex flex-col">
            <span className="bg-base-background-light2 px-2 py-1 rounded-lg text-white w-fit mb-4">
                Spot
            </span>
            <div className="grid grid-cols-5 text-gray-400 border-b-1 border-gray-800 pb-2">
                <div className="text-start ">Name</div>
                <div className="text-end">Price</div>
                <div className="text-end">24h Volume</div>
                <div className="text-end">24h Change</div>
                <div className="text-end">Last 7 Days</div>
            </div>
            {symbols.map((symbol,id) => {
                return <Ticker data = {symbol} key={id}></Ticker>
            })}
        </div>
    )
}