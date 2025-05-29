import axios from "axios";
import { Depth, Ticker, Trade,KLineType } from "./types";

export async function getDepth(market: string): Promise<Depth> {
    try {
        const data = await axios.get(`http://localhost:3001/api/v1/depth?market=${market}`);
        const newAsks : [string,string][] = data.data.asks.map((a : [string,string]) => {
            return [Number(a[0]).toFixed(2),Number(a[1]).toFixed(2)];
        });
        const newBids = data.data.bids.reverse().map((b : [string,string]) => {
            return [Number(b[0]).toFixed(2),Number(b[1]).toFixed(2)];
        });
        console.log("depth")
        console.log({
            asks : newAsks,
            bids : newBids
        })
        return {asks : newAsks,bids : newBids};
    } catch (error) {
        console.log(error)
        return {
            asks : [],
            bids : [],
        }
    }
}

export async function getTrades(market : string) : Promise<Trade[]> {
    try {
        const data = await axios.get(`http://localhost:3001/api/v1/trades?symbol=${market}&limit=100`);
        const trades : Trade[] = data.data;
        console.log("trades")
        console.log(trades)
        return trades
    } catch (error) {
        return []
    }
}

export async function getKlinesData(market : string,interval : string) : Promise<KLineType[]>{
    try {
        const data = await axios.get(`http://localhost:3001/api/v1/klines?symbol=${market}&interval=${interval}`);
        return data.data
    } catch (error) {
        return []
    }
}   

export async function getTicker(market : string) : Promise<Ticker> {
    try {
        const data = await axios.get('http://localhost:3001/api/v1/ticker');
        const tickers : Ticker[] = data.data;
        console.log("tickers")
        console.log(tickers)
        return tickers.find((t : Ticker) => {return t["symbol"] == market}) || {
            "firstPrice" : "0",
            "high" : "0",
            "lastPrice" : "0",
            "low" : "0",
            "priceChange" : "0",
            "priceChangePercent" : "0",
            "quoteVolume" : "0",
            "symbol" : "0",
            "trades" : "0",
            "volume" : "0"
        }
    } catch (error) {
        return {
            "firstPrice" : "0",
            "high" : "0",
            "lastPrice" : "0",
            "low" : "0",
            "priceChange" : "0",
            "priceChangePercent" : "0",
            "quoteVolume" : "0",
            "symbol" : "0",
            "trades" : "0",
            "volume" : "0"
        }
    }

}


