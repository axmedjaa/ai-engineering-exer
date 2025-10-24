import { Audio, connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import path from "path";
import fs from "fs";
const api=new OpenAI({apiKey:process.env.OPEN_AI_API_KEY})
export async function POST(req: NextRequest){
    try {
        await connectToDatabase();
        const id = req.nextUrl.searchParams.get("id");
        if(!id){
            return NextResponse.json({error:"No id provided"},{status:400})
        }
        const audiodoc = await Audio.findById(id);
        if(!audiodoc){
            return NextResponse.json({error:"Video not found"},{status:404})
        }
         const filePath = path.join(process.cwd(), "public", audiodoc.url);
        if (!fs.existsSync(filePath)) return NextResponse.json({ error: "File not found" }, { status: 404 });

    const fileStream = fs.createReadStream(filePath);
        const transcription =await api.audio.transcriptions.create({
            file:fileStream,
            model:"whisper-1",
            language:"en"
        })
        audiodoc.text=transcription.text;
        await audiodoc.save();
        return NextResponse.json({
            success:true,
            audiodoc
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"Server error"},{status:500})
    }
}