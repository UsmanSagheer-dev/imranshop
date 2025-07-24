import { type NextRequest, NextResponse } from "next/server"
import { getConversations, getMessages, createMessage } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversation_id")

    if (conversationId) {
      const result = await getMessages(conversationId)
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
      return NextResponse.json({ messages: result.data })
    } else {
      const result = await getConversations()
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
      return NextResponse.json({ conversations: result.data })
    }
  } catch (error) {
    console.error("Messages API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const messageData = {
      conversationId: body.conversationId,
      senderType: body.senderType,
      senderId: body.senderId,
      senderName: body.senderName,
      message: body.message,
      messageType: body.messageType || "text",
    }

    const result = await createMessage(messageData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ message: result.data[0] }, { status: 201 })
  } catch (error) {
    console.error("Create message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
