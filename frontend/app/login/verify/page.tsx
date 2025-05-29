import LoginOtpVerifyCard from "@/components/verify/login-otp-verify";
import { NEXT_AUTH } from "@/utils/auth";
import { getServerSession } from "next-auth";

export default async function loginVerify({searchParams} : {searchParams : Promise<{token : string}>}){
    const {token} = await searchParams;
    
    return (
        <div className="bg-base-background-dark h-full  flex justify-center items-center flex-1">
            <LoginOtpVerifyCard token = {token}></LoginOtpVerifyCard>
        </div>
    )
}