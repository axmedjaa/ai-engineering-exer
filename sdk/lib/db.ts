import mongoose from "mongoose";
const mongoUrl=process.env.MONGODB_URL

export const connectToDatabase=async()=>{
    if(mongoose.connection.readyState===1)return
   try {
     await mongoose.connect(mongoUrl!,{
        dbName:"movie"
    })
    console.log("connected to database")
   } catch (error) {
    console.log(error)
   }
}