// const tickers : Ticker[] = [
//     {
//         "firstPrice": "262.77",
//         "high": "262.77",
//         "lastPrice": "253.88",
//         "low": "251.86",
//         "priceChange": "-8.89",
//         "priceChangePercent": "-0.033832",
//         "quoteVolume": "2791.03536",
//         "symbol": "AAVE_USDC",
//         "trades": "109",
//         "volume": "10.796"
//     },
//     {
//         "firstPrice": "263.33",
//         "high": "263.33",
//         "lastPrice": "248.46",
//         "low": "247.43",
//         "priceChange": "-14.87",
//         "priceChangePercent": "-0.056469",
//         "quoteVolume": "3460066.7081",
//         "symbol": "AAVE_USDC_PERP",
//         "trades": "13736",
//         "volume": "13476.82"
//     },
//     {
//         "firstPrice": "0.0602",
//         "high": "0.0633",
//         "lastPrice": "0.0633",
//         "low": "0.0602",
//         "priceChange": "0.0031",
//         "priceChangePercent": "0.051495",
//         "quoteVolume": "26942.888015",
//         "symbol": "ACT_USDC",
//         "trades": "59",
//         "volume": "430302.87"
//     },
//     {
//         "firstPrice": "0.7366",
//         "high": "0.7842",
//         "lastPrice": "0.751",
//         "low": "0.7247",
//         "priceChange": "0.0144",
//         "priceChangePercent": "0.019549",
//         "quoteVolume": "825008.04",
//         "symbol": "ADA_USDC_PERP",
//         "trades": "1654",
//         "volume": "1095179"
//     },
//     {
//         "firstPrice": "0.6434",
//         "high": "0.695",
//         "lastPrice": "0.6586",
//         "low": "0.643",
//         "priceChange": "0.0152",
//         "priceChangePercent": "0.023624",
//         "quoteVolume": "700.231534",
//         "symbol": "APE_USDC",
//         "trades": "1666",
//         "volume": "1051.82"
//     },
//     {
//         "firstPrice": "0.3903",
//         "high": "0.4182",
//         "lastPrice": "0.399",
//         "low": "0.3801",
//         "priceChange": "0.0087",
//         "priceChangePercent": "0.022291",
//         "quoteVolume": "896632.78509",
//         "symbol": "ARB_USDC_PERP",
//         "trades": "7554",
//         "volume": "2245509.8"
//     },
//     {
//         "firstPrice": "22.242",
//         "high": "23.819",
//         "lastPrice": "22.693",
//         "low": "21.774",
//         "priceChange": "0.451",
//         "priceChangePercent": "0.020277",
//         "quoteVolume": "1601190.82962",
//         "symbol": "AVAX_USDC_PERP",
//         "trades": "8337",
//         "volume": "70422.06"
//     },
//     {
//         "firstPrice": "3.0914",
//         "high": "3.3078",
//         "lastPrice": "3.1344",
//         "low": "3.0338",
//         "priceChange": "0.043",
//         "priceChangePercent": "0.01391",
//         "quoteVolume": "2374393.61832",
//         "symbol": "BERA_USDC_PERP",
//         "trades": "6432",
//         "volume": "746384.8"
//     },
//     {
//         "firstPrice": "0.102",
//         "high": "0.114",
//         "lastPrice": "0.101",
//         "low": "0.101",
//         "priceChange": "-0.001",
//         "priceChangePercent": "-0.009804",
//         "quoteVolume": "2.20287",
//         "symbol": "BLUR_USDC",
//         "trades": "5",
//         "volume": "20.57"
//     },
//     {
//         "firstPrice": "646.99",
//         "high": "671.85",
//         "lastPrice": "664",
//         "low": "643.01",
//         "priceChange": "17.01",
//         "priceChangePercent": "0.026291",
//         "quoteVolume": "5721868.61412",
//         "symbol": "BNB_USDC_PERP",
//         "trades": "12697",
//         "volume": "8727.744"
//     },
//     {
//         "firstPrice": "0.002249",
//         "high": "0.00246",
//         "lastPrice": "0.002298",
//         "low": "0.002168",
//         "priceChange": "0.000049",
//         "priceChangePercent": "0.021787",
//         "quoteVolume": "5935.9701044",
//         "symbol": "BOME_USDC",
//         "trades": "60",
//         "volume": "2670795.2"
//     },
//     {
//         "firstPrice": "0.000019557",
//         "high": "0.000021939",
//         "lastPrice": "0.00002025",
//         "low": "0.000019147",
//         "priceChange": "0.000000693",
//         "priceChangePercent": "0.035435",
//         "quoteVolume": "19673.8196662",
//         "symbol": "BONK_USDC",
//         "trades": "32371",
//         "volume": "944695981"
//     },
//     {
//         "firstPrice": "106281.6",
//         "high": "109887.1",
//         "lastPrice": "106815.7",
//         "low": "105274",
//         "priceChange": "534.1",
//         "priceChangePercent": "0.005025",
//         "quoteVolume": "8228735.493627",
//         "symbol": "BTC_USDC",
//         "trades": "22225",
//         "volume": "76.74239"
//     },
//     {
//         "firstPrice": "106195.1",
//         "high": "109853.9",
//         "lastPrice": "106754.6",
//         "low": "105212.1",
//         "priceChange": "559.5",
//         "priceChangePercent": "0.005269",
//         "quoteVolume": "509887308.91825",
//         "symbol": "BTC_USDC_PERP",
//         "trades": "312379",
//         "volume": "4749.95687"
//     },
//     {
//         "firstPrice": "0.0784",
//         "high": "0.089",
//         "lastPrice": "0.0854",
//         "low": "0.0784",
//         "priceChange": "0.007",
//         "priceChangePercent": "0.089286",
//         "quoteVolume": "9606.500872",
//         "symbol": "CLOUD_USDC",
//         "trades": "390",
//         "volume": "113907.74"
//     },
//     {
//         "firstPrice": "0.22265",
//         "high": "0.23815",
//         "lastPrice": "0.22552",
//         "low": "0.21791",
//         "priceChange": "0.00287",
//         "priceChangePercent": "0.01289",
//         "quoteVolume": "9356473.090001",
//         "symbol": "DOGE_USDC_PERP",
//         "trades": "21025",
//         "volume": "41118105.4"
//     },
//     {
//         "firstPrice": "4.624",
//         "high": "4.877",
//         "lastPrice": "4.673",
//         "low": "4.527",
//         "priceChange": "0.049",
//         "priceChangePercent": "0.010597",
//         "quoteVolume": "951115.3498",
//         "symbol": "DOT_USDC_PERP",
//         "trades": "4018",
//         "volume": "202013"
//     },
//     {
//         "firstPrice": "0.6464",
//         "high": "0.6732",
//         "lastPrice": "0.6468",
//         "low": "0.639",
//         "priceChange": "0.0004",
//         "priceChangePercent": "0.000619",
//         "quoteVolume": "3631.716647",
//         "symbol": "DRIFT_USDC",
//         "trades": "35",
//         "volume": "5524.26"
//     },
//     {
//         "firstPrice": "0.3711",
//         "high": "0.4137",
//         "lastPrice": "0.3903",
//         "low": "0.36",
//         "priceChange": "0.0192",
//         "priceChangePercent": "0.051738",
//         "quoteVolume": "5165.18544",
//         "symbol": "ENA_USDC",
//         "trades": "1869",
//         "volume": "13463.88"
//     },
//     {
//         "firstPrice": "0.3706",
//         "high": "0.4141",
//         "lastPrice": "0.3921",
//         "low": "0.3584",
//         "priceChange": "0.0215",
//         "priceChangePercent": "0.058014",
//         "quoteVolume": "1932664.28284",
//         "symbol": "ENA_USDC_PERP",
//         "trades": "4928",
//         "volume": "4970984.3"
//     },
//     {
//         "firstPrice": "2499.01",
//         "high": "2616.01",
//         "lastPrice": "2486.83",
//         "low": "2444.47",
//         "priceChange": "-12.18",
//         "priceChangePercent": "-0.004874",
//         "quoteVolume": "19302743.262954",
//         "symbol": "ETH_USDC",
//         "trades": "23608",
//         "volume": "7600.2939"
//     },
//     {
//         "firstPrice": "2497.36",
//         "high": "2617.67",
//         "lastPrice": "2484.96",
//         "low": "2443.12",
//         "priceChange": "-12.4",
//         "priceChangePercent": "-0.004965",
//         "quoteVolume": "155855933.548094",
//         "symbol": "ETH_USDC_PERP",
//         "trades": "112617",
//         "volume": "61446.2191"
//     },
//     {
//         "firstPrice": "1.2849",
//         "high": "1.438",
//         "lastPrice": "1.3508",
//         "low": "1.2373",
//         "priceChange": "0.0659",
//         "priceChangePercent": "0.051288",
//         "quoteVolume": "12181305.30837",
//         "symbol": "FARTCOIN_USDC_PERP",
//         "trades": "18395",
//         "volume": "9279286.9"
//     },
//     {
//         "firstPrice": "0.1541",
//         "high": "0.1682",
//         "lastPrice": "0.167",
//         "low": "0.1537",
//         "priceChange": "0.0129",
//         "priceChangePercent": "0.083712",
//         "quoteVolume": "817.845525",
//         "symbol": "GOAT_USDC",
//         "trades": "6",
//         "volume": "5195.97"
//     },
//     {
//         "firstPrice": "3.95",
//         "high": "4.126",
//         "lastPrice": "3.987",
//         "low": "3.906",
//         "priceChange": "0.037",
//         "priceChangePercent": "0.009367",
//         "quoteVolume": "10272.3296",
//         "symbol": "HNT_USDC",
//         "trades": "364",
//         "volume": "2544.7"
//     },
//     {
//         "firstPrice": "0.02762",
//         "high": "0.02786",
//         "lastPrice": "0.02762",
//         "low": "0.02762",
//         "priceChange": "0",
//         "priceChangePercent": "0",
//         "quoteVolume": "4258.6874608",
//         "symbol": "HONEY_USDC",
//         "trades": "2",
//         "volume": "152866.52"
//     },
//     {
//         "firstPrice": "26.147",
//         "high": "28.138",
//         "lastPrice": "27.18",
//         "low": "25.504",
//         "priceChange": "1.033",
//         "priceChangePercent": "0.039507",
//         "quoteVolume": "3836495.5935",
//         "symbol": "HYPE_USDC_PERP",
//         "trades": "6629",
//         "volume": "142938.3"
//     },
//     {
//         "firstPrice": "0.9482",
//         "high": "1.0464",
//         "lastPrice": "0.9991",
//         "low": "0.9268",
//         "priceChange": "0.0509",
//         "priceChangePercent": "0.053681",
//         "quoteVolume": "16702.010357",
//         "symbol": "IO_USDC",
//         "trades": "2754",
//         "volume": "17039.39"
//     },
//     {
//         "firstPrice": "4.5439",
//         "high": "4.6617",
//         "lastPrice": "4.462",
//         "low": "4.4123",
//         "priceChange": "-0.0819",
//         "priceChangePercent": "-0.018024",
//         "quoteVolume": "546680.87139",
//         "symbol": "IP_USDC_PERP",
//         "trades": "2340",
//         "volume": "121081.2"
//     },
//     {
//         "firstPrice": "1.9847",
//         "high": "2.078",
//         "lastPrice": "1.9962",
//         "low": "1.9499",
//         "priceChange": "0.0115",
//         "priceChangePercent": "0.005794",
//         "quoteVolume": "30329.57985",
//         "symbol": "JTO_USDC",
//         "trades": "363",
//         "volume": "15041.7"
//     },
//     {
//         "firstPrice": "0.5008",
//         "high": "0.5435",
//         "lastPrice": "0.5105",
//         "low": "0.4899",
//         "priceChange": "0.0097",
//         "priceChangePercent": "0.019369",
//         "quoteVolume": "172158.541619",
//         "symbol": "JUP_USDC",
//         "trades": "4593",
//         "volume": "329273.54"
//     },
//     {
//         "firstPrice": "0.5007",
//         "high": "0.5433",
//         "lastPrice": "0.511",
//         "low": "0.4893",
//         "priceChange": "0.0103",
//         "priceChangePercent": "0.020571",
//         "quoteVolume": "2698441.37973",
//         "symbol": "JUP_USDC_PERP",
//         "trades": "19660",
//         "volume": "5219950.2"
//     },
//     {
//         "firstPrice": "0.2116",
//         "high": "0.2228",
//         "lastPrice": "0.2228",
//         "low": "0.2111",
//         "priceChange": "0.0112",
//         "priceChangePercent": "0.05293",
//         "quoteVolume": "130.301756",
//         "symbol": "J_USDC",
//         "trades": "9",
//         "volume": "598.03"
//     },
//     {
//         "firstPrice": "1.8444",
//         "high": "2.25",
//         "lastPrice": "2.1985",
//         "low": "1.8095",
//         "priceChange": "0.3541",
//         "priceChangePercent": "0.191987",
//         "quoteVolume": "2807317.29948",
//         "symbol": "KAITO_USDC_PERP",
//         "trades": "7903",
//         "volume": "1338298.7"
//     },
//     {
//         "firstPrice": "0.07006",
//         "high": "0.07561",
//         "lastPrice": "0.0735",
//         "low": "0.06993",
//         "priceChange": "0.00344",
//         "priceChangePercent": "0.049101",
//         "quoteVolume": "4080.925788",
//         "symbol": "KMNO_USDC",
//         "trades": "209",
//         "volume": "55589.14"
//     },
//     {
//         "firstPrice": "0.8624",
//         "high": "0.9374",
//         "lastPrice": "0.8958",
//         "low": "0.8605",
//         "priceChange": "0.0334",
//         "priceChangePercent": "0.038729",
//         "quoteVolume": "12608.816481",
//         "symbol": "LDO_USDC",
//         "trades": "77",
//         "volume": "14092.23"
//     },
//     {
//         "firstPrice": "15.597",
//         "high": "16.415",
//         "lastPrice": "16.415",
//         "low": "15.43",
//         "priceChange": "0.818",
//         "priceChangePercent": "0.052446",
//         "quoteVolume": "6547.577692",
//         "symbol": "LINK_USDC",
//         "trades": "151",
//         "volume": "413.44"
//     },
//     {
//         "firstPrice": "15.597",
//         "high": "16.496",
//         "lastPrice": "15.736",
//         "low": "15.258",
//         "priceChange": "0.139",
//         "priceChangePercent": "0.008912",
//         "quoteVolume": "760528.7003",
//         "symbol": "LINK_USDC_PERP",
//         "trades": "7731",
//         "volume": "47890.4"
//     },
//     {
//         "firstPrice": "94.45",
//         "high": "98.4",
//         "lastPrice": "95.65",
//         "low": "93.08",
//         "priceChange": "1.2",
//         "priceChangePercent": "0.012705",
//         "quoteVolume": "1115746.543",
//         "symbol": "LTC_USDC_PERP",
//         "trades": "4394",
//         "volume": "11717.7"
//     },
//     {
//         "firstPrice": "0.333",
//         "high": "0.412",
//         "lastPrice": "0.375",
//         "low": "0.333",
//         "priceChange": "0.042",
//         "priceChangePercent": "0.126126",
//         "quoteVolume": "73161.870096",
//         "symbol": "MELANIA_USDC",
//         "trades": "271",
//         "volume": "191645.007"
//     },
//     {
//         "firstPrice": "0.003214",
//         "high": "0.003484",
//         "lastPrice": "0.003391",
//         "low": "0.003174",
//         "priceChange": "0.000177",
//         "priceChangePercent": "0.055072",
//         "quoteVolume": "915.8087853",
//         "symbol": "MEW_USDC",
//         "trades": "1851",
//         "volume": "273302.5"
//     },
//     {
//         "firstPrice": "0.9344",
//         "high": "0.9753",
//         "lastPrice": "0.9517",
//         "low": "0.8542",
//         "priceChange": "0.0173",
//         "priceChangePercent": "0.018515",
//         "quoteVolume": "729.666896",
//         "symbol": "ME_USDC",
//         "trades": "11",
//         "volume": "768.31"
//     },
//     {
//         "firstPrice": "0.0004866",
//         "high": "0.0005044",
//         "lastPrice": "0.0004935",
//         "low": "0.0004866",
//         "priceChange": "0.0000069",
//         "priceChangePercent": "0.01418",
//         "quoteVolume": "261.3964066",
//         "symbol": "MOBILE_USDC",
//         "trades": "16",
//         "volume": "527160"
//     },
//     {
//         "firstPrice": "0.24013",
//         "high": "0.25355",
//         "lastPrice": "0.22382",
//         "low": "0.21923",
//         "priceChange": "-0.01631",
//         "priceChangePercent": "-0.067922",
//         "quoteVolume": "18294.3902336",
//         "symbol": "MOODENG_USDC",
//         "trades": "87",
//         "volume": "78241.6"
//     },
//     {
//         "firstPrice": "0.9402",
//         "high": "0.9965",
//         "lastPrice": "0.9525",
//         "low": "0.9312",
//         "priceChange": "0.0123",
//         "priceChangePercent": "0.013082",
//         "quoteVolume": "35737.040524",
//         "symbol": "ONDO_USDC",
//         "trades": "698",
//         "volume": "37556.22"
//     },
//     {
//         "firstPrice": "0.9415",
//         "high": "0.9985",
//         "lastPrice": "0.9547",
//         "low": "0.9202",
//         "priceChange": "0.0132",
//         "priceChangePercent": "0.01402",
//         "quoteVolume": "798146.59558",
//         "symbol": "ONDO_USDC_PERP",
//         "trades": "8584",
//         "volume": "836946.3"
//     },
//     {
//         "firstPrice": "0.01229",
//         "high": "0.014",
//         "lastPrice": "0.01307",
//         "low": "0.01226",
//         "priceChange": "0.00078",
//         "priceChangePercent": "0.063466",
//         "quoteVolume": "42035.8314448",
//         "symbol": "PENGU_USDC",
//         "trades": "736",
//         "volume": "3189842.43"
//     },
//     {
//         "firstPrice": "0.000013088",
//         "high": "0.00001461",
//         "lastPrice": "0.00001344",
//         "low": "0.00001297",
//         "priceChange": "0.000000352",
//         "priceChangePercent": "0.026895",
//         "quoteVolume": "34865.017593",
//         "symbol": "PEPE_USDC",
//         "trades": "2109",
//         "volume": "2510816891"
//     },
//     {
//         "firstPrice": "0.2313",
//         "high": "0.2427",
//         "lastPrice": "0.2346",
//         "low": "0.2303",
//         "priceChange": "0.0033",
//         "priceChangePercent": "0.014267",
//         "quoteVolume": "3094.409011",
//         "symbol": "POL_USDC",
//         "trades": "24",
//         "volume": "13221.56"
//     },
//     {
//         "firstPrice": "0.117",
//         "high": "0.1251",
//         "lastPrice": "0.1155",
//         "low": "0.1144",
//         "priceChange": "-0.0015",
//         "priceChangePercent": "-0.012821",
//         "quoteVolume": "1969.393981",
//         "symbol": "PRCL_USDC",
//         "trades": "78",
//         "volume": "16561.97"
//     },
//     {
//         "firstPrice": "0.1268",
//         "high": "0.1357",
//         "lastPrice": "0.1275",
//         "low": "0.1224",
//         "priceChange": "0.0007",
//         "priceChangePercent": "0.005521",
//         "quoteVolume": "26016.41687",
//         "symbol": "PYTH_USDC",
//         "trades": "301",
//         "volume": "201769.4"
//     },
//     {
//         "firstPrice": "3.1407",
//         "high": "3.3057",
//         "lastPrice": "3.2848",
//         "low": "3.136",
//         "priceChange": "0.1441",
//         "priceChangePercent": "0.045881",
//         "quoteVolume": "2887.51558",
//         "symbol": "RAY_USDC",
//         "trades": "18",
//         "volume": "900.91"
//     },
//     {
//         "firstPrice": "4.603",
//         "high": "5.098",
//         "lastPrice": "4.663",
//         "low": "4.508",
//         "priceChange": "0.06",
//         "priceChangePercent": "0.013035",
//         "quoteVolume": "5772.44561",
//         "symbol": "RENDER_USDC",
//         "trades": "358",
//         "volume": "1248.3"
//     },
//     {
//         "firstPrice": "0.000014374",
//         "high": "0.000015186",
//         "lastPrice": "0.0000145",
//         "low": "0.000014161",
//         "priceChange": "0.000000126",
//         "priceChangePercent": "0.008766",
//         "quoteVolume": "2146.4625278",
//         "symbol": "SHIB_USDC",
//         "trades": "2216",
//         "volume": "147242883"
//     },
//     {
//         "firstPrice": "167.97",
//         "high": "175",
//         "lastPrice": "167.84",
//         "low": "164.6",
//         "priceChange": "-0.13",
//         "priceChangePercent": "-0.000774",
//         "quoteVolume": "42608707.3236",
//         "symbol": "SOL_USDC",
//         "trades": "154255",
//         "volume": "250941.14"
//     },
//     {
//         "firstPrice": "167.89",
//         "high": "174.89",
//         "lastPrice": "167.77",
//         "low": "164.55",
//         "priceChange": "-0.12",
//         "priceChangePercent": "-0.000715",
//         "quoteVolume": "188053511.7951",
//         "symbol": "SOL_USDC_PERP",
//         "trades": "192827",
//         "volume": "1110342.68"
//     },
//     {
//         "firstPrice": "0.30881",
//         "high": "0.33889",
//         "lastPrice": "0.31652",
//         "low": "0.30806",
//         "priceChange": "0.00771",
//         "priceChangePercent": "0.024967",
//         "quoteVolume": "7578.6126461",
//         "symbol": "SONIC_USDC",
//         "trades": "1915",
//         "volume": "23365.86"
//     },
//     {
//         "firstPrice": "0.1503",
//         "high": "0.16",
//         "lastPrice": "0.1515",
//         "low": "0.1461",
//         "priceChange": "0.0012",
//         "priceChangePercent": "0.007984",
//         "quoteVolume": "3800.799197",
//         "symbol": "STRK_USDC",
//         "trades": "113",
//         "volume": "24855.4"
//     },
//     {
//         "firstPrice": "3.8969",
//         "high": "4.07",
//         "lastPrice": "3.8841",
//         "low": "3.8",
//         "priceChange": "-0.0128",
//         "priceChangePercent": "-0.003285",
//         "quoteVolume": "8230580.98669",
//         "symbol": "SUI_USDC",
//         "trades": "43929",
//         "volume": "2114908.6"
//     },
//     {
//         "firstPrice": "3.8938",
//         "high": "4.07",
//         "lastPrice": "3.8895",
//         "low": "3.7982",
//         "priceChange": "-0.0043",
//         "priceChangePercent": "-0.001104",
//         "quoteVolume": "48506837.441062",
//         "symbol": "SUI_USDC_PERP",
//         "trades": "66762",
//         "volume": "12464050.86"
//     },
//     {
//         "firstPrice": "0.4976",
//         "high": "0.5232",
//         "lastPrice": "0.5018",
//         "low": "0.4886",
//         "priceChange": "0.0042",
//         "priceChangePercent": "0.008441",
//         "quoteVolume": "971528.7316",
//         "symbol": "S_USDC_PERP",
//         "trades": "5296",
//         "volume": "1919115"
//     },
//     {
//         "firstPrice": "0.1515",
//         "high": "0.1683",
//         "lastPrice": "0.1591",
//         "low": "0.1508",
//         "priceChange": "0.0076",
//         "priceChangePercent": "0.050165",
//         "quoteVolume": "523.551464",
//         "symbol": "TNSR_USDC",
//         "trades": "153",
//         "volume": "3370.77"
//     },
//     {
//         "firstPrice": "13.315",
//         "high": "15.187",
//         "lastPrice": "14.261",
//         "low": "13.173",
//         "priceChange": "0.946",
//         "priceChangePercent": "0.071048",
//         "quoteVolume": "204518.469381",
//         "symbol": "TRUMP_USDC",
//         "trades": "2640",
//         "volume": "14292.933"
//     },
//     {
//         "firstPrice": "13.319",
//         "high": "15.219",
//         "lastPrice": "14.257",
//         "low": "13.15",
//         "priceChange": "0.938",
//         "priceChangePercent": "0.070426",
//         "quoteVolume": "19706591.45184",
//         "symbol": "TRUMP_USDC_PERP",
//         "trades": "26453",
//         "volume": "1374595.7"
//     },
//     {
//         "firstPrice": "5.827",
//         "high": "7",
//         "lastPrice": "6.372",
//         "low": "5.726",
//         "priceChange": "0.545",
//         "priceChangePercent": "0.09353",
//         "quoteVolume": "6882.45726",
//         "symbol": "UNI_USDC",
//         "trades": "505",
//         "volume": "1106.641"
//     },
//     {
//         "firstPrice": "1.0004",
//         "high": "1.0006",
//         "lastPrice": "1.0004",
//         "low": "1.0002",
//         "priceChange": "0",
//         "priceChangePercent": "0",
//         "quoteVolume": "992304.8169",
//         "symbol": "USDT_USDC",
//         "trades": "1815",
//         "volume": "991923"
//     },
//     {
//         "firstPrice": "0.00005937",
//         "high": "0.00006312",
//         "lastPrice": "0.00005895",
//         "low": "0.00005733",
//         "priceChange": "-0.00000042",
//         "priceChangePercent": "-0.007074",
//         "quoteVolume": "44197.1899313",
//         "symbol": "WEN_USDC",
//         "trades": "7523",
//         "volume": "739997636"
//     },
//     {
//         "firstPrice": "0.9749",
//         "high": "1.1744",
//         "lastPrice": "1.1173",
//         "low": "0.9465",
//         "priceChange": "0.1424",
//         "priceChangePercent": "0.146066",
//         "quoteVolume": "14545.26117",
//         "symbol": "WIF_USDC",
//         "trades": "122",
//         "volume": "14402.4"
//     },
//     {
//         "firstPrice": "0.9873",
//         "high": "1.1899",
//         "lastPrice": "1.1251",
//         "low": "0.9443",
//         "priceChange": "0.1378",
//         "priceChangePercent": "0.139573",
//         "quoteVolume": "3233504.99397",
//         "symbol": "WIF_USDC_PERP",
//         "trades": "8220",
//         "volume": "3095990.7"
//     },
//     {
//         "firstPrice": "1.1161",
//         "high": "1.2846",
//         "lastPrice": "1.2695",
//         "low": "1.1092",
//         "priceChange": "0.1534",
//         "priceChangePercent": "0.137443",
//         "quoteVolume": "5118.55458",
//         "symbol": "WLD_USDC",
//         "trades": "31",
//         "volume": "4158.798"
//     },
//     {
//         "firstPrice": "0.0935",
//         "high": "0.1014",
//         "lastPrice": "0.0958",
//         "low": "0.0913",
//         "priceChange": "0.0023",
//         "priceChangePercent": "0.024599",
//         "quoteVolume": "190238.279293",
//         "symbol": "W_USDC",
//         "trades": "3805",
//         "volume": "1969949.06"
//     },
//     {
//         "firstPrice": "2.3506",
//         "high": "2.4317",
//         "lastPrice": "2.3581",
//         "low": "2.316",
//         "priceChange": "0.0075",
//         "priceChangePercent": "0.003191",
//         "quoteVolume": "2708717.5140648",
//         "symbol": "XRP_USDC_PERP",
//         "trades": "12678",
//         "volume": "1142999.3379"
//     },
//     {
//         "firstPrice": "0.0274",
//         "high": "0.03008",
//         "lastPrice": "0.02699",
//         "low": "0.02438",
//         "priceChange": "-0.00041",
//         "priceChangePercent": "-0.014964",
//         "quoteVolume": "2379.5794231",
//         "symbol": "ZEX_USDC",
//         "trades": "1578",
//         "volume": "87730.38"
//     },
//     {
//         "firstPrice": "2.0577",
//         "high": "2.0577",
//         "lastPrice": "2.0452",
//         "low": "2.0452",
//         "priceChange": "-0.0125",
//         "priceChangePercent": "-0.006075",
//         "quoteVolume": "803.873829",
//         "symbol": "ZKJ_USDC",
//         "trades": "25",
//         "volume": "391.28"
//     },
//     {
//         "firstPrice": "2.6474",
//         "high": "2.8016",
//         "lastPrice": "2.6725",
//         "low": "2.5871",
//         "priceChange": "0.0251",
//         "priceChangePercent": "0.009481",
//         "quoteVolume": "16137.08984",
//         "symbol": "ZRO_USDC",
//         "trades": "411",
//         "volume": "5995.87"
//     }
// ]

