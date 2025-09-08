import { createClient } from "@/lib/supabase/server"
import { PostCard } from "@/components/post-card"
import { AnimatedFeed } from "@/components/animated-feed"

interface PostFeedProps {
  userId: string
}

export async function PostFeed({ userId }: PostFeedProps) {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url
      ),
      reactions (
        id,
        user_id,
        type
      )
    `)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("Error fetching posts:", error)
    return (
      <div className="text-center py-8">
        <p className="text-cream-dark">Failed to load posts. Please try again.</p>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍌</div>
        <h3 className="text-xl font-semibold text-banana mb-2">No posts yet!</h3>
        <p className="text-cream-dark">Be the first to share something with the Kera community.</p>
      </div>
    )
  }

  return <AnimatedFeed posts={posts} userId={userId} />
}
