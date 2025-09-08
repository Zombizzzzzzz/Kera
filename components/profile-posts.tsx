import { createClient } from "@/lib/supabase/server"
import { PostCard } from "@/components/post-card"

interface ProfilePostsProps {
  userId: string
  currentUserId: string
}

export async function ProfilePosts({ userId, currentUserId }: ProfilePostsProps) {
  const supabase = await createClient()

  // Get posts by this user
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
    .eq("author_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user posts:", error)
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
        <p className="text-cream-dark">This user hasn't shared anything yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-cream-dark border-b border-banana/20 pb-2">Posts ({posts.length})</h2>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}
    </div>
  )
}
