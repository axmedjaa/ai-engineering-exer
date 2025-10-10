import Chat from '@/components/Chat'
import { getConversationById, loadChat } from '@/lib/chat'
import { getUserInfo } from '@/server/user'
import { redirect } from 'next/navigation'
import React from 'react'
interface ChatProps{
    params:{id:string}
}
const ChatApp = async({params}:ChatProps) => {
    const{id}=await params
    const user=await getUserInfo()
    if(!user){
        redirect('/signin')
    }
    const conversationId=await getConversationById(id,user.user.id)
    if(!conversationId){
        redirect('/chat')
    }
    const initialMessage=await loadChat(id)
  return (
    <Chat
        initialMessage={initialMessage}
        conversationId={id}
    />
  )         
}

export default ChatApp