"use client"
import Link from "next/link"
import React, { useEffect, useState } from "react"

interface Conversation {
  id: string
  title: string
}

const ChatLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    async function fetchConversations() {
      const res = await fetch("/api/conversation")
      if (res.ok) {
        const data: Conversation[] = await res.json()
        setConversations(data)
      }
    }
    fetchConversations()
  }, [])

  return (
    <div className="min-h-screen flex bg-gray-200">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${isSideBarOpen ? "w-64" : "w-16"}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {isSideBarOpen && <h2 className="text-xl font-bold">Conversations</h2>}
          <button className="p-2" onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className={`w-6 h-6 transition-transform duration-300 ${isSideBarOpen ? "" : "rotate-180"}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </button>
        </div>

        <ul className={`flex flex-col ml-8 mt-4 gap-2 ${isSideBarOpen ? "block" : "hidden"}`}>
          {conversations.length === 0 && <li className="p-2 text-gray-400">No conversations</li>}
          {conversations.map((conv) => (
            <li key={conv.id} className="hover:bg-gray-700 p-2">
              <Link href={`/chat/${conv.id}`}>{conv.title}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  )
}

export default ChatLayout
