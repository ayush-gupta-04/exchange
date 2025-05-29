// import getUser from "@/app/action/getUser";
import { getUser } from "@/app/action/getUser";
import DepthAndTrades from "@/components/Main-Page/depth-trades/depth-trades";
import MarketBar from "@/components/market-bar";
import SwapUI from "@/components/swap-ui";
import TradeInfo from "@/components/trade-info";
import TradingView from "@/components/tradingview";

export default async function TradeMarket({params} : {params : Promise<{market : string}>}){
    const {market} = await params;
    const session = await getUser();

    return (
        <div className="flex-1 w-full bg-base-background-dark px-4 flex flex-row gap-2 pb-4">
            <div className="flex-1 flex-col gap-2 flex">
                <div className="flex flex-col gap-2">
                    <div className="flex-1">
                        <MarketBar market = {market} userId = {session?.id}></MarketBar>
                    </div>
                    <div className="flex flex-row h-[620px]  w-full gap-2 rounded-lg">
                        <TradingView userId = {session?.id} market = {market}></TradingView>
                        <DepthAndTrades userId = {session?.id} market = {market}></DepthAndTrades>
                    </div>
                </div>
                <div className="min-h-[356px] rounded-lg">
                    <TradeInfo userId = {session?.id} market = {market}></TradeInfo>
                </div>
            </div>
            <div className="w-[332px] bg-base-background-light h-fit">
                <SwapUI market ={market}></SwapUI>
            </div>
        </div>
    )
}