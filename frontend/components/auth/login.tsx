'use client'
import BackpackIcon from "@/icons/backpack";
import { useState } from "react";
import Response from "../response";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormat, LoginSchema } from "@/utils/zod";
import InputBox from "../small-components/input-box";
import PasswordInputBox from "../small-components/password-input-box";
import ClassicWhiteButton from "../small-components/classic-white-button";
import { loginAccount } from "@/app/action/login";
import { BackendResponse } from "@/utils/types";
import { redirect } from "next/navigation";

export default function LoginCard(){
    const [response ,setResponse] = useState<BackendResponse>({
        success : null,
        message : ""
    })
    const [loading,setLoading] = useState(false);
    const [showPassword , setShowPassword]= useState(false)
    const {register , handleSubmit , formState : {errors}} = useForm<LoginFormat>({resolver : zodResolver(LoginSchema)})
    const signup = async (data : LoginFormat) => {
        setLoading(true);
        const res = await loginAccount(data);
        if(res.success){
            setTimeout(() => {
                redirect(`/login/verify?token=${res.token}`)
            }, 1000);
        }
        setLoading(false);
        setResponse(res);
    }
    return(
        <div className="bg-base-background-light h-fit w-2/7 flex flex-col items-center py-4 px-4 rounded-lg border-1 border-base-background-light2">
            <div>
                <BackpackIcon></BackpackIcon>
            </div>
            <div className="py-4 text-2xl font-medium text-base-text-white">Login to your Account</div>
            <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(signup)}>
                <InputBox<LoginFormat> type="text" disabled = {false} register={register} errors={errors} placeholder="Email" feild = "email"></InputBox>
                <PasswordInputBox<LoginFormat> register={register} errors={errors} placeholder="Password" disabled = {false} showPassword = {showPassword} setShowPassword={setShowPassword} feild="password"></PasswordInputBox>
                {
                    response.success != null && <Response success = {response.success} message={response.message}></Response>
                }
                <ClassicWhiteButton disabled = {false} text="Sign up" loading = {loading}></ClassicWhiteButton>
            </form>
        </div>
    )
}