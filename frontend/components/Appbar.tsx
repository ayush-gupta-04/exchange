'use client'
import { Logout } from "@/icons/logout";
import { Person } from "@/icons/person";
import searchIcon from "@/icons/search"
import { SettingsIcon } from "@/icons/settings";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {  useState } from "react"


export function Appbar(){
    const [filter , setFilter] = useState<null | string>(null);
    const [show,setShow] = useState(false)
    const router = useRouter();
    const session = useSession();
    function handleEnterPress(e : React.KeyboardEvent<HTMLInputElement> ){
        if(e.key == "Enter" && filter ){
            router.push(`/trade/${filter}`)
        }
    }
    async function handleLogout(){
        await signOut({callbackUrl : "/"});
    }
    return (
        <div className="h-fit w-full top-0 sticky z-20 px-10 py-4 bg-base-background-dark text-white flex flex-row justify-between items-center">
            <div className="text-2xl font-semibold">
                Backpack
            </div>
            <div className="w-1/5 flex flex-row focus-within:ring-accent-blue focus-within:ring-2 rounded-lg" >
                <div className="bg-base-background-light2 rounded-l-lg px-2 py-1 flex justify-center items-center">{searchIcon()}</div>
                <input type="text" placeholder="Market" className=  "bg-base-background-light2 px-2 py-2 rounded-r-lg w-full focus:outline-hidden border-0  text-base-text-white" onChange={(e) => {setFilter(e.target.value)}} onKeyDown={handleEnterPress}/>
            </div>
            {session.status == 'authenticated' && 
                <div className="rounded-full size-10 bg-accent-red/[20%] cursor-pointer flex justify-center items-center text-xl text-accent-red/[80%]" onClick={() => {setShow(!show)}} >{session.data.user?.name?.charAt(0).toUpperCase()}
                    
                </div>
            }
            {session.status == 'unauthenticated' && 
                <div className="flex flex-row gap-3">
                    <Link className="bg-accent-green/[16%] text-accent-green font-semibold px-3 py-2 rounded-lg cursor-pointer hover:bg-accent-green/[10%] hover:text-accent-green/[75%]" href={"/signup"}>Sign up</Link>
                    <div className="bg-accent-blue/[16%] text-accent-blue font-semibold px-3 py-2 rounded-lg cursor-pointer hover:bg-accent-blue/[10%] hover:text-accent-blue/[75%]" onClick={() => {signIn()}}>Sign in</div>
                </div>
            }
            {session.status == 'loading' &&
                <div className="size-10"></div>
            }
            <DropdownBox name = {session.data?.user?.name} email = {session.data?.user?.email} signout = {handleLogout} show ={show}></DropdownBox>
        </div>
    )
}




function DropdownBox({name , email,signout,show} : {name? : string | null, email? : string | null,signout : () => {} , show : boolean}){
    return (
        <div className={`bg-base-background-light h-fit z-20 top-20 right-4 border-1 border-base-background-light2 fixed shadow-black shadow-xl w-1/5 rounded-lg transition-all ${show?"opacity-100 scale-100":"pointer-events-none opacity-0 scale-95"}`} onClick={(e) => {e.stopPropagation()}}>
            <NameEmail name = {name} email = {email}></NameEmail>
            <Settings></Settings>
            <LogOut signout = {signout}></LogOut>
        </div>
    )
}

function NameEmail({name , email} : {name? : string | null, email? : string | null}){
    return(
        <div className="py-3 flex items-center gap-3 border-b-1 border-b-base-background-light2 px-4">
            <div className="text-base-dim-text"><Person></Person></div>
            <div className="flex flex-col gap1">
                <div className="text-xl">{name}</div>
                <div className="text-base-dim-text">{email}</div>
            </div>
        </div>
    )
}
function Settings(){
    return (
        <Link className="py-3 border-b-1 border-b-base-background-light2 hover:bg-base-hover px-4 flex gap-2 items-center cursor-pointer" href={'/settings'}>
            <div className="text-base-dim-text"><SettingsIcon></SettingsIcon></div>
            <div>Settings</div>
        </Link>
    )
}
function LogOut({signout} : {signout : () => {}}){
    return (
        <div className="py-3 border-b-1 border-b-base-background-light2 hover:bg-base-hover px-4 flex gap-2 items-center rounded-b-lg cursor-pointer" onClick={() => {signout()}}>
            <div className="text-base-dim-text"><Logout></Logout></div>
            <div>Logout</div>
        </div>
    )
}