'use client'
import BackpackIcon from "@/icons/backpack";
import { useState } from "react";
import Response from "../response";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormat, SignupSchema } from "@/utils/zod";
import { createAccount } from "@/app/action/signup";
import InputBox from "../small-components/input-box";
import PasswordInputBox from "../small-components/password-input-box";
import ClassicWhiteButton from "../small-components/classic-white-button";
import { BackendResponseWithToken } from "@/utils/types";
import { redirect, useRouter } from "next/navigation";

export default function SignupCard(){
    const router = useRouter();
    const [response ,setResponse] = useState<BackendResponseWithToken>({
        success : null,
        message : "",
    })
    const[loading,setLoading] = useState(false);
    const [showPassword , setShowPassword]= useState(false)
    const {register , handleSubmit , formState : {errors}} = useForm<SignupFormat>({resolver : zodResolver(SignupSchema)})
    const signup = async (data : SignupFormat) => {
        console.log(data)
        setLoading(true);
        const res = await createAccount(data);
        console.log(res)
        if(res.success){
            setTimeout(() => {
                redirect(`/signup/verify?token=${res.token}`)
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
            <div className="py-4 text-2xl font-medium text-base-text-white">Create Account</div>
            <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(signup)}>
                <div className="flex flex-row gap-2">
                    <InputBox<SignupFormat> type="text" disabled = {loading} register={register} errors={errors} placeholder="Firstname" feild = "firstname"></InputBox>
                    <InputBox<SignupFormat> type="text" disabled = {loading} register={register} errors={errors} placeholder="Lastname" feild = "lastname"></InputBox>
                </div>
                <InputBox<SignupFormat> type="text" disabled = {loading} register={register} errors={errors} placeholder="Email" feild = "email"></InputBox>
                <PasswordInputBox<SignupFormat> register={register} errors={errors} placeholder="Password" disabled = {false} showPassword = {showPassword} setShowPassword={setShowPassword} feild="password"></PasswordInputBox>
                {
                    response.success != null && <Response success = {response.success} message={response.message}></Response>
                }
                <ClassicWhiteButton disabled = {loading} text="Sign up" loading = {loading}></ClassicWhiteButton>
            </form>
        </div>
    )
}