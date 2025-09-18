import OpenAI from "openai";
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()
const api = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
})
const voiceGenerate=async()=>{
    const voice1=await api.audio.speech.create({
        model:"gpt-4o-mini-tts",
        voice:"coral",
        input:"hello how are you doing",
        instructions:"Speak in a cheerful and positive tone."
    })
    const voice2=await api.audio.speech.create({
        model:"gpt-4o-mini-tts",
        voice:"coral",
        input:"i am doing well",
        instructions:"Speak in a cheerful and positive tone."
    })
    const buffer1=Buffer.from(await voice1.arrayBuffer())
    const buffer2=Buffer.from(await voice2.arrayBuffer())
    fs.writeFileSync("assets/exercise3/audio1.mp3",buffer1)
    fs.writeFileSync("assets/exercise3/audio2.mp3",buffer2)
    console.log("success")
}
voiceGenerate()