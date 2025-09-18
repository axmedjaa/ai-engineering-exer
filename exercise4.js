import OpenAI from "openai";
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()
const api = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
})
const allGenerate=async()=>{
    // const textGenearate=await api.chat.completions.create({
    //     model:"gpt-4o-mini",
    //     messages:[{role:"user",content:"Write a short blog post about AI in everyday life."}]
    // })
    // const post=textGenearate.choices[0].message.content
    // console.log(post)
    const imageGenearte=await api.images.generate({
        model:"dall-e-3",
        prompt:"AI robot helping humans at home, cartoon style",
        size:"1024x1024",
        response_format:"b64_json"
    })
    const buferImage=Buffer.from(await imageGenearte.data[0].b64_json,"base64")
    fs.writeFileSync("assets/exercise4/image2.png",buferImage)
    const generateVoiec=await api.audio.speech.create({
        model:"gpt-4o-mini-tts",
        voice:"coral",
        input:"Write a short blog post about AI in everyday life.",
        instructions:"Speak in a cheerful and positive tone."
    })
    const audioBuffer=Buffer.from(await generateVoiec.arrayBuffer())
    fs.writeFileSync("assets/exercise4/audio3.mp3",audioBuffer)
}
allGenerate()