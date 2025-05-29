import { ClosedEye, OpenEye } from "@/icons/eye";
import { Dispatch, SetStateAction } from "react";
import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";

export default function PasswordInputBox<T extends FieldValues>({disabled , register , errors ,placeholder , feild , showPassword , setShowPassword} : {
    disabled : boolean,
    placeholder : string,
    register : UseFormRegister<T>,
    errors : FieldErrors<T>,
    feild : Path<T>,
    showPassword : boolean,
    setShowPassword : Dispatch<SetStateAction<boolean>>
}){
    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-row focus-within:ring-accent-blue focus-within:ring-2 rounded-lg border-1 border-base-background-light2">
                <input type={`${showPassword ? "text" : "password"}`} {...register(feild)} placeholder={placeholder} className="bg-base-background-dark px-3 py-3 w-full text-base-text-white  focus:outline-hidden  rounded-l-lg "   />
                <div className="rounded-r-lg bg-base-background-dark flex items-center px-3 text-base-dim-text cursor-pointer" onClick={(e) => {setShowPassword(s => !s) ; e.stopPropagation()}}>
                    {showPassword && ClosedEye()}
                    {!showPassword && OpenEye()}
                </div>
            </div>
            {errors.password && 
                <div className="text-accent-red text-xs">{errors[feild]?.message?.toString()}</div>
            }
        </div>
    )
}
