'use server'
import { NEXT_AUTH } from "@/utils/auth";
import { getGuestId } from "@/utils/functions";
import { getServerSession } from "next-auth";

export async function getUser() : Promise<{type : "user"|"guest",id : string,name : string,email : string} | null>{
    const session = await getServerSession(NEXT_AUTH);
    if(session?.user){
        return {
            type : 'user',
            id : session.user.id,
            name : session.user.name,
            email : session.user.email
        }
    }
    return {
        type : 'guest',
        id : getGuestId(),
        name : "Guest",
        email : "guest@gmai.com"
    };
}