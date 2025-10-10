"use server"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
export async function signup(email: string, password: string, name: string) {
    const user=await auth.api.signUpEmail({
       body:{
       name,
       email,
       password
       }
    })
    return user
}
export async function signin(email: string, password: string) {
    const user=await auth.api.signInEmail({body:{email,password}})
    return user
}
export async function getUserInfo() {
    const session=await auth.api.getSession({
        headers:await headers()
    })
    return session
}