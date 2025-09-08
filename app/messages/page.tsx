import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { ConversationsList } from "@/components/conversations-list"
import { StartNewChat } from "@/components/start-new-chat"

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get current user's profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-cream">
      <Navigation user={user} profile={profile} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-banana">Messages</h1>
              <StartNewChat currentUserId={user.id} />
            </div>
            <ConversationsList currentUserId={user.id} />
          </div>

          {/* Chat Instructions */}
          <div className="space-y-6">
            <div className="text-center p-8 bg-white rounded-lg border border-banana/20">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-banana mb-2">Start Chatting!</h3>
              <p className="text-cream-dark text-sm">
                Select a conversation or start a new chat to connect with other Kera users.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
