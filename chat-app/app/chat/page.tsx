import { getUserInfo } from '@/server/user'
import { redirect } from 'next/navigation'
import React from 'react'
import { createConversation } from '@/lib/chat'

const ChatPage =async () => {
    const user=await getUserInfo()
    if(!user){
        redirect('/signin')
    }
    const conversationId=await createConversation(user.user.id)
    redirect(`/chat/${conversationId}`)
}

export default ChatPage