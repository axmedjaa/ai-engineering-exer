import { createConversation, loadChat, saveChat } from "@/lib/chat";
import { getUserInfo } from "@/server/user";
import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createIdGenerator,
  streamText,
  UIMessage,
  validateUIMessages,
} from "ai";

export const maxDuration = 30;
export async function POST(req: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { messages, message: singleMessage, id: conversationId } = body;
    if (!conversationId) {
      return Response.json(
        { error: "conversationId is required" },
        { status: 401 }
      );
    }
    let allMessages: UIMessage[];
    if (singleMessage) {
      const prevMessages = await loadChat(conversationId);
      allMessages = [...prevMessages, singleMessage];
      const title =
      singleMessage?.parts[0]?.text?.slice(0, 50) || "New Conversation";
      await createConversation(user.user.id, title);
    } else if (messages) {
      allMessages = messages;
    } else {
      return Response.json({ error: "messages is required" }, { status: 401 });
    }
    let validatedMessages: UIMessage[];
    try {
      validatedMessages = await validateUIMessages({
        messages: allMessages,
        // Add tools, metadataSchema, dataPartsSchema here if needed
      });
    } catch (error) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const result = streamText({
      model: openai("gpt-4o"),
      system:
        "You are a helpful AI assistant. Be concise and helpful in your responses.",
      messages: convertToModelMessages(validatedMessages),
    });
    result.consumeStream();
    return result.toUIMessageStreamResponse({
      originalMessages: validatedMessages,
      // Generate consistent server-side IDs for persistence
      generateMessageId: createIdGenerator({
        prefix: "msg",
        size: 16,
      }),
      onFinish: async (messages) => {
        try {
          await saveChat({
            chadId: conversationId,
            messages: messages.messages,
          });
        } catch (error) {
          console.log(error);
        }
      },
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
