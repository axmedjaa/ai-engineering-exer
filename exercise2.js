import OpenAI from "openai";
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()
const api = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
})

const generateImage = async () => {
    const image = await api.images.generate({
        model: "dall-e-3",
        prompt: "a man wearing a jacket",
        size: "1024x1024",
        response_format: "b64_json",
        quality: "hd",
        style: "vivid"
    })
    const imageBased64 = image.data[0].b64_json
    const imageBytes = Buffer.from(imageBased64, "base64")
    fs.writeFileSync("assets/exercise2/image1.png", imageBytes)
    console.log("success audio")
}
generateImage()