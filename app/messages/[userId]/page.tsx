import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { ChatInterface } from "@/components/chat-interface"

interface ChatPageProps {
  params: Promise<{ userId: string }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { userId } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get current user's profile
  const { data: currentProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get the other user's profile
  const { data: otherProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (profileError || !otherProfile) {
    redirect("/messages")
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navigation user={user} profile={currentProfile} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <ChatInterface currentUserId={user.id} otherUserId={userId} otherProfile={otherProfile} />
      </main>
    </div>
  )
}
