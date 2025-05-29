import ErrorIcon from "@/icons/error";
import TickIcon from "@/icons/tick";

export default function Response({success , message} : {success : boolean,message : string}){
    return(
        <>
            {success && 
            <div className="py-3 bg-accent-green/[15%] text-accent-green flex gap-1 justify-center font-semibold rounded-lg">
                {TickIcon()}
                {message}
            </div>
            }
            {!success && 
            <div className="py-3 bg-accent-red/[15%] text-accent-red flex gap-1 justify-center font-semibold rounded-lg">
                {ErrorIcon()}
                {message}
            </div>
            }
        </>
    )
}