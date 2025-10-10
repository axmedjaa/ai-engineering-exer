import { NextResponse } from "next/server"
import { getUserInfo } from "@/server/user"
import { getUserConversation } from "@/lib/chat"

export async function GET() {
  const user = await getUserInfo() // get current logged-in user
  if (!user) return NextResponse.json([], { status: 401 })

  const conversations = await getUserConversation(user.user.id)
  return NextResponse.json(conversations)
}
