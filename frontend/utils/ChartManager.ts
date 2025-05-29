import {
  ColorType,
  createChart as createLightWeightChart,
  CrosshairMode,
  ISeriesApi,
  UTCTimestamp,
} from "lightweight-charts";

export class ChartManager {
  private candleSeries: ISeriesApi<"Candlestick">;
  private lastUpdateTime: number = 0;
  private chart: any;
  private currentBar: {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
  } | null = null;

  private interval : number;

  constructor(
    ref: any,
    initialData: {close : number,high : number,low : number,open : number,timestamp : Date}[],
    layout: { background: string; color: string },
    interval : number
  ) {
    this.interval = interval;
    const chart = createLightWeightChart(ref, {
      autoSize: true,
      overlayPriceScales: {
        ticksVisible: true,
        borderVisible: true,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        
      },
      rightPriceScale: {
        visible: true,
        ticksVisible: true,
        entireTextOnly: true,
      },
      grid: {
        horzLines: {
          visible: true,
          color : "#202127"
        },
        vertLines: {
          visible: true,
          color : "#202127"
        },
      },
      timeScale : {
        timeVisible : true,
      },
      layout: {
        background: {
          type: ColorType.Solid,
          color: layout.background,
        },
        textColor: "#75798A",
      },
    });
    this.chart = chart;
    this.candleSeries = chart.addCandlestickSeries();

    this.candleSeries.setData(
      initialData.map((data) => ({
        ...data,
        time: (data.timestamp.getTime() / 1000) as UTCTimestamp,
      }))
    );
    if(initialData.length > 0){
      const lastdata : {
        close: number;
        high: number;
        low: number;
        open: number;
        timestamp: Date;
    }= initialData[initialData.length -1];
    const time = Math.floor(lastdata.timestamp.getTime() / 1000);
    const lastBar = {
        time: time as UTCTimestamp,
        open: lastdata.open,
        high: lastdata.high,
        low: lastdata.low,
        close: lastdata.close
    }
    this.currentBar = lastBar
    }
  }




  public update(price: number , timestamp : number) {
    const time = Math.floor(timestamp / 1000);
    const barTime = time - (time % this.interval);      //it is just calculating the floor minute value.
    if (!this.lastUpdateTime) {
      this.lastUpdateTime = new Date().getTime();
    }

    if(this.currentBar){
        if (this.currentBar.time !== barTime) {
        // Start a new bar
            this.currentBar = {
                time: barTime as UTCTimestamp,
                open: price,
                high: price,
                low: price,
                close: price,
            };
        this.candleSeries.update(this.currentBar);
        } else {
            // Update existing bar
            this.currentBar.high = Math.max(this.currentBar.high, price);
            this.currentBar.low = Math.min(this.currentBar.low, price);
            this.currentBar.close = price;
            this.candleSeries.update(this.currentBar);
        }
    }
  }



  public destroy() {
    this.chart.remove();
  }

}
