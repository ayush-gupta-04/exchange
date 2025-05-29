import Loader from "@/ui/loader";
import { boolean } from "zod";

export default function ClassicWhiteButton({text, disabled,loading,side} : {text : string , disabled : boolean,loading : boolean,side : "buy" | 'sell'}){
    return(
        <button disabled = {disabled} className={`w-full cursor-pointer justify-center items-center py-3 flex font-semibold text-lg rounded-lg active:scale-95 transition-all ${side == 'buy' ? "bg-accent-green/[80%] hover:bg-accent-green/[50%]" : "bg-accent-red/[80%] hover:bg-accent-red/[50%]"} `}>{loading && <Loader side={side}></Loader>}{!loading && text}</button>
    )
}