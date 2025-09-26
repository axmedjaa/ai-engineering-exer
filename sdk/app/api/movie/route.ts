import { connectToDatabase } from "@/lib/db";
import Movie from "@/model/movie";
import { NextResponse } from "next/server";
export async function GET(){
    await connectToDatabase()
    const movie=await Movie.find()
    return NextResponse.json({movie})
}
export async function POST(req:Request){
    await connectToDatabase()
    const body=await req.json()
    const movie=await Movie.create(body)
    return NextResponse.json({movie})
}