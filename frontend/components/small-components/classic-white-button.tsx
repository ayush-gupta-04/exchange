import Loader from "@/ui/loader";
import { boolean } from "zod";

export default function ClassicWhiteButton({text, disabled,loading} : {text : string , disabled : boolean,loading : boolean}){
    return(
        <button disabled = {disabled} className="w-full cursor-pointer justify-center items-center bg-base-text-white py-3 flex text-base-background-light font-semibold text-lg rounded-lg active:scale-95 transition-all hover:bg-base-text-white/[80%]">{loading && <Loader></Loader>}{!loading && text}</button>
    )
}