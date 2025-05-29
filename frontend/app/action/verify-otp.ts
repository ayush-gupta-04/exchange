'use server'

import { createPool } from "@/utils/db-client";
import { BackendResponse } from "@/utils/types"
import { OTPSchema } from "@/utils/zod"

export async function verifyOtp_OnSignup({otp,token} : {otp : string,token : string}) : Promise<BackendResponse>{
    const format = OTPSchema.safeParse({otp : otp});
    if(format.success){
        try {
            const client = createPool();
            const data = await client.query(`
                SELECT user_id,otp,expiry
                FROM otp_table
                WHERE token = $1;
            `,[token])
            if(data.rowCount && data.rowCount > 0){
                const otp_db = data.rows[0].otp;
                const expiry_db = data.rows[0].expiry;
                const user_id = data.rows[0].user_id;
                if(Date.now() > expiry_db){
                    return {
                        success : false,
                        message : "OTP expired!"
                    }
                }
                if(otp == otp_db){
                    try {
                        await client.query("BEGIN")
                        await client.query(`
                            UPDATE crypto_users 
                            SET verified = true
                            WHERE user_id = $1      
                        `,[user_id])
                        await client.query(`
                            UPDATE otp_table
                            SET verified = true
                            WHERE token = $1    
                        `,[token])
                        await client.query("COMMIT")
                        return{
                            success : true,
                            message : "OTP verified successfully!"
                        }
                    } catch (error) {
                        return{
                            success : false,
                            message : "Something went down!"
                        }
                    }
                }
                else{
                    return{
                        success :false,
                        message : "Wrong OTP!"
                    }
                }
            }else{
                return {
                    success : false,
                    message : "Invalid token!"
                }
            }
        } catch (error) {
            return{
                success : false,
                message : "Something went down!"
            }
        }
    }else{
        return{
            success : false,
            message : "Invalid input!"
        }
    }
}