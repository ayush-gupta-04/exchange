'use server'
import { NEXT_AUTH } from "@/utils/auth";
import { getServerSession } from "next-auth";

export async function getUser() : Promise<{id : string,name : string,email : string} | null>{
    const session = await getServerSession(NEXT_AUTH);
    if(session?.user){
        return {
            id : session.user.id,
            name : session.user.name,
            email : session.user.email
        }
    }
    return null;
}