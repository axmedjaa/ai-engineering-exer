import { db } from "@/db/drizzle";
import { conversation, message } from "@/db/schema";
import { UIMessage } from "ai";
import { desc, eq } from "drizzle-orm";
export async function loadChat(conversationId: string): Promise<UIMessage[]> {
  const messages = await db
    .select()
    .from(message)
    .where(eq(message.conversationId, conversationId))
    .orderBy(desc(message.createdAt));
  return messages.map((message) => {
    const parts: UIMessage["parts"] = [];
    if (message.content) {
      parts.push({ type: "text", text: message.content });
    }
    if (message.imageUrl) {
      parts.push({ type: "text", text: `[image](${message.imageUrl})` });
    }
    return {
      id: message.id,
      role: message.role as "user" | "assistant",
      parts,
    };
  });
}
export async function saveChat({
  chadId,
  messages,
}: {
  chadId: string;
  messages: UIMessage[];
}): Promise<void> {
  const conv = await db
    .select({ userId: conversation.userId })
    .from(conversation)
    .where(eq(conversation.id, chadId))
    .limit(1);
  if (conv.length === 0) {
    throw new Error("conversation not found");
  }
  const exsistingMessage = await db
    .select({ id: message.id })
    .from(message)
    .where(eq(message.conversationId, chadId));
  const exsistingMessageId = exsistingMessage.map((message) => message.id);
  const newMessages = messages.filter(
    (message) => !exsistingMessageId.includes(message.id)
  );
  if (newMessages.length > 0) {
    const messageData = newMessages.map((message) => {
      const textPart = message.parts.find((part) => part.type === "text");
      const imagePart = message.parts.find(
        (part): part is { type: "text"; text: string } =>
          part.type === "text" && part.text?.startsWith("http")
      );
      return {
        id: message.id,
        content: textPart?.text || "",
        imageUrl: imagePart?.text || "",
        role: message.role,
        conversationId: chadId,
        userId: conv[0].userId,
      };
    });
    await db.insert(message).values(messageData);
  }
  await db
    .update(conversation)
    .set({ updatedAt: new Date() })
    .where(eq(conversation.id, chadId));
}
