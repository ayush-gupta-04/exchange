'use server'
import { SignupFormat, SignupSchema } from "@/utils/zod";
import {createPool} from '@/utils/db-client'
import { generateOTP, generateOtpExpiry, generateUUID } from "@/utils/functions";
import { sendMail } from "@/utils/mail-Trap";
import axios from "axios";

export async function createAccount(data : SignupFormat) : Promise<{success : boolean, message : string, token? : string }> {
    const format = SignupSchema.safeParse(data);
    if(format.success){
        const query1 = `
            SELECT email
            FROM crypto_users
            WHERE email = $1;
        `
        try {
            const client = createPool();
            const query1_res = await client.query(query1,[data.email])
            if(query1_res.rowCount && query1_res.rowCount > 0){
                return{
                    success : false,
                    message : "User already exist !"
                }
            }else{
                //create a user + otp
                try {
                    const expiry = generateOtpExpiry(); 
                    const otp = generateOTP();
                    const token = generateUUID();
                    await client.query('BEGIN');
                    const createUserQuery_res = await client.query(`
                        INSERT INTO crypto_users (first_name,last_name,email,password)
                        VALUES ($1, $2, $3, $4)
                        RETURNING user_id;
                    `,[data.firstname,data.lastname,data.email,data.password]) 
                    
                    const user_id = createUserQuery_res.rows[0].user_id;

                    await client.query(`
                        INSERT INTO otp_table (user_id,token,otp,expiry)
                        VALUES ($1,$2,$3,$4)  
                    `,[user_id,token,otp,expiry])

                    await client.query("COMMIT");
                    
                    //send email
                    await sendMail({email : data.email,otp})
                    return {
                        success : true,
                        message : "Otp sent to email!",
                        token : token
                    }
                    
                } catch (error) {
                    return {
                        success : false,
                        message : "Something went down!"
                    }
                }
                
            }
        } catch (error) {
            return{
                success : false,
                message : "Something went down!"
            }
        }
        
    }
    return {
        success : false,
        message : "Invalid format !"
    }
}