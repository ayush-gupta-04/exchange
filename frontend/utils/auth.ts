import CredentialsProvider  from "next-auth/providers/credentials"
import { createPool } from "./db-client";


export const NEXT_AUTH = {
    providers : [
        CredentialsProvider({
            name : "Email",
            credentials : {
                otp: { label: "OTP", type: "text" },
                token: { label: "Token", type: "text" }
            },
            async authorize(credentials? : {otp : string,token : string}) : Promise<{id : string,name : string,email : string} | null>{
                if(!credentials){
                    return null;
                }
                try {
                    const client = createPool();
                    const dataFromDB = await client.query(`
                        SELECT user_id,otp,expiry
                        FROM otp_table
                        WHERE token = $1
                    `,[credentials.token])
                    if(dataFromDB.rowCount && dataFromDB.rowCount > 0){
                        const otp_db = dataFromDB.rows[0].otp;
                        const expiry_db = dataFromDB.rows[0].expiry;
                        const user_id = dataFromDB.rows[0].user_id;
                        if(Date.now() > expiry_db){
                            return null;
                        }
                        if(otp_db == credentials.otp){
                            try {
                                await client.query("BEGIN");
                                const userData = await client.query(`
                                    UPDATE crypto_users
                                    SET verified = true
                                    WHERE user_id = $1
                                    RETURNING user_id,first_name,last_name,email;
                                `,[user_id])
                                await client.query(`
                                    UPDATE otp_table
                                    SET verified = true
                                    WHERE token = $1
                                `,[credentials.token])
                                await client.query(`COMMIT`);
                                if(userData.rowCount && userData.rowCount > 0){
                                    return {
                                        id : userData.rows[0].user_id,
                                        name : userData.rows[0].first_name + " " + userData.rows[0].last_name,
                                        email : userData.rows[0].email
                                    }
                                }else{
                                    return null;
                                }
                            } catch (error) {
                                console.log(error)
                                return null;
                            }
                        }else{
                            return null;
                        }
                    }
                    else{
                        return null;
                    }
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    pages : {
        signIn : '/login',
        signOut : '/login'
    },
    secret : process.env.NEXTAUTH_SECRET,
    callbacks : {
        session : ({session , token} : any) => {
            session.user.id = token.sub;
            return session;
        }
    }
}