import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export async function TrendingSection() {
  const supabase = await createClient()

  // Get posts with most reactions in the last 7 days
  const { data: trendingPosts } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      banana_reactions,
      profiles:author_id (
        username,
        display_name
      )
    `)
    .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order("banana_reactions", { ascending: false })
    .limit(5)

  return (
    <Card className="border-banana/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-banana flex items-center">
          <span className="mr-2">🔥</span>
          Trending This Week
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendingPosts && trendingPosts.length > 0 ? (
          trendingPosts.map((post, index) => (
            <div
              key={post.id}
              className="flex items-start space-x-3 p-2 rounded-lg hover:bg-banana/5 transition-banana"
            >
              <div className="text-banana font-bold text-sm">#{index + 1}</div>
              <div className="flex-1">
                <p className="text-sm text-cream-dark line-clamp-2">{post.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <Link href={`/profile/${post.profiles?.username}`} className="text-xs text-banana hover:underline">
                    @{post.profiles?.username}
                  </Link>
                  <span className="text-xs text-cream-dark/70 flex items-center">🍌 {post.banana_reactions}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-cream-dark/70 text-center py-4">No trending posts this week</p>
        )}
      </CardContent>
    </Card>
  )
}
