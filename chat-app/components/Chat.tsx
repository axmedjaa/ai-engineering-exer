"use client"
import Logout from "@/components/Logout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { UIMessage,useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import {Bot,User,Send} from "lucide-react"
import { useState } from "react"
import {Streamdown} from 'streamdown'
interface ChatProps {
    initialMessage?:UIMessage[],
    conversationId:string
    conversationTitle?:string
}
const Chat = ({initialMessage=[],conversationId,conversationTitle="new conversation"}:ChatProps) => {
    const{data:session}=useSession()
    const[input,setInput]=useState("")
    const {messages,sendMessage,status,error,stop}=useChat({
      id:conversationId,
      messages:initialMessage,
      transport:new DefaultChatTransport({
        api:"/api/chat",
        prepareSendMessagesRequest({messages,id}){
            return {
                body:{
                    message:messages[messages.length-1],
                    id
                }
            }
        }
      })
    })
    if(!session){
        return null
    }
  return (
    <div className="flex flex-col h-screen bg-white">
        {/* header */}
        <div className="bg-white border-b border-rose-100 px-4 py-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-10 h-10">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-rose-500 text-white font-medium">{session.user.name?.charAt(0) || ""}</AvatarFallback>
                    </Avatar>
                    <div >
                        <h1 className="text-lg font-bold text-gray-900">{conversationTitle||"ai chat"}</h1>
                        <p className="text-sm text-rose-500"> chat with ai assistant</p>
                    </div>
                </div>
                 
            </div>
        </div>
        {/* message */}
         <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 bg-rose-100 rounded-full flex items-center justify-center">
                <Bot className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-500">
                Ask me anything! I'm here to help.
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-3 max-w-2xl ${
                  message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <Avatar className="h-7 w-7 flex-shrink-0">
                  {message.role === "user" ? (
                    <>
                      <AvatarImage src={session.user.image || ""} />
                      <AvatarFallback className="bg-rose-500 text-white text-xs">
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-rose-100">
                      <Bot className="h-3 w-3 text-rose-500" />
                    </AvatarFallback>
                  )}
                </Avatar>

                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-rose-500 text-white"
                      : "bg-gray-50 text-gray-900 border border-gray-100"
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return message.role === "assistant" ? (
                            <Streamdown
                              key={i}
                              className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-rose-600 prose-code:bg-rose-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200"
                                parseIncompleteMarkdown={true}
                            >
                              {part.text}
                            </Streamdown>
                          ) : (
                            <span key={i} className="whitespace-pre-wrap">
                              {part.text}
                            </span>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* input */}
        <div className="bg-white border-t border-rose-100 p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim() && status === "ready") {
                  sendMessage({ text: input });
                  setInput("");
                }
              }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex space-x-3">
                <input
                  className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors"
                  value={input}
                  placeholder="Type your message..."
                  onChange={(e) => setInput(e.target.value)}
                  disabled={status !== "ready"}
                />
                <Button
                  type="submit"
                  disabled={status !== "ready" || !input.trim()}
                  className="px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
    </div>
  )
}

export default Chat