// const trades : Trade[] = [
//     {
//         "id": 355822333,
//         "isBuyerMaker": true,
//         "price": "167.4",
//         "quantity": "0.13",
//         "quoteQuantity": "21.762",
//         "timestamp": 1747849978470
//     },
//     {
//         "id": 355822332,
//         "isBuyerMaker": false,
//         "price": "167.44",
//         "quantity": "0.1",
//         "quoteQuantity": "16.744",
//         "timestamp": 1747849978279
//     },
//     {
//         "id": 355822331,
//         "isBuyerMaker": false,
//         "price": "167.44",
//         "quantity": "0.08",
//         "quoteQuantity": "13.3952",
//         "timestamp": 1747849978044
//     },
//     {
//         "id": 355822330,
//         "isBuyerMaker": false,
//         "price": "167.44",
//         "quantity": "0.05",
//         "quoteQuantity": "8.372",
//         "timestamp": 1747849978044
//     },
//     {
//         "id": 355822329,
//         "isBuyerMaker": true,
//         "price": "167.4",
//         "quantity": "0.1",
//         "quoteQuantity": "16.74",
//         "timestamp": 1747849977867
//     },
//     {
//         "id": 355822328,
//         "isBuyerMaker": false,
//         "price": "167.43",
//         "quantity": "0.05",
//         "quoteQuantity": "8.3715",
//         "timestamp": 1747849976285
//     },
//     {
//         "id": 355822327,
//         "isBuyerMaker": false,
//         "price": "167.43",
//         "quantity": "7.31",
//         "quoteQuantity": "1223.9133",
//         "timestamp": 1747849976285
//     },
//     {
//         "id": 355822326,
//         "isBuyerMaker": true,
//         "price": "167.4",
//         "quantity": "0.57",
//         "quoteQuantity": "95.418",
//         "timestamp": 1747849976265
//     },
//     {
//         "id": 355822325,
//         "isBuyerMaker": true,
//         "price": "167.39",
//         "quantity": "1.22",
//         "quoteQuantity": "204.2158",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822324,
//         "isBuyerMaker": true,
//         "price": "167.39",
//         "quantity": "0.01",
//         "quoteQuantity": "1.6739",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822323,
//         "isBuyerMaker": true,
//         "price": "167.39",
//         "quantity": "0.01",
//         "quoteQuantity": "1.6739",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822322,
//         "isBuyerMaker": true,
//         "price": "167.4",
//         "quantity": "0.05",
//         "quoteQuantity": "8.37",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822321,
//         "isBuyerMaker": true,
//         "price": "167.4",
//         "quantity": "0.25",
//         "quoteQuantity": "41.85",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822320,
//         "isBuyerMaker": true,
//         "price": "167.4",
//         "quantity": "0.25",
//         "quoteQuantity": "41.85",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822319,
//         "isBuyerMaker": true,
//         "price": "167.4",
//         "quantity": "0.25",
//         "quoteQuantity": "41.85",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822318,
//         "isBuyerMaker": true,
//         "price": "167.4",
//         "quantity": "0.25",
//         "quoteQuantity": "41.85",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822317,
//         "isBuyerMaker": true,
//         "price": "167.4",
//         "quantity": "0.25",
//         "quoteQuantity": "41.85",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822316,
//         "isBuyerMaker": true,
//         "price": "167.4",
//         "quantity": "0.25",
//         "quoteQuantity": "41.85",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822315,
//         "isBuyerMaker": true,
//         "price": "167.4",
//         "quantity": "0.25",
//         "quoteQuantity": "41.85",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822314,
//         "isBuyerMaker": true,
//         "price": "167.4",
//         "quantity": "0.25",
//         "quoteQuantity": "41.85",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822313,
//         "isBuyerMaker": true,
//         "price": "167.4",
//         "quantity": "0.1",
//         "quoteQuantity": "16.74",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822312,
//         "isBuyerMaker": true,
//         "price": "167.4",
//         "quantity": "0.5",
//         "quoteQuantity": "83.7",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822311,
//         "isBuyerMaker": true,
//         "price": "167.41",
//         "quantity": "0.1",
//         "quoteQuantity": "16.741",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822310,
//         "isBuyerMaker": true,
//         "price": "167.42",
//         "quantity": "0.05",
//         "quoteQuantity": "8.371",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822309,
//         "isBuyerMaker": true,
//         "price": "167.42",
//         "quantity": "0.5",
//         "quoteQuantity": "83.71",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822308,
//         "isBuyerMaker": true,
//         "price": "167.42",
//         "quantity": "0.2",
//         "quoteQuantity": "33.484",
//         "timestamp": 1747849974812
//     },
//     {
//         "id": 355822307,
//         "isBuyerMaker": true,
//         "price": "167.43",
//         "quantity": "6",
//         "quoteQuantity": "1004.58",
//         "timestamp": 1747849972885
//     },
//     {
//         "id": 355822306,
//         "isBuyerMaker": true,
//         "price": "167.43",
//         "quantity": "0.01",
//         "quoteQuantity": "1.6743",
//         "timestamp": 1747849972885
//     },
//     {
//         "id": 355822305,
//         "isBuyerMaker": true,
//         "price": "167.43",
//         "quantity": "0.02",
//         "quoteQuantity": "3.3486",
//         "timestamp": 1747849972885
//     },
//     {
//         "id": 355822304,
//         "isBuyerMaker": true,
//         "price": "167.44",
//         "quantity": "0.5",
//         "quoteQuantity": "83.72",
//         "timestamp": 1747849972885
//     },
//     {
//         "id": 355822303,
//         "isBuyerMaker": false,
//         "price": "167.45",
//         "quantity": "0.08",
//         "quoteQuantity": "13.396",
//         "timestamp": 1747849971467
//     },
//     {
//         "id": 355822302,
//         "isBuyerMaker": true,
//         "price": "167.46",
//         "quantity": "0.5",
//         "quoteQuantity": "83.73",
//         "timestamp": 1747849969575
//     },
//     {
//         "id": 355822301,
//         "isBuyerMaker": true,
//         "price": "167.46",
//         "quantity": "0.02",
//         "quoteQuantity": "3.3492",
//         "timestamp": 1747849969575
//     },
//     {
//         "id": 355822300,
//         "isBuyerMaker": true,
//         "price": "167.47",
//         "quantity": "0.01",
//         "quoteQuantity": "1.6747",
//         "timestamp": 1747849969575
//     },
//     {
//         "id": 355822299,
//         "isBuyerMaker": true,
//         "price": "167.47",
//         "quantity": "0.25",
//         "quoteQuantity": "41.8675",
//         "timestamp": 1747849969575
//     },
//     {
//         "id": 355822298,
//         "isBuyerMaker": true,
//         "price": "167.47",
//         "quantity": "0.25",
//         "quoteQuantity": "41.8675",
//         "timestamp": 1747849969575
//     },
//     {
//         "id": 355822297,
//         "isBuyerMaker": true,
//         "price": "167.47",
//         "quantity": "0.25",
//         "quoteQuantity": "41.8675",
//         "timestamp": 1747849969575
//     },
//     {
//         "id": 355822296,
//         "isBuyerMaker": true,
//         "price": "167.47",
//         "quantity": "0.25",
//         "quoteQuantity": "41.8675",
//         "timestamp": 1747849969575
//     },
//     {
//         "id": 355822295,
//         "isBuyerMaker": true,
//         "price": "167.47",
//         "quantity": "0.02",
//         "quoteQuantity": "3.3494",
//         "timestamp": 1747849969575
//     },
//     {
//         "id": 355822294,
//         "isBuyerMaker": true,
//         "price": "167.49",
//         "quantity": "0.2",
//         "quoteQuantity": "33.498",
//         "timestamp": 1747849969575
//     },
//     {
//         "id": 355822293,
//         "isBuyerMaker": true,
//         "price": "167.5",
//         "quantity": "0.01",
//         "quoteQuantity": "1.675",
//         "timestamp": 1747849969339
//     },
//     {
//         "id": 355822292,
//         "isBuyerMaker": true,
//         "price": "167.5",
//         "quantity": "0.25",
//         "quoteQuantity": "41.875",
//         "timestamp": 1747849969339
//     },
//     {
//         "id": 355822291,
//         "isBuyerMaker": true,
//         "price": "167.5",
//         "quantity": "0.25",
//         "quoteQuantity": "41.875",
//         "timestamp": 1747849969339
//     },
//     {
//         "id": 355822290,
//         "isBuyerMaker": true,
//         "price": "167.5",
//         "quantity": "0.25",
//         "quoteQuantity": "41.875",
//         "timestamp": 1747849969339
//     },
//     {
//         "id": 355822289,
//         "isBuyerMaker": true,
//         "price": "167.5",
//         "quantity": "0.25",
//         "quoteQuantity": "41.875",
//         "timestamp": 1747849969339
//     },
//     {
//         "id": 355822288,
//         "isBuyerMaker": true,
//         "price": "167.5",
//         "quantity": "0.25",
//         "quoteQuantity": "41.875",
//         "timestamp": 1747849969339
//     },
//     {
//         "id": 355822287,
//         "isBuyerMaker": true,
//         "price": "167.5",
//         "quantity": "0.25",
//         "quoteQuantity": "41.875",
//         "timestamp": 1747849969339
//     },
//     {
//         "id": 355822286,
//         "isBuyerMaker": true,
//         "price": "167.5",
//         "quantity": "0.25",
//         "quoteQuantity": "41.875",
//         "timestamp": 1747849969339
//     },
//     {
//         "id": 355822285,
//         "isBuyerMaker": true,
//         "price": "167.5",
//         "quantity": "0.25",
//         "quoteQuantity": "41.875",
//         "timestamp": 1747849969339
//     },
//     {
//         "id": 355822284,
//         "isBuyerMaker": true,
//         "price": "167.5",
//         "quantity": "0.02",
//         "quoteQuantity": "3.35",
//         "timestamp": 1747849969339
//     },
//     {
//         "id": 355822283,
//         "isBuyerMaker": true,
//         "price": "167.5",
//         "quantity": "0.02",
//         "quoteQuantity": "3.35",
//         "timestamp": 1747849969339
//     },
//     {
//         "id": 355822282,
//         "isBuyerMaker": true,
//         "price": "167.51",
//         "quantity": "0.01",
//         "quoteQuantity": "1.6751",
//         "timestamp": 1747849969339
//     },
//     {
//         "id": 355822281,
//         "isBuyerMaker": true,
//         "price": "167.51",
//         "quantity": "0.02",
//         "quoteQuantity": "3.3502",
//         "timestamp": 1747849969339
//     },
//     {
//         "id": 355822280,
//         "isBuyerMaker": true,
//         "price": "167.51",
//         "quantity": "0.02",
//         "quoteQuantity": "3.3502",
//         "timestamp": 1747849969339
//     },
//     {
//         "id": 355822279,
//         "isBuyerMaker": true,
//         "price": "167.52",
//         "quantity": "6",
//         "quoteQuantity": "1005.12",
//         "timestamp": 1747849968882
//     },
//     {
//         "id": 355822278,
//         "isBuyerMaker": true,
//         "price": "167.53",
//         "quantity": "1.3",
//         "quoteQuantity": "217.789",
//         "timestamp": 1747849968853
//     },
//     {
//         "id": 355822277,
//         "isBuyerMaker": true,
//         "price": "167.53",
//         "quantity": "0.5",
//         "quoteQuantity": "83.765",
//         "timestamp": 1747849968853
//     },
//     {
//         "id": 355822276,
//         "isBuyerMaker": true,
//         "price": "167.54",
//         "quantity": "0.1",
//         "quoteQuantity": "16.754",
//         "timestamp": 1747849968853
//     },
//     {
//         "id": 355822275,
//         "isBuyerMaker": true,
//         "price": "167.54",
//         "quantity": "0.01",
//         "quoteQuantity": "1.6754",
//         "timestamp": 1747849968853
//     },
//     {
//         "id": 355822274,
//         "isBuyerMaker": true,
//         "price": "167.54",
//         "quantity": "0.02",
//         "quoteQuantity": "3.3508",
//         "timestamp": 1747849968853
//     },
//     {
//         "id": 355822273,
//         "isBuyerMaker": true,
//         "price": "167.54",
//         "quantity": "0.3",
//         "quoteQuantity": "50.262",
//         "timestamp": 1747849968853
//     },
//     {
//         "id": 355822272,
//         "isBuyerMaker": true,
//         "price": "167.57",
//         "quantity": "0.01",
//         "quoteQuantity": "1.6757",
//         "timestamp": 1747849968150
//     },
//     {
//         "id": 355822271,
//         "isBuyerMaker": true,
//         "price": "167.59",
//         "quantity": "6",
//         "quoteQuantity": "1005.54",
//         "timestamp": 1747849966627
//     },
//     {
//         "id": 355822270,
//         "isBuyerMaker": false,
//         "price": "167.63",
//         "quantity": "3.33",
//         "quoteQuantity": "558.2079",
//         "timestamp": 1747849966181
//     },
//     {
//         "id": 355822269,
//         "isBuyerMaker": false,
//         "price": "167.61",
//         "quantity": "1.3",
//         "quoteQuantity": "217.893",
//         "timestamp": 1747849966181
//     },
//     {
//         "id": 355822268,
//         "isBuyerMaker": false,
//         "price": "167.61",
//         "quantity": "0.1",
//         "quoteQuantity": "16.761",
//         "timestamp": 1747849966181
//     },
//     {
//         "id": 355822267,
//         "isBuyerMaker": false,
//         "price": "167.6",
//         "quantity": "6.9",
//         "quoteQuantity": "1156.44",
//         "timestamp": 1747849964044
//     },
//     {
//         "id": 355822266,
//         "isBuyerMaker": true,
//         "price": "167.58",
//         "quantity": "3.06",
//         "quoteQuantity": "512.7948",
//         "timestamp": 1747849959800
//     },
//     {
//         "id": 355822265,
//         "isBuyerMaker": true,
//         "price": "167.58",
//         "quantity": "0.01",
//         "quoteQuantity": "1.6758",
//         "timestamp": 1747849959800
//     },
//     {
//         "id": 355822264,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.93",
//         "quoteQuantity": "155.868",
//         "timestamp": 1747849959800
//     },
//     {
//         "id": 355822263,
//         "isBuyerMaker": true,
//         "price": "167.61",
//         "quantity": "0.1",
//         "quoteQuantity": "16.761",
//         "timestamp": 1747849959800
//     },
//     {
//         "id": 355822262,
//         "isBuyerMaker": true,
//         "price": "167.63",
//         "quantity": "6",
//         "quoteQuantity": "1005.78",
//         "timestamp": 1747849959800
//     },
//     {
//         "id": 355822261,
//         "isBuyerMaker": false,
//         "price": "167.68",
//         "quantity": "2.24",
//         "quoteQuantity": "375.6032",
//         "timestamp": 1747849957602
//     },
//     {
//         "id": 355822260,
//         "isBuyerMaker": false,
//         "price": "167.67",
//         "quantity": "0.81",
//         "quoteQuantity": "135.8127",
//         "timestamp": 1747849957602
//     },
//     {
//         "id": 355822259,
//         "isBuyerMaker": false,
//         "price": "167.67",
//         "quantity": "7.05",
//         "quoteQuantity": "1182.0735",
//         "timestamp": 1747849957602
//     },
//     {
//         "id": 355822258,
//         "isBuyerMaker": false,
//         "price": "167.63",
//         "quantity": "0.1",
//         "quoteQuantity": "16.763",
//         "timestamp": 1747849957414
//     },
//     {
//         "id": 355822257,
//         "isBuyerMaker": false,
//         "price": "167.63",
//         "quantity": "6.85",
//         "quoteQuantity": "1148.2655",
//         "timestamp": 1747849957414
//     },
//     {
//         "id": 355822256,
//         "isBuyerMaker": true,
//         "price": "167.62",
//         "quantity": "4.73",
//         "quoteQuantity": "792.8426",
//         "timestamp": 1747849957208
//     },
//     {
//         "id": 355822255,
//         "isBuyerMaker": true,
//         "price": "167.59",
//         "quantity": "3.09",
//         "quoteQuantity": "517.8531",
//         "timestamp": 1747849954465
//     },
//     {
//         "id": 355822254,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.91",
//         "quoteQuantity": "152.516",
//         "timestamp": 1747849954465
//     },
//     {
//         "id": 355822253,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.1",
//         "quoteQuantity": "16.76",
//         "timestamp": 1747849954465
//     },
//     {
//         "id": 355822252,
//         "isBuyerMaker": true,
//         "price": "167.62",
//         "quantity": "6",
//         "quoteQuantity": "1005.72",
//         "timestamp": 1747849954465
//     },
//     {
//         "id": 355822251,
//         "isBuyerMaker": false,
//         "price": "167.68",
//         "quantity": "3.21",
//         "quoteQuantity": "538.2528",
//         "timestamp": 1747849952293
//     },
//     {
//         "id": 355822250,
//         "isBuyerMaker": false,
//         "price": "167.64",
//         "quantity": "6.89",
//         "quoteQuantity": "1155.0396",
//         "timestamp": 1747849952293
//     },
//     {
//         "id": 355822249,
//         "isBuyerMaker": false,
//         "price": "167.59",
//         "quantity": "0.1",
//         "quoteQuantity": "16.759",
//         "timestamp": 1747849951928
//     },
//     {
//         "id": 355822248,
//         "isBuyerMaker": false,
//         "price": "167.59",
//         "quantity": "7.18",
//         "quoteQuantity": "1203.2962",
//         "timestamp": 1747849951928
//     },
//     {
//         "id": 355822247,
//         "isBuyerMaker": true,
//         "price": "167.57",
//         "quantity": "0.31",
//         "quoteQuantity": "51.9467",
//         "timestamp": 1747849950894
//     },
//     {
//         "id": 355822246,
//         "isBuyerMaker": false,
//         "price": "167.62",
//         "quantity": "2.77",
//         "quoteQuantity": "464.3074",
//         "timestamp": 1747849949812
//     },
//     {
//         "id": 355822245,
//         "isBuyerMaker": false,
//         "price": "167.61",
//         "quantity": "0.97",
//         "quoteQuantity": "162.5817",
//         "timestamp": 1747849949812
//     },
//     {
//         "id": 355822244,
//         "isBuyerMaker": false,
//         "price": "167.61",
//         "quantity": "0.99",
//         "quoteQuantity": "165.9339",
//         "timestamp": 1747849949812
//     },
//     {
//         "id": 355822243,
//         "isBuyerMaker": true,
//         "price": "167.55",
//         "quantity": "0.6",
//         "quoteQuantity": "100.53",
//         "timestamp": 1747849946553
//     },
//     {
//         "id": 355822242,
//         "isBuyerMaker": true,
//         "price": "167.55",
//         "quantity": "0.02",
//         "quoteQuantity": "3.351",
//         "timestamp": 1747849946553
//     },
//     {
//         "id": 355822241,
//         "isBuyerMaker": true,
//         "price": "167.55",
//         "quantity": "0.02",
//         "quoteQuantity": "3.351",
//         "timestamp": 1747849946553
//     },
//     {
//         "id": 355822240,
//         "isBuyerMaker": true,
//         "price": "167.55",
//         "quantity": "0.2",
//         "quoteQuantity": "33.51",
//         "timestamp": 1747849946553
//     },
//     {
//         "id": 355822239,
//         "isBuyerMaker": true,
//         "price": "167.55",
//         "quantity": "0.61",
//         "quoteQuantity": "102.2055",
//         "timestamp": 1747849946553
//     },
//     {
//         "id": 355822238,
//         "isBuyerMaker": true,
//         "price": "167.56",
//         "quantity": "0.02",
//         "quoteQuantity": "3.3512",
//         "timestamp": 1747849946553
//     },
//     {
//         "id": 355822237,
//         "isBuyerMaker": true,
//         "price": "167.56",
//         "quantity": "0.1",
//         "quoteQuantity": "16.756",
//         "timestamp": 1747849946553
//     },
//     {
//         "id": 355822236,
//         "isBuyerMaker": true,
//         "price": "167.56",
//         "quantity": "0.21",
//         "quoteQuantity": "35.1876",
//         "timestamp": 1747849946553
//     },
//     {
//         "id": 355822235,
//         "isBuyerMaker": true,
//         "price": "167.57",
//         "quantity": "0.03",
//         "quoteQuantity": "5.0271",
//         "timestamp": 1747849946553
//     },
//     {
//         "id": 355822234,
//         "isBuyerMaker": true,
//         "price": "167.58",
//         "quantity": "0.02",
//         "quoteQuantity": "3.3516",
//         "timestamp": 1747849946553
//     },
//     {
//         "id": 355822233,
//         "isBuyerMaker": true,
//         "price": "167.59",
//         "quantity": "0.02",
//         "quoteQuantity": "3.3518",
//         "timestamp": 1747849946553
//     },
//     {
//         "id": 355822232,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822231,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822230,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822229,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822228,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822227,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822226,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822225,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822224,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.4",
//         "quoteQuantity": "67.04",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822223,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.5",
//         "quoteQuantity": "83.8",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822222,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822221,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822220,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822219,
//         "isBuyerMaker": true,
//         "price": "167.6",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822218,
//         "isBuyerMaker": true,
//         "price": "167.61",
//         "quantity": "0.2",
//         "quoteQuantity": "33.522",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822217,
//         "isBuyerMaker": true,
//         "price": "167.65",
//         "quantity": "0.4",
//         "quoteQuantity": "67.06",
//         "timestamp": 1747849945013
//     },
//     {
//         "id": 355822216,
//         "isBuyerMaker": true,
//         "price": "167.66",
//         "quantity": "0.2",
//         "quoteQuantity": "33.532",
//         "timestamp": 1747849945003
//     },
//     {
//         "id": 355822215,
//         "isBuyerMaker": true,
//         "price": "167.67",
//         "quantity": "0.02",
//         "quoteQuantity": "3.3534",
//         "timestamp": 1747849944722
//     },
//     {
//         "id": 355822214,
//         "isBuyerMaker": true,
//         "price": "167.69",
//         "quantity": "6",
//         "quoteQuantity": "1006.14",
//         "timestamp": 1747849942994
//     },
//     {
//         "id": 355822213,
//         "isBuyerMaker": true,
//         "price": "167.7",
//         "quantity": "0.05",
//         "quoteQuantity": "8.385",
//         "timestamp": 1747849942956
//     },
//     {
//         "id": 355822212,
//         "isBuyerMaker": true,
//         "price": "167.7",
//         "quantity": "0.25",
//         "quoteQuantity": "41.925",
//         "timestamp": 1747849942956
//     },
//     {
//         "id": 355822211,
//         "isBuyerMaker": true,
//         "price": "167.7",
//         "quantity": "0.25",
//         "quoteQuantity": "41.925",
//         "timestamp": 1747849942956
//     },
//     {
//         "id": 355822210,
//         "isBuyerMaker": true,
//         "price": "167.7",
//         "quantity": "0.25",
//         "quoteQuantity": "41.925",
//         "timestamp": 1747849942956
//     },
//     {
//         "id": 355822209,
//         "isBuyerMaker": true,
//         "price": "167.7",
//         "quantity": "0.25",
//         "quoteQuantity": "41.925",
//         "timestamp": 1747849942956
//     },
//     {
//         "id": 355822208,
//         "isBuyerMaker": true,
//         "price": "167.7",
//         "quantity": "0.25",
//         "quoteQuantity": "41.925",
//         "timestamp": 1747849942956
//     },
//     {
//         "id": 355822207,
//         "isBuyerMaker": true,
//         "price": "167.7",
//         "quantity": "0.25",
//         "quoteQuantity": "41.925",
//         "timestamp": 1747849942956
//     },
//     {
//         "id": 355822206,
//         "isBuyerMaker": true,
//         "price": "167.7",
//         "quantity": "0.25",
//         "quoteQuantity": "41.925",
//         "timestamp": 1747849942956
//     },
//     {
//         "id": 355822205,
//         "isBuyerMaker": true,
//         "price": "167.7",
//         "quantity": "0.25",
//         "quoteQuantity": "41.925",
//         "timestamp": 1747849942956
//     },
//     {
//         "id": 355822204,
//         "isBuyerMaker": true,
//         "price": "167.71",
//         "quantity": "0.2",
//         "quoteQuantity": "33.542",
//         "timestamp": 1747849942947
//     },
//     {
//         "id": 355822203,
//         "isBuyerMaker": true,
//         "price": "167.73",
//         "quantity": "6",
//         "quoteQuantity": "1006.38",
//         "timestamp": 1747849942627
//     },
//     {
//         "id": 355822202,
//         "isBuyerMaker": true,
//         "price": "167.73",
//         "quantity": "0.05",
//         "quoteQuantity": "8.3865",
//         "timestamp": 1747849942627
//     },
//     {
//         "id": 355822201,
//         "isBuyerMaker": true,
//         "price": "167.74",
//         "quantity": "0.05",
//         "quoteQuantity": "8.387",
//         "timestamp": 1747849942627
//     },
//     {
//         "id": 355822200,
//         "isBuyerMaker": true,
//         "price": "167.74",
//         "quantity": "4.73",
//         "quoteQuantity": "793.4102",
//         "timestamp": 1747849941210
//     },
//     {
//         "id": 355822199,
//         "isBuyerMaker": true,
//         "price": "167.74",
//         "quantity": "0.13",
//         "quoteQuantity": "21.8062",
//         "timestamp": 1747849940955
//     },
//     {
//         "id": 355822198,
//         "isBuyerMaker": false,
//         "price": "167.75",
//         "quantity": "0.1",
//         "quoteQuantity": "16.775",
//         "timestamp": 1747849940746
//     },
//     {
//         "id": 355822197,
//         "isBuyerMaker": false,
//         "price": "167.76",
//         "quantity": "0.13",
//         "quoteQuantity": "21.8088",
//         "timestamp": 1747849940458
//     },
//     {
//         "id": 355822196,
//         "isBuyerMaker": true,
//         "price": "167.75",
//         "quantity": "0.1",
//         "quoteQuantity": "16.775",
//         "timestamp": 1747849940179
//     },
//     {
//         "id": 355822195,
//         "isBuyerMaker": false,
//         "price": "167.76",
//         "quantity": "6.86",
//         "quoteQuantity": "1150.8336",
//         "timestamp": 1747849937782
//     },
//     {
//         "id": 355822194,
//         "isBuyerMaker": false,
//         "price": "167.76",
//         "quantity": "0.31",
//         "quoteQuantity": "52.0056",
//         "timestamp": 1747849937616
//     },
//     {
//         "id": 355822193,
//         "isBuyerMaker": true,
//         "price": "167.77",
//         "quantity": "6",
//         "quoteQuantity": "1006.62",
//         "timestamp": 1747849937261
//     },
//     {
//         "id": 355822192,
//         "isBuyerMaker": true,
//         "price": "167.73",
//         "quantity": "3.08",
//         "quoteQuantity": "516.6084",
//         "timestamp": 1747849935589
//     },
//     {
//         "id": 355822191,
//         "isBuyerMaker": true,
//         "price": "167.73",
//         "quantity": "0.01",
//         "quoteQuantity": "1.6773",
//         "timestamp": 1747849935589
//     },
//     {
//         "id": 355822190,
//         "isBuyerMaker": true,
//         "price": "167.73",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9325",
//         "timestamp": 1747849935589
//     },
//     {
//         "id": 355822189,
//         "isBuyerMaker": true,
//         "price": "167.73",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9325",
//         "timestamp": 1747849935589
//     },
//     {
//         "id": 355822188,
//         "isBuyerMaker": true,
//         "price": "167.73",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9325",
//         "timestamp": 1747849935589
//     },
//     {
//         "id": 355822187,
//         "isBuyerMaker": true,
//         "price": "167.73",
//         "quantity": "0.25",
//         "quoteQuantity": "41.9325",
//         "timestamp": 1747849935589
//     },
//     {
//         "id": 355822186,
//         "isBuyerMaker": true,
//         "price": "167.77",
//         "quantity": "6",
//         "quoteQuantity": "1006.62",
//         "timestamp": 1747849935589
//     },
//     {
//         "id": 355822185,
//         "isBuyerMaker": true,
//         "price": "167.81",
//         "quantity": "6",
//         "quoteQuantity": "1006.86",
//         "timestamp": 1747849935202
//     },
//     {
//         "id": 355822184,
//         "isBuyerMaker": false,
//         "price": "167.83",
//         "quantity": "4.72",
//         "quoteQuantity": "792.1576",
//         "timestamp": 1747849933189
//     }

