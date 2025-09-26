import { connectToDatabase } from "@/lib/db"
import User from "@/model/user"
import { NextResponse } from "next/server"

export async function POST(req:Request){
    await connectToDatabase()
    const body=await req.json()
    const user=await User.create(body)
    return NextResponse.json({user})
}
export async function GET(){
    await connectToDatabase()
    const user=await User.find()
    return NextResponse.json({user})
}