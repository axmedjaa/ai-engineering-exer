import { db } from "@/db/drizzle";
import { conversation } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function createConversation(userId:string,title?:string,) {
    const conversation_id=nanoid()
    await db.insert(conversation).values({
        id:conversation_id,
        title:title||"new conversation",
        userId
    })
    return conversation_id
}
export async function getUserConversation(userId:string) {
    return await db.select()
    .from(conversation)
    .where(eq(conversation.userId,userId))
    .orderBy(desc(conversation.createdAt))
}
export async function getConversationById(conversationId:string,userId:string) {
    const result= await db.select()
    .from(conversation)
    .where(eq(conversation.id,conversationId))
    .limit(1)
    const conv=result[0]
    if(!conv||conv.userId!==userId){
        return null
    }
    return conv
}