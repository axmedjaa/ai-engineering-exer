import OpenAI from "openai";
import dotenv from "dotenv"
dotenv.config()
const api=new OpenAI({
    apiKey:process.env.OPEN_ROUTE_API_KEY,
    baseURL:"https://openrouter.ai/api/v1"
})
const generateText=async(context,prompt,length)=>{
    const lengthInstructions={
         short: 'in 2 sentences',
         medium: 'in 1-2 paragraphs', 
         long: 'in 3-4 paragraphs'
    }
    const response=await api.chat.completions.create({
        model:"deepseek/deepseek-r1:free",
        messages:[
            {role:"system",content:"You are a helpful assistant that helps people find information."},
            {role:"user",content:`Context:${context} \n\nQuestion:${prompt}, ${lengthInstructions[length]}.`}
        ],
        stream:true
    })
    let fullResponse=""
    for await(const chunk of response){
        const content=chunk.choices[0].delta?.content||""
        if(content){
            process.stdout.write(content)
            fullResponse+=content
        }
    }
    console.log("streaming finished")
    console.log(fullResponse)
}
const context="JavaScript is a versatile programming language commonly used in web development. It allows developers to create interactive and dynamic web pages by manipulating HTML and CSS. JavaScript can be executed on the client-side (in the browser) as well as on the server-side (using environments like Node.js). It supports various programming paradigms, including procedural, object-oriented, and functional programming. With a vast ecosystem of libraries and frameworks, JavaScript enables developers to build complex applications efficiently."
generateText(context,"Explain JavaScript to a 5 year old","short")