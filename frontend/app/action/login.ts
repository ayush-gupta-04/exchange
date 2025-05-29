'use server'
import { createPool } from "@/utils/db-client";
import { generateOTP, generateOtpExpiry, generateUUID } from "@/utils/functions";
import { sendMail } from "@/utils/mail-Trap";
import { LoginSchema, LoginFormat } from "@/utils/zod";

export async function loginAccount(data : LoginFormat) : Promise<{success : boolean , message : string, token? : string}>{
    const format = LoginSchema.safeParse(data);
    if(format.success){
        try {
            const client = createPool();
            const user = await client.query(`
                SELECT user_id
                FROM crypto_users
                WHERE email = $1 AND password = $2
            `,[data.email,data.password]);
            if(!user.rowCount || user.rowCount == 0){
                console.log("hello")
                return {
                    success : false,
                    message : "Email or Password wrong!"
                }
            }
            try {
                const otp = generateOTP();
                const expiry = generateOtpExpiry();
                const token = generateUUID();
                const user_id = user.rows[0].user_id;
                await client.query(`
                    INSERT INTO otp_table (user_id,token,otp,expiry)
                    VALUES ($1,$2,$3,$4)
                `,[user_id,token,otp,expiry]);
                //send email
                await sendMail({email : data.email,otp})
                return {
                    success : true,
                    message : "Otp sent to email!",
                    token : token
                }
            } catch (error) {
                console.log(error)
                return {
                    success : false,
                    message : "Something went down!"
                }
            }
        } catch (error) {
            console.log(error)
            return {
                success : false,
                message : "Something went down!"
            }
        }
    }else{
        return {
            success : false,
            message : "Invalid format !"
        }
    }
}