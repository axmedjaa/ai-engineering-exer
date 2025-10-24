import mongoose from "mongoose";
const mongoURI = process.env.MONGO_URI as string;
let isConnected = false;

export const connectToDatabase = async () => {
    if(isConnected)return
      if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};
const audioSchema = new mongoose.Schema({
  title: String,      
  url: String,         
  text: String,
  translatedText: String
},
{timestamps: true}
)   
export const Audio = mongoose.models.audio || mongoose.model("audio", audioSchema);