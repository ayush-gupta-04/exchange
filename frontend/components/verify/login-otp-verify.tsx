'use client'
import { useForm } from "react-hook-form";
import ClassicWhiteButton from "../small-components/classic-white-button";
import InputBox from "../small-components/input-box";
import { OtpFormat, OTPSchema } from "@/utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { BackendResponse } from "@/utils/types";
import Response from "../response";
import { verifyOtp_OnSignup } from "@/app/action/verify-otp";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginOtpVerifyCard({token} : {token : string}){
    const[loading,setLoading] = useState(false);
    const[response,setResponse] = useState<BackendResponse>({
        success : null,
        message : ""
    })
    const {register,formState : {errors},handleSubmit} = useForm<OtpFormat>({resolver : zodResolver(OTPSchema)})
    const verifyOtp = async (data : OtpFormat) => {
        setLoading(true);
        const res = await signIn("credentials",{redirect : false,otp : data.otp,token : token});
        if(res?.ok){
            setResponse({success : true,message : "OTP verified successfully!"})
            setTimeout(() => {
                redirect('/')
            },1000)
        }
        else{
            setResponse({success : false,message : "OTP expired or Wrong!"})
        }
        setLoading(false)
    }
    return(
        <div className="h-fit w-2/7 bg-base-background-light rounded-lg p-4">
            <div className="py-4 text-2xl font-medium text-base-text-white text-center">
                Enter OTP to Verify
            </div>
            <form onSubmit={handleSubmit(verifyOtp)} className="flex flex-col gap-4 w-full">
                <InputBox type="text" placeholder="Enter OTP" register={register} errors={errors} disabled ={loading} feild="otp"></InputBox>
                {
                    response.success != null && <Response success = {response.success} message={response.message}></Response>
                }
                <ClassicWhiteButton text="Verify" disabled = {loading} loading = {loading}></ClassicWhiteButton>
            </form>
        </div>
    )
}