import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface ConversationsListProps {
  currentUserId: string
}

export async function ConversationsList({ currentUserId }: ConversationsListProps) {
  const supabase = await createClient()

  // Get all conversations for the current user
  const { data: messages } = await supabase
    .from("messages")
    .select(`
      *,
      sender:sender_id (
        id,
        username,
        display_name,
        avatar_url
      ),
      receiver:receiver_id (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
    .order("created_at", { ascending: false })

  if (!messages || messages.length === 0) {
    return (
      <Card className="border-banana/20 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-banana mb-2">No Messages Yet</h3>
          <p className="text-cream-dark">Start a conversation with someone from the Kera community!</p>
        </CardContent>
      </Card>
    )
  }

  // Group messages by conversation partner
  const conversationsMap = new Map()

  messages.forEach((message) => {
    const otherUser = message.sender_id === currentUserId ? message.receiver : message.sender
    const conversationKey = otherUser.id

    if (
      !conversationsMap.has(conversationKey) ||
      new Date(message.created_at) > new Date(conversationsMap.get(conversationKey).created_at)
    ) {
      conversationsMap.set(conversationKey, {
        ...message,
        otherUser,
        isUnread: message.receiver_id === currentUserId && !message.read_at,
      })
    }
  })

  const conversations = Array.from(conversationsMap.values())

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => (
        <Link key={conversation.otherUser.id} href={`/messages/${conversation.otherUser.id}`}>
          <Card className="border-banana/20 hover:border-banana/40 transition-banana cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-banana-gradient rounded-full flex items-center justify-center text-white font-semibold">
                  {conversation.otherUser.display_name?.charAt(0) || "U"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-cream-dark truncate">{conversation.otherUser.display_name}</h4>
                    <span className="text-xs text-cream-dark/70">
                      {formatDistanceToNow(new Date(conversation.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  <p className="text-sm text-banana">@{conversation.otherUser.username}</p>

                  <p
                    className={`text-sm mt-1 truncate ${conversation.isUnread ? "font-semibold text-cream-dark" : "text-cream-dark/70"}`}
                  >
                    {conversation.sender_id === currentUserId ? "You: " : ""}
                    {conversation.content}
                  </p>
                </div>

                {conversation.isUnread && <div className="w-3 h-3 bg-banana rounded-full"></div>}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
