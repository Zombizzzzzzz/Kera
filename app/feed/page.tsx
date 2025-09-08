import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PostFeed } from "@/components/post-feed"
import { CreatePost } from "@/components/create-post"
import { Navigation } from "@/components/navigation"

export default async function FeedPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-cream">
      <Navigation user={user} profile={profile} />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-banana mb-2">Welcome to Kera! 🍌</h1>
          <p className="text-cream-dark">Share your thoughts in the banana-verse</p>
        </div>

        <CreatePost userId={user.id} />
        <PostFeed userId={user.id} />
      </main>
    </div>
  )
}
