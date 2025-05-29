import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";

export default function InputBox<T extends FieldValues>({type , disabled , register , errors,placeholder, feild } : {
    type : string , 
    disabled : boolean,
    placeholder : string,
    register : UseFormRegister<T>,
    errors : FieldErrors<T>,
    feild : Path<T>
}){
    return (
        <div className="flex flex-col gap-1 w-full">
            <input disabled = {disabled} type={type} {...register(feild)} placeholder= {placeholder} className="bg-base-background-dark px-3 py-4 w-full text-base-text-white  focus:outline-hidden focus:ring-accent-blue focus:ring-2  rounded-lg border-1 border-base-background-light2" />
            {errors[feild] && 
                <div className="text-accent-red text-xs">{errors[feild]?.message?.toString()}</div>
            }
        </div>
    )
}