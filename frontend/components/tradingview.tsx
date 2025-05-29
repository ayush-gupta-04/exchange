
'use client'
import { ChartManager } from "@/utils/ChartManager";
import { getKlinesData } from "@/utils/http-clients";
import { klines } from "@/utils/klines";
import { SignalingManager } from "@/utils/Signalling-Manager";
import { KLineType, Trade } from "@/utils/types";
import { useEffect, useRef, useState } from "react";

export default function TradingView({market,userId} : {market : string,userId : string | undefined}){
    const chartRef = useRef<HTMLDivElement>(null);
    const chartManagerRef = useRef<ChartManager>(null);
    const[lastPrice,setLastPrice] = useState<number | null>(null);

    useEffect(() => {
        const init = async () => {
            const klineData = await getKlinesData(market,'1m') as KLineType[];
            // const klineData = klines;
            if (chartRef) {
                if (chartManagerRef.current) {
                    chartManagerRef.current.destroy();
                }
                const chartManager = new ChartManager(
                chartRef.current,
                [
                    ...klineData?.map((x) => ({
                    close: parseFloat(x.close),
                    high: parseFloat(x.high),
                    low: parseFloat(x.low),
                    open: parseFloat(x.open),
                    timestamp: new Date(x.end), 
                    })),
                ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
                {
                    background: "#14151b",
                    color: "white",
                },
                60
                );
                //@ts-ignore
                chartManagerRef.current = chartManager;
            }
        };
        init();
    }, [market, chartRef]);

    useEffect(() => {
        if(chartManagerRef.current && lastPrice){
            const price = Number(lastPrice);
            const timestamp = Date.now();
            chartManagerRef.current.update(price, timestamp);
        }
    },[lastPrice])
    
    useEffect(() => {
        SignalingManager.getInstance(userId || '').registerCallback('trade',(data : Trade) => {
            setLastPrice(Number(data.price));
        },'4')

        SignalingManager.getInstance(userId || '').sendMessage({"method":"SUBSCRIBE","params":[`trade.${market}`]});
        return () => {
            SignalingManager.getInstance(userId || '').deRegisterCallback('trade','4');
            SignalingManager.getInstance(userId || '').sendMessage({"method":"UNSUBSCRIBE","params":[`trade.${market}`]});
        }
    },[])
    return (
        <div className="flex-1 bg-base-background-light rounded-lg p-4" ref={chartRef}>    
        </div>
    )
}