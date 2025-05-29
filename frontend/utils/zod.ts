import zod from "zod"
export const SignupSchema = zod.object({
    firstname : zod.string().min(1,{message : "Firstname should not be empty !"}),
    lastname : zod.string(),
    email : zod.string().email({message : "Email must be in a right format !"}),
    password : zod.string().min(8,{message : "Password must be min 8 characters !"})
})
export const LoginSchema = zod.object({
    email : zod.string().email({message : "Email must be in a right format !"}),
    password : zod.string().min(8,{message : "Password must be min 8 characters !"})
})

export const OTPSchema = zod.object({
    otp : zod.string().refine((data) => {
        for(let i = 0; i < data.length ; i++){
            if(!(Number(data[i]) >= 0 && Number(data[i]) <= 9)){
                return false
            }
        }
        return data.length == 6;
    },{message : "Otp must be of length 6 !"})
})

export const LimitOrderSchema = zod.object({
    price : zod.number().min(1),
    quantity : zod.number().min(0.001)
})
export type SignupFormat = zod.infer<typeof SignupSchema>
export type LoginFormat = zod.infer<typeof LoginSchema>
export type OtpFormat = zod.infer<typeof OTPSchema>
export type LimitOrderFormat = zod.infer<typeof LimitOrderSchema>