// ]

// const depth : Depth = {
//     "asks": [
//         [
//             "179.65",
//             "38.09"
//         ],
//         [
//             "179.66",
//             "50.49"
//         ],
//         [
//             "179.67",
//             "34.02"
//         ],
//         [
//             "179.68",
//             "0.01"
//         ],
//         [
//             "179.70",
//             "2.61"
//         ],
//         [
//             "179.71",
//             "0.14"
//         ],
//         [
//             "179.72",
//             "13.92"
//         ],
//         [
//             "179.73",
//             "1.10"
//         ],
//         [
//             "179.74",
//             "0.60"
//         ],
//         [
//             "179.75",
//             "0.06"
//         ],
//         [
//             "179.77",
//             "27.84"
//         ],
//         [
//             "179.78",
//             "0.50"
//         ],
//         [
//             "179.79",
//             "0.58"
//         ],
//         [
//             "179.80",
//             "51.33"
//         ],
//         [
//             "179.81",
//             "27.80"
//         ],
//         [
//             "179.82",
//             "6.55"
//         ],
//         [
//             "179.85",
//             "0.62"
//         ],
//         [
//             "179.86",
//             "3.00"
//         ],
//         [
//             "179.87",
//             "1.00"
//         ],
//         [
//             "179.88",
//             "1.01"
//         ],
//         [
//             "179.89",
//             "0.04"
//         ],
//         [
//             "179.90",
//             "3.93"
//         ],
//         [
//             "179.92",
//             "4.33"
//         ],
//         [
//             "179.93",
//             "4.08"
//         ],
//         [
//             "179.94",
//             "0.06"
//         ],
//         [
//             "179.96",
//             "4.50"
//         ],
//         [
//             "179.97",
//             "0.04"
//         ],
//         [
//             "179.98",
//             "0.73"
//         ],
//         [
//             "179.99",
//             "1.38"
//         ],
//         [
//             "180.00",
//             "28.33"
//         ],
//         [
//             "180.01",
//             "0.56"
//         ],
//         [
//             "180.02",
//             "0.99"
//         ],
//         [
//             "180.03",
//             "23.58"
//         ],
//         [
//             "180.04",
//             "4.72"
//         ],
//         [
//             "180.06",
//             "0.03"
//         ],
//         [
//             "180.07",
//             "20.07"
//         ],
//         [
//             "180.08",
//             "0.10"
//         ],
//         [
//             "180.10",
//             "2.55"
//         ],
//         [
//             "180.11",
//             "11.94"
//         ],
//         [
//             "180.12",
//             "0.50"
//         ],
//         [
//             "180.14",
//             "9.73"
//         ],
//         [
//             "180.16",
//             "36.08"
//         ],
//         [
//             "180.17",
//             "0.91"
//         ],
//         [
//             "180.20",
//             "0.50"
//         ],
//         [
//             "180.21",
//             "0.04"
//         ],
//         [
//             "180.24",
//             "0.22"
//         ],
//         [
//             "180.25",
//             "0.14"
//         ],
//         [
//             "180.26",
//             "5.55"
//         ],
//         [
//             "180.27",
//             "0.76"
//         ],
//         [
//             "180.28",
//             "0.27"
//         ],
//         [
//             "180.30",
//             "268.05"
//         ],
//         [
//             "180.32",
//             "0.51"
//         ],
//         [
//             "180.33",
//             "0.11"
//         ],
//         [
//             "180.35",
//             "0.09"
//         ],
//         [
//             "180.36",
//             "0.80"
//         ],
//         [
//             "180.40",
//             "3.84"
//         ],
//         [
//             "180.41",
//             "36.32"
//         ],
//         [
//             "180.42",
//             "4.23"
//         ],
//         [
//             "180.44",
//             "1.99"
//         ],
//         [
//             "180.45",
//             "0.34"
//         ],
//         [
//             "180.46",
//             "0.50"
//         ],
//         [
//             "180.49",
//             "0.65"
//         ],
//         [
//             "180.50",
//             "2.11"
//         ],
//         [
//             "180.51",
//             "69.90"
//         ],
//         [
//             "180.52",
//             "0.15"
//         ],
//         [
//             "180.53",
//             "1.12"
//         ],
//         [
//             "180.54",
//             "0.06"
//         ],
//         [
//             "180.55",
//             "0.65"
//         ],
//         [
//             "180.60",
//             "10.54"
//         ],
//         [
//             "180.61",
//             "0.08"
//         ],
//         [
//             "180.62",
//             "0.50"
//         ],
//         [
//             "180.65",
//             "39.46"
//         ],
//         [
//             "180.67",
//             "0.28"
//         ],
//         [
//             "180.69",
//             "0.59"
//         ],
//         [
//             "180.70",
//             "2.00"
//         ],
//         [
//             "180.71",
//             "0.61"
//         ],
//         [
//             "180.72",
//             "3.52"
//         ],
//         [
//             "180.74",
//             "5.50"
//         ],
//         [
//             "180.75",
//             "402.15"
//         ],
//         [
//             "180.77",
//             "116.67"
//         ],
//         [
//             "180.78",
//             "8.03"
//         ],
//         [
//             "180.79",
//             "0.15"
//         ],
//         [
//             "180.80",
//             "1.98"
//         ],
//         [
//             "180.82",
//             "0.88"
//         ],
//         [
//             "180.83",
//             "0.50"
//         ],
//         [
//             "180.84",
//             "0.93"
//         ],
//         [
//             "180.85",
//             "78.06"
//         ],
//         [
//             "180.87",
//             "0.50"
//         ],
//         [
//             "180.90",
//             "2.24"
//         ],
//         [
//             "180.91",
//             "22.80"
//         ],
//         [
//             "180.92",
//             "0.03"
//         ],
//         [
//             "180.93",
//             "212.37"
//         ],
//         [
//             "180.96",
//             "674.20"
//         ],
//         [
//             "181.00",
//             "6.78"
//         ],
//         [
//             "181.03",
//             "0.31"
//         ],
//         [
//             "181.05",
//             "0.21"
//         ],
//         [
//             "181.06",
//             "0.64"
//         ],
//         [
//             "181.09",
//             "0.06"
//         ],
//         [
//             "181.10",
//             "3.32"
//         ],
//         [
//             "181.12",
//             "0.01"
//         ],
//         [
//             "181.14",
//             "0.02"
//         ],
//         [
//             "181.15",
//             "2.38"
//         ],
//         [
//             "181.18",
//             "0.29"
//         ],
//         [
//             "181.21",
//             "0.04"
//         ],
//         [
//             "181.23",
//             "1.52"
//         ],
//         [
//             "181.27",
//             "0.30"
//         ],
//         [
//             "181.30",
//             "1.79"
//         ],
//         [
//             "181.31",
//             "0.08"
//         ],
//         [
//             "181.33",
//             "0.17"
//         ],
//         [
//             "181.34",
//             "0.20"
//         ],
//         [
//             "181.35",
//             "0.61"
//         ],
//         [
//             "181.36",
//             "0.40"
//         ],
//         [
//             "181.41",
//             "0.21"
//         ],
//         [
//             "181.43",
//             "0.06"
//         ],
//         [
//             "181.45",
//             "0.58"
//         ],
//         [
//             "181.47",
//             "1.61"
//         ],
//         [
//             "181.50",
//             "7.82"
//         ],
//         [
//             "181.51",
//             "0.05"
//         ],
//         [
//             "181.54",
//             "0.02"
//         ],
//         [
//             "181.60",
//             "1.15"
//         ],
//         [
//             "181.62",
//             "0.06"
//         ],
//         [
//             "181.67",
//             "2.21"
//         ],
//         [
//             "181.68",
//             "0.04"
//         ],
//         [
//             "181.70",
//             "5.15"
//         ],
//         [
//             "181.75",
//             "2.21"
//         ],
//         [
//             "181.77",
//             "0.21"
//         ],
//         [
//             "181.79",
//             "0.24"
//         ],
//         [
//             "181.80",
//             "0.62"
//         ],
//         [
//             "181.86",
//             "0.15"
//         ],
//         [
//             "181.89",
//             "0.06"
//         ],
//         [
//             "181.90",
//             "0.20"
//         ],
//         [
//             "181.95",
//             "0.29"
//         ],
//         [
//             "181.97",
//             "0.02"
//         ],
//         [
//             "181.98",
//             "1.94"
//         ],
//         [
//             "182.00",
//             "167.45"
//         ],
//         [
//             "182.03",
//             "0.06"
//         ],
//         [
//             "182.10",
//             "1.70"
//         ],
//         [
//             "182.13",
//             "0.77"
//         ],
//         [
//             "182.15",
//             "0.06"
//         ],
//         [
//             "182.16",
//             "0.06"
//         ],
//         [
//             "182.17",
//             "3.00"
//         ],
//         [
//             "182.18",
//             "0.21"
//         ],
//         [
//             "182.20",
//             "1.49"
//         ],
//         [
//             "182.23",
//             "0.03"
//         ],
//         [
//             "182.29",
//             "0.08"
//         ],
//         [
//             "182.30",
//             "6.59"
//         ],
//         [
//             "182.35",
//             "0.04"
//         ],
//         [
//             "182.36",
//             "0.52"
//         ],
//         [
//             "182.40",
//             "0.15"
//         ],
//         [
//             "182.41",
//             "0.02"
//         ],
//         [
//             "182.43",
//             "0.06"
//         ],
//         [
//             "182.44",
//             "0.50"
//         ],
//         [
//             "182.45",
//             "0.62"
//         ],
//         [
//             "182.48",
//             "0.07"
//         ],
//         [
//             "182.50",
//             "11.16"
//         ],
//         [
//             "182.56",
//             "0.21"
//         ],
//         [
//             "182.59",
//             "0.02"
//         ],
//         [
//             "182.62",
//             "0.02"
//         ],
//         [
//             "182.65",
//             "0.19"
//         ],
//         [
//             "182.67",
//             "0.18"
//         ],
//         [
//             "182.68",
//             "0.50"
//         ],
//         [
//             "182.69",
//             "0.01"
//         ],
//         [
//             "182.70",
//             "0.06"
//         ],
//         [
//             "182.74",
//             "0.50"
//         ],
//         [
//             "182.76",
//             "0.08"
//         ],
//         [
//             "182.78",
//             "0.62"
//         ],
//         [
//             "182.85",
//             "0.02"
//         ],
//         [
//             "182.87",
//             "1.68"
//         ],
//         [
//             "182.90",
//             "0.20"
//         ],
//         [
//             "182.92",
//             "0.08"
//         ],
//         [
//             "182.94",
//             "0.36"
//         ],
//         [
//             "182.97",
//             "0.06"
//         ],
//         [
//             "183.00",
//             "49.34"
//         ],
//         [
//             "183.03",
//             "0.06"
//         ],
//         [
//             "183.11",
//             "1.23"
//         ],
//         [
//             "183.21",
//             "0.15"
//         ],
//         [
//             "183.23",
//             "0.21"
//         ],
//         [
//             "183.24",
//             "0.06"
//         ],
//         [
//             "183.28",
//             "0.02"
//         ],
//         [
//             "183.29",
//             "0.64"
//         ],
//         [
//             "183.31",
//             "2.21"
//         ],
//         [
//             "183.33",
//             "0.21"
//         ],
//         [
//             "183.39",
//             "2.21"
//         ],
//         [
//             "183.44",
//             "0.62"
//         ],
//         [
//             "183.48",
//             "0.04"
//         ],
//         [
//             "183.50",
//             "3.28"
//         ],
//         [
//             "183.55",
//             "0.03"
//         ],
//         [
//             "183.60",
//             "0.75"
//         ],
//         [
//             "183.62",
//             "0.08"
//         ],
//         [
//             "183.66",
//             "0.06"
//         ],
//         [
//             "183.69",
//             "0.53"
//         ],
//         [
//             "183.70",
//             "78.14"
//         ],
//         [
//             "183.71",
//             "1.91"
//         ],
//         [
//             "183.75",
//             "0.06"
//         ],
//         [
//             "183.77",
//             "0.62"
//         ],
//         [
//             "183.87",
//             "1.08"
//         ],
//         [
//             "183.89",
//             "0.63"
//         ],
//         [
//             "183.90",
//             "0.20"
//         ],
//         [
//             "183.91",
//             "0.30"
//         ],
//         [
//             "183.96",
//             "0.21"
//         ],
//         [
//             "183.97",
//             "0.08"
//         ],
//         [
//             "183.98",
//             "1.00"
//         ],
//         [
//             "183.99",
//             "0.03"
//         ],
//         [
//             "184.00",
//             "25.84"
//         ],
//         [
//             "184.04",
//             "0.52"
//         ],
//         [
//             "184.10",
//             "1.33"
//         ],
//         [
//             "184.11",
//             "0.08"
//         ],
//         [
//             "184.12",
//             "0.25"
//         ],
//         [
//             "184.37",
//             "0.08"
//         ],
//         [
//             "184.43",
//             "0.03"
//         ],
//         [
//             "184.44",
//             "0.50"
//         ],
//         [
//             "184.48",
//             "0.21"
//         ],
//         [
//             "184.50",
//             "20.00"
//         ],
//         [
//             "184.53",
//             "0.08"
//         ],
//         [
//             "184.56",
//             "0.46"
//         ],
//         [
//             "184.58",
//             "1.68"
//         ],
//         [
//             "184.62",
//             "0.54"
//         ],
//         [
//             "184.70",
//             "0.21"
//         ],
//         [
//             "184.76",
//             "0.50"
//         ],
//         [
//             "184.80",
//             "10.00"
//         ],
//         [
//             "184.82",
//             "6.36"
//         ],
//         [
//             "184.87",
//             "0.24"
//         ],
//         [
//             "184.90",
//             "50.22"
//         ],
//         [
//             "184.96",
//             "0.50"
//         ],
//         [
//             "185.00",
//             "435.10"
//         ],
//         [
//             "185.13",
//             "1.64"
//         ],
//         [
//             "185.26",
//             "0.21"
//         ],
//         [
//             "185.31",
//             "0.03"
//         ],
//         [
//             "185.33",
//             "0.33"
//         ],
//         [
//             "185.36",
//             "0.06"
//         ],
//         [
//             "185.38",
//             "0.63"
//         ],
//         [
//             "185.43",
//             "0.21"
//         ],
//         [
//             "185.50",
//             "3.50"
//         ],
//         [
//             "185.65",
//             "0.21"
//         ],
//         [
//             "185.66",
//             "0.08"
//         ],
//         [
//             "185.70",
//             "10.00"
//         ],
//         [
//             "185.76",
//             "0.03"
//         ],
//         [
//             "185.82",
//             "1.20"
//         ],
//         [
//             "185.90",
//             "0.20"
//         ],
//         [
//             "185.98",
//             "0.08"
//         ],
//         [
//             "186.00",
//             "6.98"
//         ],
//         [
//             "186.04",
//             "0.21"
//         ],
//         [
//             "186.14",
//             "0.08"
//         ],
//         [
//             "186.18",
//             "0.21"
//         ],
//         [
//             "186.20",
//             "0.03"
//         ],
//         [
//             "186.31",
//             "0.11"
//         ],
//         [
//             "186.43",
//             "0.21"
//         ],
//         [
//             "186.50",
//             "3.00"
//         ],
//         [
//             "186.82",
//             "0.21"
//         ],
//         [
//             "186.90",
//             "0.20"
//         ],
//         [
//             "187.00",
//             "54.89"
//         ],
//         [
//             "187.20",
//             "25.00"
//         ],
//         [
//             "187.21",
//             "0.21"
//         ],
//         [
//             "187.30",
//             "50.00"
//         ],
//         [
//             "187.50",
//             "5.00"
//         ],
//         [
//             "187.72",
//             "1.06"
//         ],
//         [
//             "187.77",
//             "0.42"
//         ],
//         [
//             "187.90",
//             "0.20"
//         ],
//         [
//             "188.00",
//             "218.03"
//         ],
//         [
//             "188.50",
//             "3.00"
//         ],
//         [
//             "188.67",
//             "0.02"
//         ],
//         [
//             "188.80",
//             "3.00"
//         ],
//         [
//             "188.88",
//             "1.00"
//         ],
//         [
//             "188.90",
//             "0.20"
//         ],
//         [
//             "189.00",
//             "166.36"
//         ],
//         [
//             "189.40",
//             "40.00"
//         ],
//         [
//             "189.50",
//             "3.00"
//         ],
//         [
//             "189.70",
//             "10.00"
//         ],
//         [
//             "189.90",
//             "0.20"
//         ],
//         [
//             "190.00",
//             "204.76"
//         ],
//         [
//             "190.50",
//             "3.00"
//         ],
//         [
//             "190.90",
//             "0.20"
//         ],
//         [
//             "191.00",
//             "2.00"
//         ],
//         [
//             "191.47",
//             "1.04"
//         ],
//         [
//             "191.90",
//             "0.20"
//         ],
//         [
//             "192.00",
//             "1.86"
//         ],
//         [
//             "192.48",
//             "0.10"
//         ],
//         [
//             "192.90",
//             "0.20"
//         ],
//         [
//             "193.23",
//             "0.12"
//         ],
//         [
//             "193.70",
//             "10.00"
//         ],
//         [
//             "193.86",
//             "1.83"
//         ],
//         [
//             "193.90",
//             "0.20"
//         ],
//         [
//             "194.00",
//             "20.00"
//         ],
//         [
//             "194.90",
//             "0.20"
//         ],
//         [
//             "195.00",
//             "37.22"
//         ],
//         [
//             "195.30",
//             "1.02"
//         ],
//         [
//             "195.70",
//             "4.50"
//         ],
//         [
//             "195.90",
//             "0.20"
//         ],
//         [
//             "196.00",
//             "10.00"
//         ],
//         [
//             "196.38",
//             "0.11"
//         ],
//         [
//             "196.68",
//             "27.77"
//         ],
//         [
//             "196.90",
//             "0.20"
//         ],
//         [
//             "197.12",
//             "0.91"
//         ],
//         [
//             "197.70",
//             "10.00"
//         ],
//         [
//             "197.90",
//             "0.20"
//         ],
//         [
//             "198.00",
//             "7.51"
//         ],
//         [
//             "198.90",
//             "0.20"
//         ],
//         [
//             "199.00",
//             "276.22"
//         ],
//         [
//             "199.21",
//             "2.00"
//         ],
//         [
//             "199.50",
//             "10.00"
//         ],
//         [
//             "199.78",
//             "0.20"
//         ],
//         [
//             "199.90",
//             "0.20"
//         ],
//         [
//             "200.00",
//             "110.42"
//         ],
//         [
//             "200.90",
//             "0.20"
//         ],
//         [
//             "201.27",
//             "0.37"
//         ],
//         [
//             "201.30",
//             "2.00"
//         ],
//         [
//             "201.33",
//             "0.58"
//         ],
//         [
//             "201.68",
//             "0.65"
//         ],
//         [
//             "201.90",
//             "0.20"
//         ],
//         [
//             "202.90",
//             "0.20"
//         ],
//         [
//             "203.19",
//             "0.98"
//         ],
//         [
//             "203.90",
//             "0.20"
//         ],
//         [
//             "204.90",
//             "0.20"
//         ],
//         [
//             "204.91",
//             "4.13"
//         ],
//         [
//             "205.00",
//             "0.65"
//         ],
//         [
//             "205.38",
//             "0.51"
//         ],
//         [
//             "205.69",
//             "0.30"
//         ],
//         [
//             "205.90",
//             "0.20"
//         ],
//         [
//             "206.70",
//             "0.10"
//         ],
//         [
//             "206.90",
//             "0.20"
//         ],
//         [
//             "207.25",
//             "0.96"
//         ],
//         [
//             "207.90",
//             "0.20"
//         ],
//         [
//             "208.00",
//             "68.56"
//         ],
//         [
//             "208.29",
//             "0.46"
//         ],
//         [
//             "208.90",
//             "0.20"
//         ],
//         [
//             "209.00",
//             "68.13"
//         ],
//         [
//             "210.00",
//             "167.75"
//         ],
//         [
//             "211.40",
//             "0.94"
//         ],
//         [
//             "212.00",
//             "1.38"
//         ],
//         [
//             "215.64",
//             "0.92"
//         ],
//         [
//             "216.00",
//             "0.38"
//         ],
//         [
//             "216.62",
//             "0.09"
//         ],
//         [
//             "218.00",
//             "1.91"
//         ],
//         [
//             "218.18",
//             "0.11"
//         ],
//         [
//             "219.95",
//             "0.90"
//         ],
//         [
//             "220.00",
//             "144.78"
//         ],
//         [
//             "222.00",
//             "0.17"
//         ],
//         [
//             "230.00",
//             "133.22"
//         ],
//         [
//             "234.20",
//             "0.74"
//         ],
//         [
//             "235.00",
//             "1.21"
//         ],
//         [
//             "237.00",
//             "0.20"
//         ],
//         [
//             "239.06",
//             "3.48"
//         ],
//         [
//             "240.00",
//             "78.14"
//         ],
//         [
//             "243.21",
//             "5.95"
//         ],
//         [
//             "246.00",
//             "0.07"
//         ],
//         [
//             "250.00",
//             "73.97"
//         ],
//         [
//             "253.33",
//             "30.00"
//         ],
//         [
//             "253.80",
//             "0.36"
//         ],
//         [
//             "255.00",
//             "0.40"
//         ],
//         [
//             "257.00",
//             "0.30"
//         ],
//         [
//             "258.80",
//             "0.75"
//         ],
//         [
//             "259.00",
//             "0.50"
//         ],
//         [
//             "260.00",
//             "65.18"
//         ],
//         [
//             "264.00",
//             "2.00"
//         ],
//         [
//             "265.00",
//             "0.20"
//         ],
//         [
//             "266.00",
//             "1.49"
//         ],
//         [
//             "268.00",
//             "1.25"
//         ],
//         [
//             "269.00",
//             "0.51"
//         ],
//         [
//             "270.00",
//             "57.48"
//         ],
//         [
//             "270.89",
//             "1.03"
//         ],
//         [
//             "271.00",
//             "1.00"
//         ],
//         [
//             "272.00",
//             "5.00"
//         ],
//         [
//             "274.00",
//             "1.25"
//         ],
//         [
//             "280.00",
//             "4.47"
//         ],
//         [
//             "282.00",
//             "0.29"
//         ],
//         [
//             "285.00",
//             "0.30"
//         ],
//         [
//             "287.00",
//             "1.74"
//         ],
//         [
//             "289.89",
//             "0.20"
//         ],
//         [
//             "290.00",
//             "23.36"
//         ],
//         [
//             "290.20",
//             "1.81"
//         ],
//         [
//             "290.33",
//             "10.00"
//         ],
//         [
//             "291.00",
//             "10.00"
//         ],
//         [
//             "292.82",
//             "3.35"
//         ],
//         [
//             "294.00",
//             "2.00"
//         ],
//         [
//             "294.36",
//             "0.20"
//         ],
//         [
//             "295.00",
//             "4.93"
//         ],
//         [
//             "296.00",
//             "1.24"
//         ],
//         [
//             "296.69",
//             "0.14"
//         ],
//         [
//             "297.00",
//             "0.01"
//         ],
//         [
//             "298.00",
//             "4.04"
//         ],
//         [
//             "298.69",
//             "0.45"
//         ],
//         [
//             "298.88",
//             "0.50"
//         ],
//         [
//             "299.00",
//             "11.00"
//         ],
//         [
//             "300.00",
//             "17.14"
//         ],
//         [
//             "300.33",
//             "10.00"
//         ],
//         [
//             "302.00",
//             "0.78"
//         ],
//         [
//             "302.10",
//             "0.10"
//         ],
//         [
//             "303.88",
//             "0.50"
//         ],
//         [
//             "308.88",
//             "0.50"
//         ],
//         [
//             "310.33",
//             "10.00"
//         ],
//         [
//             "313.88",
//             "0.50"
//         ],
//         [
//             "314.36",
//             "0.50"
//         ],
//         [
//             "316.69",
//             "0.10"
//         ],
//         [
//             "318.00",
//             "0.50"
//         ],
//         [
//             "318.88",
//             "0.50"
//         ],
//         [
//             "320.00",
//             "2.02"
//         ],
//         [
//             "322.00",
//             "0.01"
//         ],
//         [
//             "323.88",
//             "0.50"
//         ],
//         [
//             "326.00",
//             "0.42"
//         ],
//         [
//             "326.91",
//             "0.49"
//         ],
//         [
//             "328.88",
//             "0.50"
//         ],
//         [
//             "329.03",
//             "0.30"
//         ],
//         [
//             "330.00",
//             "4.20"
//         ],
//         [
//             "332.00",
//             "0.12"
//         ],
//         [
//             "333.00",
//             "0.01"
//         ],
//         [
//             "333.62",
//             "1.85"
//         ],
//         [
//             "333.88",
//             "0.50"
//         ],
//         [
//             "336.69",
//             "0.10"
//         ],
//         [
//             "338.88",
//             "0.50"
//         ],
//         [
//             "339.00",
//             "0.45"
//         ],
//         [
//             "342.00",
//             "1.17"
//         ],
//         [
//             "343.88",
//             "0.50"
//         ],
//         [
//             "344.36",
//             "0.50"
//         ],
//         [
//             "346.17",
//             "0.35"
//         ],
//         [
//             "348.88",
//             "0.50"
//         ],
//         [
//             "349.00",
//             "2.62"
//         ],
//         [
//             "350.00",
//             "1.65"
//         ],
//         [
//             "353.88",
//             "0.50"
//         ],
//         [
//             "358.88",
//             "0.50"
//         ],
//         [
//             "363.88",
//             "0.50"
//         ],
//         [
//             "364.36",
//             "0.32"
//         ],
//         [
//             "366.00",
//             "0.06"
//         ],
//         [
//             "368.88",
//             "0.50"
//         ],
//         [
//             "373.88",
//             "0.50"
//         ],
//         [
//             "378.88",
//             "0.50"
//         ],
//         [
//             "380.00",
//             "3.55"
//         ],
//         [
//             "383.88",
//             "0.50"
//         ],
//         [
//             "388.88",
//             "0.50"
//         ],
//         [
//             "389.27",
//             "1.73"
//         ],
//         [
//             "392.90",
//             "0.90"
//         ],
//         [
//             "393.88",
//             "0.50"
//         ],
//         [
//             "397.00",
//             "0.01"
//         ],
//         [
//             "398.88",
//             "0.50"
//         ],
//         [
//             "400.00",
//             "2.01"
//         ],
//         [
//             "400.70",
//             "0.05"
//         ],
//         [
//             "403.88",
//             "0.50"
//         ],
//         [
//             "408.88",
//             "0.50"
//         ],
//         [
//             "413.88",
//             "0.50"
//         ],
//         [
//             "418.88",
//             "0.50"
//         ],
//         [
//             "423.88",
//             "0.50"
//         ],
//         [
//             "428.88",
//             "0.50"
//         ],
//         [
//             "433.88",
//             "0.50"
//         ],
//         [
//             "438.88",
//             "0.50"
//         ],
//         [
//             "440.00",
//             "0.39"
//         ],
//         [
//             "443.88",
//             "0.50"
//         ],
//         [
//             "444.28",
//             "1.98"
//         ],
//         [
//             "448.88",
//             "0.50"
//         ],
//         [
//             "453.88",
//             "0.50"
//         ],
//         [
//             "458.88",
//             "0.50"
//         ],
//         [
//             "463.88",
//             "0.50"
//         ],
//         [
//             "489.33",
//             "2.08"
//         ],
//         [
//             "490.00",
//             "0.71"
//         ],
//         [
//             "497.00",
//             "0.01"
//         ],
//         [
//             "499.99",
//             "2.83"
//         ],
//         [
//             "500.00",
//             "2.06"
//         ],
//         [
//             "543.03",
//             "3.38"
//         ],
//         [
//             "576.20",
//             "0.02"
//         ],
//         [
//             "599.03",
//             "4.98"
//         ],
//         [
//             "600.00",
//             "10.00"
//         ],
//         [
//             "629.00",
//             "3.40"
//         ],
//         [
//             "649.00",
//             "2.80"
//         ],
//         [
//             "686.00",
//             "0.73"
//         ],
//         [
//             "689.00",
//             "3.75"
//         ],
//         [
//             "700.70",
//             "0.04"
//         ],
//         [
//             "800.00",
//             "0.03"
//         ],
//         [
//             "988.07",
//             "0.25"
//         ],
//         [
//             "990.00",
//             "0.30"
//         ],
//         [
//             "999.00",
//             "4.23"
//         ],
//         [
//             "1000.00",
//             "11.09"
//         ],
//         [
//             "1010.17",
//             "3.03"
//         ],
//         [
//             "1300.00",
//             "0.29"
//         ],
//         [
//             "1466.50",
//             "0.12"
//         ],
//         [
//             "1982.00",
//             "0.92"
//         ],
//         [
//             "16010.00",
//             "0.19"
//         ],
//         [
//             "16228.00",
//             "0.38"
//         ],
//         [
//             "33333.00",
//             "0.05"
//         ],
//         [
//             "186685.00",
//             "0.01"
//         ]
//     ],
//     "bids": [
//         [
//             "0.01",
//             "4.17"
//         ],
//         [
//             "0.02",
//             "2205.93"
//         ],
//         [
//             "0.03",
//             "30.71"
//         ],
//         [
//             "0.06",
//             "1.14"
//         ],
//         [
//             "0.10",
//             "271.78"
//         ],
//         [
//             "0.12",
//             "0.25"
//         ],
//         [
//             "0.23",
//             "1.02"
//         ],
//         [
//             "0.25",
//             "2.18"
//         ],
//         [
//             "0.30",
//             "1.07"
//         ],
//         [
//             "0.39",
//             "1.02"
//         ],
//         [
//             "0.43",
//             "1.02"
//         ],
//         [
//             "0.49",
//             "0.11"
//         ],
//         [
//             "0.50",
//             "0.01"
//         ],
//         [
//             "0.53",
//             "1.01"
//         ],
//         [
//             "0.60",
//             "2.79"
//         ],
//         [
//             "0.64",
//             "1.00"
//         ],
//         [
//             "0.65",
//             "3.01"
//         ],
//         [
//             "0.68",
//             "0.90"
//         ],
//         [
//             "0.72",
//             "1.01"
//         ],
//         [
//             "0.75",
//             "108.50"
//         ],
//         [
//             "0.78",
//             "2.01"
//         ],
//         [
//             "0.79",
//             "66.49"
//         ],
//         [
//             "0.80",
//             "1.00"
//         ],
//         [
//             "0.82",
//             "1.00"
//         ],
//         [
//             "0.92",
//             "1.00"
//         ],
//         [
//             "1.00",
//             "13.09"
//         ],
//         [
//             "1.11",
//             "1.00"
//         ],
//         [
//             "1.19",
//             "0.99"
//         ],
//         [
//             "1.28",
//             "1.02"
//         ],
//         [
//             "1.35",
//             "1.00"
//         ],
//         [
//             "1.40",
//             "1.03"
//         ],
//         [
//             "1.42",
//             "1.00"
//         ],
//         [
//             "1.48",
//             "1.00"
//         ],
//         [
//             "1.50",
//             "1.27"
//         ],
//         [
//             "1.55",
//             "1.00"
//         ],
//         [
//             "1.59",
//             "1.00"
//         ],
//         [
//             "1.60",
//             "1.00"
//         ],
//         [
//             "1.70",
//             "0.99"
//         ],
//         [
//             "1.71",
//             "1.00"
//         ],
//         [
//             "1.75",
//             "2.01"
//         ],
//         [
//             "1.78",
//             "1.98"
//         ],
//         [
//             "1.80",
//             "1.00"
//         ],
//         [
//             "1.82",
//             "0.01"
//         ],
//         [
//             "1.84",
//             "0.01"
//         ],
//         [
//             "1.90",
//             "0.01"
//         ],
//         [
//             "1.96",
//             "0.01"
//         ],
//         [
//             "2.00",
//             "4.28"
//         ],
//         [
//             "2.26",
//             "1.00"
//         ],
//         [
//             "2.56",
//             "1.00"
//         ],
//         [
//             "2.80",
//             "1.01"
//         ],
//         [
//             "2.85",
//             "1.00"
//         ],
//         [
//             "4.00",
//             "1.00"
//         ],
//         [
//             "5.00",
//             "3.93"
//         ],
//         [
//             "6.00",
//             "1.05"
//         ],
//         [
//             "7.00",
//             "0.34"
//         ],
//         [
//             "7.90",
//             "1.00"
//         ],
//         [
//             "8.72",
//             "0.25"
//         ],
//         [
//             "10.00",
//             "2.16"
//         ],
//         [
//             "10.17",
//             "1.00"
//         ],
//         [
//             "14.00",
//             "1.06"
//         ],
//         [
//             "15.00",
//             "1.01"
//         ],
//         [
//             "18.13",
//             "0.10"
//         ],
//         [
//             "18.98",
//             "0.04"
//         ],
//         [
//             "20.00",
//             "0.10"
//         ],
//         [
//             "22.00",
//             "0.16"
//         ],
//         [
//             "25.00",
//             "0.06"
//         ],
//         [
//             "30.00",
//             "0.32"
//         ],
//         [
//             "36.99",
//             "0.34"
//         ],
//         [
//             "40.00",
//             "0.05"
//         ],
//         [
//             "45.00",
//             "1.00"
//         ],
//         [
//             "48.00",
//             "0.02"
//         ],
//         [
//             "50.00",
//             "0.12"
//         ],
//         [
//             "51.00",
//             "0.01"
//         ],
//         [
//             "54.42",
//             "0.26"
//         ],
//         [
//             "60.00",
//             "22.92"
//         ],
//         [
//             "68.00",
//             "1.13"
//         ],
//         [
//             "68.47",
//             "0.37"
//         ],
//         [
//             "71.00",
//             "1.50"
//         ],
//         [
//             "71.88",
//             "0.37"
//         ],
//         [
//             "75.10",
//             "0.01"
//         ],
//         [
//             "78.42",
//             "0.40"
//         ],
//         [
//             "80.00",
//             "3.69"
//         ],
//         [
//             "80.01",
//             "0.01"
//         ],
//         [
//             "81.00",
//             "18.73"
//         ],
//         [
//             "82.00",
//             "3.53"
//         ],
//         [
//             "85.00",
//             "3.29"
//         ],
//         [
//             "85.68",
//             "1.76"
//         ],
//         [
//             "86.46",
//             "0.03"
//         ],
//         [
//             "87.00",
//             "3.20"
//         ],
//         [
//             "88.00",
//             "1.50"
//         ],
//         [
//             "89.00",
//             "0.51"
//         ],
//         [
//             "90.00",
//             "35.83"
//         ],
//         [
//             "90.01",
//             "0.01"
//         ],
//         [
//             "91.00",
//             "0.73"
//         ],
//         [
//             "92.00",
//             "0.21"
//         ],
//         [
//             "94.00",
//             "2.42"
//         ],
//         [
//             "94.50",
//             "0.59"
//         ],
//         [
//             "95.00",
//             "4.28"
//         ],
//         [
//             "98.00",
//             "0.10"
//         ],
//         [
//             "99.00",
//             "0.10"
//         ],
//         [
//             "99.50",
//             "0.10"
//         ],
//         [
//             "100.00",
//             "1.15"
//         ],
//         [
//             "100.70",
//             "1.98"
//         ],
//         [
//             "102.75",
//             "1.94"
//         ],
//         [
//             "104.85",
//             "1.90"
//         ],
//         [
//             "105.00",
//             "14.10"
//         ],
//         [
//             "106.99",
//             "1.86"
//         ],
//         [
//             "107.00",
//             "37.50"
//         ],
//         [
//             "109.17",
//             "1.83"
//         ],
//         [
//             "109.70",
//             "17.00"
//         ],
//         [
//             "110.00",
//             "0.90"
//         ],
//         [
//             "111.40",
//             "1.79"
//         ],
//         [
//             "112.12",
//             "1.00"
//         ],
//         [
//             "112.50",
//             "1.00"
//         ],
//         [
//             "113.67",
//             "1.75"
//         ],
//         [
//             "113.75",
//             "1.00"
//         ],
//         [
//             "114.03",
//             "0.10"
//         ],
//         [
//             "114.54",
//             "0.16"
//         ],
//         [
//             "114.60",
//             "0.10"
//         ],
//         [
//             "115.00",
//             "3.58"
//         ],
//         [
//             "115.18",
//             "0.10"
//         ],
//         [
//             "115.58",
//             "1.73"
//         ],
//         [
//             "115.75",
//             "0.10"
//         ],
//         [
//             "116.25",
//             "1.00"
//         ],
//         [
//             "116.33",
//             "0.10"
//         ],
//         [
//             "116.91",
//             "0.10"
//         ],
//         [
//             "117.50",
//             "1.10"
//         ],
//         [
//             "117.77",
//             "0.16"
//         ],
//         [
//             "117.94",
//             "1.69"
//         ],
//         [
//             "118.00",
//             "0.54"
//         ],
//         [
//             "118.08",
//             "0.10"
//         ],
//         [
//             "118.68",
//             "0.10"
//         ],
//         [
//             "118.75",
//             "1.00"
//         ],
//         [
//             "118.81",
//             "0.16"
//         ],
//         [
//             "118.88",
//             "0.16"
//         ],
//         [
//             "119.00",
//             "1.77"
//         ],
//         [
//             "119.15",
//             "0.16"
//         ],
//         [
//             "119.27",
//             "0.10"
//         ],
//         [
//             "119.73",
//             "1.00"
//         ],
//         [
//             "119.86",
//             "0.10"
//         ],
//         [
//             "119.89",
//             "0.25"
//         ],
//         [
//             "120.00",
//             "10.25"
//         ],
//         [
//             "120.35",
//             "1.66"
//         ],
//         [
//             "120.46",
//             "0.10"
//         ],
//         [
//             "121.00",
//             "0.50"
//         ],
//         [
//             "121.07",
//             "0.10"
//         ],
//         [
//             "121.18",
//             "0.09"
//         ],
//         [
//             "121.25",
//             "1.00"
//         ],
//         [
//             "121.50",
//             "0.50"
//         ],
//         [
//             "121.67",
//             "0.10"
//         ],
//         [
//             "122.00",
//             "0.50"
//         ],
//         [
//             "122.28",
//             "0.10"
//         ],
//         [
//             "122.50",
//             "1.50"
//         ],
//         [
//             "122.81",
//             "1.62"
//         ],
//         [
//             "122.89",
//             "0.10"
//         ],
//         [
//             "122.99",
//             "0.71"
//         ],
//         [
//             "123.00",
//             "0.50"
//         ],
//         [
//             "123.50",
//             "10.98"
//         ],
//         [
//             "123.51",
//             "0.10"
//         ],
//         [
//             "123.75",
//             "1.00"
//         ],
//         [
//             "124.12",
//             "0.10"
//         ],
//         [
//             "124.31",
//             "0.10"
//         ],
//         [
//             "124.54",
//             "0.33"
//         ],
//         [
//             "124.74",
//             "0.10"
//         ],
//         [
//             "125.00",
//             "2.48"
//         ],
//         [
//             "125.20",
//             "1.29"
//         ],
//         [
//             "125.32",
//             "1.59"
//         ],
//         [
//             "125.37",
//             "0.10"
//         ],
//         [
//             "125.50",
//             "2.01"
//         ],
//         [
//             "126.00",
//             "1.08"
//         ],
//         [
//             "126.25",
//             "1.00"
//         ],
//         [
//             "126.50",
//             "0.98"
//         ],
//         [
//             "126.63",
//             "0.10"
//         ],
//         [
//             "127.00",
//             "0.98"
//         ],
//         [
//             "127.26",
//             "0.10"
//         ],
//         [
//             "127.50",
//             "1.00"
//         ],
//         [
//             "127.88",
//             "1.56"
//         ],
//         [
//             "127.89",
//             "0.10"
//         ],
//         [
//             "128.00",
//             "1.80"
//         ],
//         [
//             "128.40",
//             "4.90"
//         ],
//         [
//             "128.53",
//             "0.10"
//         ],
//         [
//             "128.75",
//             "1.00"
//         ],
//         [
//             "129.08",
//             "0.76"
//         ],
//         [
//             "129.17",
//             "0.11"
//         ],
//         [
//             "129.18",
//             "0.10"
//         ],
//         [
//             "129.73",
//             "1.00"
//         ],
//         [
//             "129.82",
//             "0.10"
//         ],
//         [
//             "130.00",
//             "89.36"
//         ],
//         [
//             "130.47",
//             "0.10"
//         ],
//         [
//             "130.49",
//             "1.53"
//         ],
//         [
//             "131.00",
//             "5.14"
//         ],
//         [
//             "131.12",
//             "0.10"
//         ],
//         [
//             "131.25",
//             "1.00"
//         ],
//         [
//             "131.78",
//             "0.10"
//         ],
//         [
//             "132.00",
//             "0.50"
//         ],
//         [
//             "132.44",
//             "0.10"
//         ],
//         [
//             "132.50",
//             "1.00"
//         ],
//         [
//             "133.00",
//             "1.00"
//         ],
//         [
//             "133.10",
//             "0.10"
//         ],
//         [
//             "133.15",
//             "1.50"
//         ],
//         [
//             "133.33",
//             "0.52"
//         ],
//         [
//             "133.75",
//             "1.00"
//         ],
//         [
//             "133.77",
//             "0.10"
//         ],
//         [
//             "134.00",
//             "0.08"
//         ],
//         [
//             "134.44",
//             "0.10"
//         ],
//         [
//             "135.00",
//             "6.00"
//         ],
//         [
//             "135.11",
//             "0.10"
//         ],
//         [
//             "135.49",
//             "0.05"
//         ],
//         [
//             "135.78",
//             "0.10"
//         ],
//         [
//             "135.87",
//             "1.47"
//         ],
//         [
//             "136.00",
//             "0.02"
//         ],
//         [
//             "136.25",
//             "1.00"
//         ],
//         [
//             "136.46",
//             "0.10"
//         ],
//         [
//             "136.66",
//             "0.50"
//         ],
//         [
//             "136.98",
//             "0.05"
//         ],
//         [
//             "137.14",
//             "0.10"
//         ],
//         [
//             "137.50",
//             "1.00"
//         ],
//         [
//             "137.83",
//             "0.10"
//         ],
//         [
//             "138.00",
//             "0.50"
//         ],
//         [
//             "138.47",
//             "0.05"
//         ],
//         [
//             "138.64",
//             "1.44"
//         ],
//         [
//             "138.75",
//             "1.00"
//         ],
//         [
//             "138.88",
//             "0.80"
//         ],
//         [
//             "139.11",
//             "0.07"
//         ],
//         [
//             "139.41",
//             "1.00"
//         ],
//         [
//             "139.50",
//             "0.48"
//         ],
//         [
//             "139.73",
//             "1.00"
//         ],
//         [
//             "140.00",
//             "9.13"
//         ],
//         [
//             "140.60",
//             "3.84"
//         ],
//         [
//             "141.00",
//             "11.27"
//         ],
//         [
//             "141.25",
//             "1.00"
//         ],
//         [
//             "141.26",
//             "0.05"
//         ],
//         [
//             "141.40",
//             "0.71"
//         ],
//         [
//             "141.47",
//             "1.41"
//         ],
//         [
//             "141.89",
//             "0.07"
//         ],
//         [
//             "142.50",
//             "1.00"
//         ],
//         [
//             "143.00",
//             "1.33"
//         ],
//         [
//             "143.32",
//             "0.04"
//         ],
//         [
//             "143.35",
//             "0.10"
//         ],
//         [
//             "143.36",
//             "0.04"
//         ],
//         [
//             "143.39",
//             "0.10"
//         ],
//         [
//             "143.40",
//             "0.05"
//         ],
//         [
//             "143.75",
//             "1.00"
//         ],
//         [
//             "144.36",
//             "1.39"
//         ],
//         [
//             "144.73",
//             "0.07"
//         ],
//         [
//             "145.00",
//             "8.00"
//         ],
//         [
//             "145.10",
//             "0.08"
//         ],
//         [
//             "146.00",
//             "0.20"
//         ],
//         [
//             "146.25",
//             "1.00"
//         ],
//         [
//             "146.30",
//             "5.00"
//         ],
//         [
//             "146.66",
//             "0.81"
//         ],
//         [
//             "147.00",
//             "0.61"
//         ],
//         [
//             "147.08",
//             "0.42"
//         ],
//         [
//             "147.31",
//             "1.36"
//         ],
//         [
//             "147.62",
//             "0.06"
//         ],
//         [
//             "148.22",
//             "1.77"
//         ],
//         [
//             "148.75",
//             "1.00"
//         ],
//         [
//             "149.00",
//             "8.78"
//         ],
//         [
//             "150.00",
//             "18.63"
//         ],
//         [
//             "150.04",
//             "0.51"
//         ],
//         [
//             "150.10",
//             "0.10"
//         ],
//         [
//             "150.30",
//             "5.00"
//         ],
//         [
//             "150.31",
//             "1.33"
//         ],
//         [
//             "150.47",
//             "0.18"
//         ],
//         [
//             "150.57",
//             "0.06"
//         ],
//         [
//             "151.00",
//             "0.63"
//         ],
//         [
//             "151.25",
//             "1.00"
//         ],
//         [
//             "152.00",
//             "3.52"
//         ],
//         [
//             "152.12",
//             "10.00"
//         ],
//         [
//             "152.15",
//             "0.32"
//         ],
//         [
//             "152.69",
//             "11.41"
//         ],
//         [
//             "152.87",
//             "1.32"
//         ],
//         [
//             "153.00",
//             "0.03"
//         ],
//         [
//             "153.33",
//             "0.14"
//         ],
//         [
//             "153.38",
//             "1.30"
//         ],
//         [
//             "153.55",
//             "0.79"
//         ],
//         [
//             "153.58",
//             "0.06"
//         ],
//         [
//             "153.72",
//             "1.03"
//         ],
//         [
//             "154.00",
//             "0.03"
//         ],
//         [
//             "154.19",
//             "0.18"
//         ],
//         [
//             "154.23",
//             "10.00"
//         ],
//         [
//             "154.30",
//             "5.00"
//         ],
//         [
//             "154.44",
//             "0.07"
//         ],
//         [
//             "154.55",
//             "1.00"
//         ],
//         [
//             "155.00",
//             "5.61"
//         ],
//         [
//             "155.10",
//             "0.10"
//         ],
//         [
//             "155.40",
//             "0.28"
//         ],
//         [
//             "156.00",
//             "81.03"
//         ],
//         [
//             "156.23",
//             "10.00"
//         ],
//         [
//             "156.51",
//             "1.28"
//         ],
//         [
//             "156.56",
//             "1.00"
//         ],
//         [
//             "156.65",
//             "0.06"
//         ],
//         [
//             "156.90",
//             "0.50"
//         ],
//         [
//             "157.00",
//             "0.03"
//         ],
//         [
//             "157.13",
//             "4.45"
//         ],
//         [
//             "157.30",
//             "5.00"
//         ],
//         [
//             "157.51",
//             "0.98"
//         ],
//         [
//             "157.90",
//             "0.17"
//         ],
//         [
//             "158.00",
//             "0.03"
//         ],
//         [
//             "158.09",
//             "0.53"
//         ],
//         [
//             "158.34",
//             "0.03"
//         ],
//         [
//             "158.76",
//             "0.15"
//         ],
//         [
//             "159.00",
//             "11.26"
//         ],
//         [
//             "159.25",
//             "0.10"
//         ],
//         [
//             "159.50",
//             "0.26"
//         ],
//         [
//             "159.70",
//             "6.25"
//         ],
//         [
//             "159.73",
//             "0.05"
//         ],
//         [
//             "159.78",
//             "0.06"
//         ],
//         [
//             "160.00",
//             "27.16"
//         ],
//         [
//             "160.39",
//             "10.00"
//         ],
//         [
//             "160.64",
//             "0.15"
//         ],
//         [
//             "160.70",
//             "685.00"
//         ],
//         [
//             "160.98",
//             "30.00"
//         ],
//         [
//             "160.99",
//             "0.59"
//         ],
//         [
//             "161.00",
//             "10.00"
//         ],
//         [
//             "161.05",
//             "0.07"
//         ],
//         [
//             "161.09",
//             "0.09"
//         ],
//         [
//             "161.12",
//             "0.01"
//         ],
//         [
//             "161.17",
//             "0.48"
//         ],
//         [
//             "161.62",
//             "0.17"
//         ],
//         [
//             "161.64",
//             "0.15"
//         ],
//         [
//             "161.77",
//             "0.09"
//         ],
//         [
//             "162.00",
//             "110.50"
//         ],
//         [
//             "162.16",
//             "0.73"
//         ],
//         [
//             "162.22",
//             "0.50"
//         ],
//         [
//             "162.25",
//             "0.15"
//         ],
//         [
//             "162.30",
//             "5.00"
//         ],
//         [
//             "162.45",
//             "0.09"
//         ],
//         [
//             "162.51",
//             "0.02"
//         ],
//         [
//             "162.65",
//             "0.50"
//         ],
//         [
//             "162.96",
//             "1.22"
//         ],
//         [
//             "162.98",
//             "0.06"
//         ],
//         [
//             "163.00",
//             "13.15"
//         ],
//         [
//             "163.10",
//             "0.50"
//         ],
//         [
//             "163.13",
//             "0.09"
//         ],
//         [
//             "163.24",
//             "0.10"
//         ],
//         [
//             "163.41",
//             "0.50"
//         ],
//         [
//             "163.61",
//             "0.50"
//         ],
//         [
//             "163.80",
//             "0.09"
//         ],
//         [
//             "163.83",
//             "0.15"
//         ],
//         [
//             "163.90",
//             "0.01"
//         ],
//         [
//             "164.00",
//             "16.85"
//         ],
//         [
//             "164.02",
//             "1.10"
//         ],
//         [
//             "164.18",
//             "0.50"
//         ],
//         [
//             "164.25",
//             "0.42"
//         ],
//         [
//             "164.40",
//             "0.15"
//         ],
//         [
//             "164.48",
//             "0.09"
//         ],
//         [
//             "164.50",
//             "0.58"
//         ],
//         [
//             "164.54",
//             "0.50"
//         ],
//         [
//             "164.55",
//             "0.15"
//         ],
//         [
//             "164.73",
//             "0.50"
//         ],
//         [
//             "164.91",
//             "1.10"
//         ],
//         [
//             "165.00",
//             "5.88"
//         ],
//         [
//             "165.07",
//             "0.50"
//         ],
//         [
//             "165.16",
//             "0.09"
//         ],
//         [
//             "165.21",
//             "1.74"
//         ],
//         [
//             "165.25",
//             "0.50"
//         ],
//         [
//             "165.29",
//             "0.02"
//         ],
//         [
//             "165.33",
//             "0.16"
//         ],
//         [
//             "165.41",
//             "2.00"
//         ],
//         [
//             "165.49",
//             "0.10"
//         ],
//         [
//             "165.51",
//             "0.50"
//         ],
//         [
//             "165.66",
//             "42.26"
//         ],
//         [
//             "165.71",
//             "0.06"
//         ],
//         [
//             "165.75",
//             "1.00"
//         ],
//         [
//             "165.79",
//             "1.10"
//         ],
//         [
//             "165.84",
//             "0.08"
//         ],
//         [
//             "165.87",
//             "15.07"
//         ],
//         [
//             "165.97",
//             "0.50"
//         ],
//         [
//             "166.00",
//             "0.30"
//         ],
//         [
//             "166.13",
//             "0.50"
//         ],
//         [
//             "166.29",
//             "1.20"
//         ],
//         [
//             "166.52",
//             "0.06"
//         ],
//         [
//             "166.60",
//             "12.38"
//         ],
//         [
//             "166.67",
//             "5.10"
//         ],
//         [
//             "166.68",
//             "0.02"
//         ],
//         [
//             "166.75",
//             "0.50"
//         ],
//         [
//             "166.81",
//             "0.55"
//         ],
//         [
//             "167.00",
//             "0.20"
//         ],
//         [
//             "167.17",
//             "0.50"
//         ],
//         [
//             "167.20",
//             "0.05"
//         ],
//         [
//             "167.33",
//             "0.38"
//         ],
//         [
//             "167.40",
//             "0.50"
//         ],
//         [
//             "167.51",
//             "1.85"
//         ],
//         [
//             "167.55",
//             "1.10"
//         ],
//         [
//             "167.59",
//             "1.00"
//         ],
//         [
//             "167.68",
//             "0.54"
//         ],
//         [
//             "167.87",
//             "0.05"
//         ],
//         [
//             "167.96",
//             "0.50"
//         ],
//         [
//             "168.00",
//             "1.26"
//         ],
//         [
//             "168.06",
//             "0.02"
//         ],
//         [
//             "168.26",
//             "0.50"
//         ],
//         [
//             "168.33",
//             "2.00"
//         ],
//         [
//             "168.40",
//             "0.04"
//         ],
//         [
//             "168.43",
//             "1.10"
//         ],
//         [
//             "168.55",
//             "0.07"
//         ],
//         [
//             "168.81",
//             "0.50"
//         ],
//         [
//             "169.00",
//             "5.12"
//         ],
//         [
//             "169.05",
//             "0.16"
//         ],
//         [
//             "169.16",
//             "0.50"
//         ],
//         [
//             "169.23",
//             "0.06"
//         ],
//         [
//             "169.31",
//             "3.00"
//         ],
//         [
//             "169.32",
//             "1.10"
//         ],
//         [
//             "169.34",
//             "0.50"
//         ],
//         [
//             "169.45",
//             "0.02"
//         ],
//         [
//             "169.49",
//             "0.36"
//         ],
//         [
//             "169.53",
//             "0.27"
//         ],
//         [
//             "169.56",
//             "0.05"
//         ],
//         [
//             "169.57",
//             "0.50"
//         ],
//         [
//             "169.68",
//             "1.42"
//         ],
//         [
//             "169.74",
//             "0.50"
//         ],
//         [
//             "169.83",
//             "0.58"
//         ],
//         [
//             "169.91",
//             "0.05"
//         ],
//         [
//             "169.98",
//             "0.50"
//         ],
//         [
//             "170.00",
//             "50.57"
//         ],
//         [
//             "170.04",
//             "0.08"
//         ],
//         [
//             "170.20",
//             "57.50"
//         ],
//         [
//             "170.38",
//             "50.00"
//         ],
//         [
//             "170.41",
//             "0.34"
//         ],
//         [
//             "170.48",
//             "50.00"
//         ],
//         [
//             "170.50",
//             "0.08"
//         ],
//         [
//             "170.59",
//             "0.08"
//         ],
//         [
//             "170.60",
//             "0.50"
//         ],
//         [
//             "170.84",
//             "0.04"
//         ],
//         [
//             "170.85",
//             "0.50"
//         ],
//         [
//             "170.89",
//             "0.92"
//         ],
//         [
//             "170.91",
//             "0.06"
//         ],
//         [
//             "171.00",
//             "5.17"
//         ],
//         [
//             "171.03",
//             "2.97"
//         ],
//         [
//             "171.04",
//             "1.00"
//         ],
//         [
//             "171.06",
//             "0.50"
//         ],
//         [
//             "171.08",
//             "1.10"
//         ],
//         [
//             "171.11",
//             "0.26"
//         ],
//         [
//             "171.27",
//             "0.09"
//         ],
//         [
//             "171.40",
//             "0.50"
//         ],
//         [
//             "171.46",
//             "0.41"
//         ],
//         [
//             "171.49",
//             "0.66"
//         ],
//         [
//             "171.55",
//             "0.10"
//         ],
//         [
//             "171.65",
//             "0.08"
//         ],
//         [
//             "171.67",
//             "2.00"
//         ],
//         [
//             "171.68",
//             "0.21"
//         ],
//         [
//             "171.84",
//             "0.06"
//         ],
//         [
//             "171.94",
//             "0.05"
//         ],
//         [
//             "171.95",
//             "0.50"
//         ],
//         [
//             "171.96",
//             "1.10"
//         ],
//         [
//             "172.00",
//             "8.02"
//         ],
//         [
//             "172.14",
//             "0.21"
//         ],
//         [
//             "172.17",
//             "0.50"
//         ],
//         [
//             "172.18",
//             "0.08"
//         ],
//         [
//             "172.23",
//             "0.10"
//         ],
//         [
//             "172.34",
//             "0.03"
//         ],
//         [
//             "172.50",
//             "0.50"
//         ],
//         [
//             "172.51",
//             "0.27"
//         ],
//         [
//             "172.61",
//             "0.03"
//         ],
//         [
//             "172.62",
//             "0.07"
//         ],
//         [
//             "172.67",
//             "0.07"
//         ],
//         [
//             "172.69",
//             "0.50"
//         ],
//         [
//             "172.72",
//             "0.22"
//         ],
//         [
//             "172.76",
//             "0.16"
//         ],
//         [
//             "172.78",
//             "0.01"
//         ],
//         [
//             "172.84",
//             "1.10"
//         ],
//         [
//             "172.87",
//             "0.22"
//         ],
//         [
//             "172.91",
//             "0.60"
//         ],
//         [
//             "172.92",
//             "0.01"
//         ],
//         [
//             "172.95",
//             "0.05"
//         ],
//         [
//             "172.97",
//             "0.10"
//         ],
//         [
//             "173.00",
//             "25.30"
//         ],
//         [
//             "173.09",
//             "0.50"
//         ],
//         [
//             "173.10",
//             "0.08"
//         ],
//         [
//             "173.15",
//             "1.74"
//         ],
//         [
//             "173.23",
//             "0.21"
//         ],
//         [
//             "173.26",
//             "0.16"
//         ],
//         [
//             "173.27",
//             "0.21"
//         ],
//         [
//             "173.28",
//             "0.03"
//         ],
//         [
//             "173.36",
//             "0.50"
//         ],
//         [
//             "173.39",
//             "0.08"
//         ],
//         [
//             "173.44",
//             "0.06"
//         ],
//         [
//             "173.45",
//             "2.21"
//         ],
//         [
//             "173.49",
//             "0.30"
//         ],
//         [
//             "173.52",
//             "2.21"
//         ],
//         [
//             "173.53",
//             "0.18"
//         ],
//         [
//             "173.59",
//             "0.21"
//         ],
//         [
//             "173.62",
//             "0.08"
//         ],
//         [
//             "173.64",
//             "0.09"
//         ],
//         [
//             "173.68",
//             "0.30"
//         ],
//         [
//             "173.70",
//             "0.03"
//         ],
//         [
//             "173.72",
//             "1.10"
//         ],
//         [
//             "173.76",
//             "0.04"
//         ],
//         [
//             "173.79",
//             "1.00"
//         ],
//         [
//             "173.81",
//             "0.04"
//         ],
//         [
//             "173.86",
//             "0.13"
//         ],
//         [
//             "173.87",
//             "0.11"
//         ],
//         [
//             "173.91",
//             "0.02"
//         ],
//         [
//             "173.92",
//             "0.50"
//         ],
//         [
//             "173.96",
//             "0.42"
//         ],
//         [
//             "173.97",
//             "0.02"
//         ],
//         [
//             "173.98",
//             "0.52"
//         ],
//         [
//             "174.00",
//             "30.20"
//         ],
//         [
//             "174.08",
//             "1.85"
//         ],
//         [
//             "174.12",
//             "0.09"
//         ],
//         [
//             "174.14",
//             "0.31"
//         ],
//         [
//             "174.22",
//             "0.10"
//         ],
//         [
//             "174.23",
//             "1.00"
//         ],
//         [
//             "174.31",
//             "1.68"
//         ],
//         [
//             "174.32",
//             "0.21"
//         ],
//         [
//             "174.33",
//             "0.13"
//         ],
//         [
//             "174.38",
//             "0.07"
//         ],
//         [
//             "174.40",
//             "0.08"
//         ],
//         [
//             "174.52",
//             "0.08"
//         ],
//         [
//             "174.53",
//             "0.03"
//         ],
//         [
//             "174.60",
//             "0.01"
//         ],
//         [
//             "174.61",
//             "1.10"
//         ],
//         [
//             "174.64",
//             "0.07"
//         ],
//         [
//             "174.66",
//             "0.71"
//         ],
//         [
//             "174.68",
//             "1.00"
//         ],
//         [
//             "174.69",
//             "0.21"
//         ],
//         [
//             "174.71",
//             "0.08"
//         ],
//         [
//             "174.78",
//             "0.19"
//         ],
//         [
//             "174.81",
//             "0.58"
//         ],
//         [
//             "174.87",
//             "0.08"
//         ],
//         [
//             "174.88",
//             "0.04"
//         ],
//         [
//             "174.91",
//             "0.07"
//         ],
//         [
//             "174.95",
//             "0.03"
//         ],
//         [
//             "174.97",
//             "0.50"
//         ],
//         [
//             "175.00",
//             "529.11"
//         ],
//         [
//             "175.01",
//             "0.03"
//         ],
//         [
//             "175.04",
//             "0.06"
//         ],
//         [
//             "175.06",
//             "0.83"
//         ],
//         [
//             "175.10",
//             "2.21"
//         ],
//         [
//             "175.12",
//             "1.00"
//         ],
//         [
//             "175.14",
//             "0.15"
//         ],
//         [
//             "175.16",
//             "0.50"
//         ],
//         [
//             "175.17",
//             "2.21"
//         ],
//         [
//             "175.18",
//             "0.07"
//         ],
//         [
//             "175.19",
//             "0.02"
//         ],
//         [
//             "175.30",
//             "0.75"
//         ],
//         [
//             "175.31",
//             "0.64"
//         ],
//         [
//             "175.33",
//             "0.02"
//         ],
//         [
//             "175.35",
//             "0.21"
//         ],
//         [
//             "175.37",
//             "0.03"
//         ],
//         [
//             "175.38",
//             "0.64"
//         ],
//         [
//             "175.39",
//             "0.04"
//         ],
//         [
//             "175.41",
//             "0.15"
//         ],
//         [
//             "175.42",
//             "0.10"
//         ],
//         [
//             "175.43",
//             "0.21"
//         ],
//         [
//             "175.45",
//             "1.17"
//         ],
//         [
//             "175.48",
//             "0.10"
//         ],
//         [
//             "175.50",
//             "2.06"
//         ],
//         [
//             "175.53",
//             "0.08"
//         ],
//         [
//             "175.54",
//             "1.96"
//         ],
//         [
//             "175.55",
//             "0.08"
//         ],
//         [
//             "175.56",
//             "1.21"
//         ],
//         [
//             "175.59",
//             "0.31"
//         ],
//         [
//             "175.66",
//             "0.60"
//         ],
//         [
//             "175.68",
//             "2.98"
//         ],
//         [
//             "175.69",
//             "0.62"
//         ],
//         [
//             "175.72",
//             "0.07"
//         ],
//         [
//             "175.73",
//             "0.06"
//         ],
//         [
//             "175.74",
//             "0.29"
//         ],
//         [
//             "175.75",
//             "0.01"
//         ],
//         [
//             "175.78",
//             "0.50"
//         ],
//         [
//             "175.79",
//             "0.24"
//         ],
//         [
//             "175.94",
//             "0.09"
//         ],
//         [
//             "175.95",
//             "0.16"
//         ],
//         [
//             "175.96",
//             "0.50"
//         ],
//         [
//             "175.97",
//             "0.02"
//         ],
//         [
//             "175.99",
//             "0.11"
//         ],
//         [
//             "176.00",
//             "7.23"
//         ],
//         [
//             "176.01",
//             "1.62"
//         ],
//         [
//             "176.02",
//             "1.68"
//         ],
//         [
//             "176.04",
//             "0.15"
//         ],
//         [
//             "176.06",
//             "0.21"
//         ],
//         [
//             "176.09",
//             "0.19"
//         ],
//         [
//             "176.10",
//             "1.10"
//         ],
//         [
//             "176.11",
//             "0.30"
//         ],
//         [
//             "176.16",
//             "0.21"
//         ],
//         [
//             "176.19",
//             "0.01"
//         ],
//         [
//             "176.22",
//             "0.18"
//         ],
//         [
//             "176.25",
//             "0.07"
//         ],
//         [
//             "176.32",
//             "0.70"
//         ],
//         [
//             "176.36",
//             "0.50"
//         ],
//         [
//             "176.39",
//             "0.02"
//         ],
//         [
//             "176.41",
//             "0.05"
//         ],
//         [
//             "176.45",
//             "1.00"
//         ],
//         [
//             "176.47",
//             "0.58"
//         ],
//         [
//             "176.48",
//             "0.38"
//         ],
//         [
//             "176.51",
//             "0.30"
//         ],
//         [
//             "176.52",
//             "0.36"
//         ],
//         [
//             "176.53",
//             "0.21"
//         ],
//         [
//             "176.57",
//             "0.27"
//         ],
//         [
//             "176.58",
//             "50.00"
//         ],
//         [
//             "176.59",
//             "0.80"
//         ],
//         [
//             "176.61",
//             "1.94"
//         ],
//         [
//             "176.63",
//             "0.56"
//         ],
//         [
//             "176.64",
//             "0.65"
//         ],
//         [
//             "176.67",
//             "0.08"
//         ],
//         [
//             "176.68",
//             "1.13"
//         ],
//         [
//             "176.74",
//             "2.31"
//         ],
//         [
//             "176.75",
//             "0.15"
//         ],
//         [
//             "176.76",
//             "0.21"
//         ],
//         [
//             "176.77",
//             "0.04"
//         ],
//         [
//             "176.79",
//             "0.07"
//         ],
//         [
//             "176.80",
//             "3.59"
//         ],
//         [
//             "176.81",
//             "2.23"
//         ],
//         [
//             "176.89",
//             "1.00"
//         ],
//         [
//             "176.90",
//             "0.21"
//         ],
//         [
//             "176.96",
//             "0.66"
//         ],
//         [
//             "176.97",
//             "0.50"
//         ],
//         [
//             "177.00",
//             "1.21"
//         ],
//         [
//             "177.02",
//             "0.15"
//         ],
//         [
//             "177.03",
//             "0.31"
//         ],
//         [
//             "177.06",
//             "0.10"
//         ],
//         [
//             "177.11",
//             "0.04"
//         ],
//         [
//             "177.13",
//             "1.05"
//         ],
//         [
//             "177.17",
//             "0.07"
//         ],
//         [
//             "177.24",
//             "0.10"
//         ],
//         [
//             "177.27",
//             "11.37"
//         ],
//         [
//             "177.28",
//             "0.83"
//         ],
//         [
//             "177.29",
//             "1.85"
//         ],
//         [
//             "177.30",
//             "7.38"
//         ],
//         [
//             "177.33",
//             "0.67"
//         ],
//         [
//             "177.36",
//             "0.20"
//         ],
//         [
//             "177.40",
//             "0.19"
//         ],
//         [
//             "177.46",
//             "0.30"
//         ],
//         [
//             "177.47",
//             "0.21"
//         ],
//         [
//             "177.49",
//             "0.03"
//         ],
//         [
//             "177.53",
//             "0.30"
//         ],
//         [
//             "177.56",
//             "0.29"
//         ],
//         [
//             "177.59",
//             "582.40"
//         ],
//         [
//             "177.60",
//             "0.69"
//         ],
//         [
//             "177.65",
//             "0.21"
//         ],
//         [
//             "177.66",
//             "0.02"
//         ],
//         [
//             "177.68",
//             "1.94"
//         ],
//         [
//             "177.70",
//             "1.49"
//         ],
//         [
//             "177.73",
//             "1.68"
//         ],
//         [
//             "177.75",
//             "0.18"
//         ],
//         [
//             "177.80",
//             "0.08"
//         ],
//         [
//             "177.81",
//             "0.50"
//         ],
//         [
//             "177.83",
//             "0.65"
//         ],
//         [
//             "177.87",
//             "0.07"
//         ],
//         [
//             "177.89",
//             "0.01"
//         ],
//         [
//             "177.91",
//             "0.03"
//         ],
//         [
//             "177.92",
//             "0.62"
//         ],
//         [
//             "177.93",
//             "0.08"
//         ],
//         [
//             "177.94",
//             "0.28"
//         ],
//         [
//             "177.99",
//             "0.10"
//         ],
//         [
//             "178.00",
//             "65.82"
//         ],
//         [
//             "178.02",
//             "0.39"
//         ],
//         [
//             "178.03",
//             "0.68"
//         ],
//         [
//             "178.04",
//             "217.44"
//         ],
//         [
//             "178.07",
//             "0.29"
//         ],
//         [
//             "178.08",
//             "351.09"
//         ],
//         [
//             "178.09",
//             "0.02"
//         ],
//         [
//             "178.10",
//             "8.50"
//         ],
//         [
//             "178.13",
//             "0.07"
//         ],
//         [
//             "178.18",
//             "11.60"
//         ],
//         [
//             "178.19",
//             "0.40"
//         ],
//         [
//             "178.20",
//             "0.21"
//         ],
//         [
//             "178.21",
//             "0.50"
//         ],
//         [
//             "178.23",
//             "0.10"
//         ],
//         [
//             "178.24",
//             "0.62"
//         ],
//         [
//             "178.25",
//             "0.50"
//         ],
//         [
//             "178.28",
//             "0.59"
//         ],
//         [
//             "178.29",
//             "124.02"
//         ],
//         [
//             "178.32",
//             "0.03"
//         ],
//         [
//             "178.33",
//             "0.02"
//         ],
//         [
//             "178.34",
//             "0.10"
//         ],
//         [
//             "178.36",
//             "0.02"
//         ],
//         [
//             "178.37",
//             "0.28"
//         ],
//         [
//             "178.39",
//             "0.21"
//         ],
//         [
//             "178.40",
//             "0.07"
//         ],
//         [
//             "178.41",
//             "0.30"
//         ],
//         [
//             "178.45",
//             "0.50"
//         ],
//         [
//             "178.47",
//             "0.30"
//         ],
//         [
//             "178.52",
//             "0.22"
//         ],
//         [
//             "178.56",
//             "0.62"
//         ],
//         [
//             "178.58",
//             "64.67"
//         ],
//         [
//             "178.59",
//             "1.31"
//         ],
//         [
//             "178.60",
//             "2.35"
//         ],
//         [
//             "178.61",
//             "0.14"
//         ],
//         [
//             "178.63",
//             "0.23"
//         ],
//         [
//             "178.64",
//             "0.15"
//         ],
//         [
//             "178.66",
//             "0.19"
//         ],
//         [
//             "178.67",
//             "0.10"
//         ],
//         [
//             "178.77",
//             "0.24"
//         ],
//         [
//             "178.80",
//             "0.50"
//         ],
//         [
//             "178.82",
//             "33.86"
//         ],
//         [
//             "178.85",
//             "0.88"
//         ],
//         [
//             "178.88",
//             "0.62"
//         ],
//         [
//             "178.89",
//             "0.21"
//         ],
//         [
//             "178.90",
//             "0.02"
//         ],
//         [
//             "178.91",
//             "0.13"
//         ],
//         [
//             "178.92",
//             "0.03"
//         ],
//         [
//             "178.94",
//             "0.08"
//         ],
//         [
//             "179.00",
//             "1.24"
//         ],
//         [
//             "179.02",
//             "21.29"
//         ],
//         [
//             "179.04",
//             "0.02"
//         ],
//         [
//             "179.06",
//             "0.02"
//         ],
//         [
//             "179.09",
//             "0.02"
//         ],
//         [
//             "179.10",
//             "0.22"
//         ],
//         [
//             "179.11",
//             "0.14"
//         ],
//         [
//             "179.12",
//             "0.22"
//         ],
//         [
//             "179.14",
//             "0.43"
//         ],
//         [
//             "179.18",
//             "0.14"
//         ],
//         [
//             "179.20",
//             "21.42"
//         ],
//         [
//             "179.21",
//             "0.06"
//         ],
//         [
//             "179.23",
//             "9.91"
//         ],
//         [
//             "179.24",
//             "0.41"
//         ],
//         [
//             "179.25",
//             "0.11"
//         ],
//         [
//             "179.27",
//             "4.00"
//         ],
//         [
//             "179.29",
//             "0.31"
//         ],
//         [
//             "179.30",
//             "3.05"
//         ],
//         [
//             "179.31",
//             "4.00"
//         ],
//         [
//             "179.33",
//             "1.31"
//         ],
//         [
//             "179.35",
//             "4.00"
//         ],
//         [
//             "179.36",
//             "0.31"
//         ],
//         [
//             "179.37",
//             "0.31"
//         ],
//         [
//             "179.38",
//             "4.00"
//         ],
//         [
//             "179.39",
//             "4.00"
//         ],
//         [
//             "179.40",
//             "30.88"
//         ],
//         [
//             "179.42",
//             "0.01"
//         ],
//         [
//             "179.43",
//             "27.86"
//         ],
//         [
//             "179.44",
//             "0.01"
//         ],
//         [
//             "179.46",
//             "6.87"
//         ],
//         [
//             "179.47",
//             "19.66"
//         ],
//         [
//             "179.50",
//             "47.94"
//         ],
//         [
//             "179.52",
//             "33.79"
//         ],
//         [
//             "179.53",
//             "37.95"
//         ],
//         [
//             "179.54",
//             "25.48"
//         ],
//         [
//             "179.55",
//             "16.70"
//         ],
//         [
//             "179.59",
//             "6.00"
//         ],
//         [
//             "179.63",
//             "0.30"
//         ],
//         [
//             "179.64",
//             "0.20"
//         ]
//     ]
// }