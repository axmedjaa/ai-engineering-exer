import{ MongoClient,Db} from "mongodb"
let mongoClient:MongoClient
let db:Db
export async function connectToDb(){
    if(db) return db
    const uri=process.env.MONGODB_URI||"mongodb://localhost:27017"
    const dbName=process.env.MONGODB_DB||"shop-proj"
    try {
        mongoClient=new MongoClient(uri)
        await mongoClient.connect()
        db=mongoClient.db(dbName)
        console.log("Connected to MongoDB")
        return db
    } catch (error) {
        console.error("Failed to connect to MongoDB", error)
        throw error
    }
}
export async function getDb(){
    if(!db){
        await connectToDb()
    }
    return db
}
export async function closeMongoDB() {
  if (mongoClient) {
    await mongoClient.close();
  }
}