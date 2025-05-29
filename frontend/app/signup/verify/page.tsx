import SignupOtpVerifyCard from "@/components/verify/signup-otp-verify";

export default async function SignupVerify({searchParams} : {searchParams : Promise<{token : string}>}){
    const {token} = await searchParams;
    return (
        <div className="bg-base-background-dark h-full  flex justify-center items-center flex-1">
            <SignupOtpVerifyCard token = {token}></SignupOtpVerifyCard>
        </div>
    )
}