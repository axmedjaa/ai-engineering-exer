import { Audio, connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const api=new OpenAI({apiKey:process.env.OPEN_AI_API_KEY})

export async function POST(req:NextRequest){
    await connectToDatabase();
    const{text,targetLanguage,id}=await req.json()
    if(!text || !targetLanguage){
        return NextResponse.json({error:"No text or target language provided"},{status:400})
    }
    const prompt=`Translate the following text into ${targetLanguage}: ${text}`
    const res=await api.chat.completions.create({
        model:"gpt-4o-mini",
        messages:[
            {role:"system",content:"you are helpful translation assistant."},{role:"user",content:prompt}
        ]
    })
    const translateText=res.choices[0].message.content
   const audiodoc = await Audio.findByIdAndUpdate(
    new mongoose.Types.ObjectId(id),
  { translatedText: translateText },
  { returnDocument: "after" } 
);
console.log(audiodoc)
    return NextResponse.json({audiodoc})
}