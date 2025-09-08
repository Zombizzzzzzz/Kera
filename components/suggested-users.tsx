import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCard } from "@/components/user-card"

interface SuggestedUsersProps {
  currentUserId: string
}

export async function SuggestedUsers({ currentUserId }: SuggestedUsersProps) {
  const supabase = await createClient()

  // Get users that the current user is not following
  const { data: suggestedUsers } = await supabase.from("profiles").select("*").neq("id", currentUserId).limit(5)

  // Filter out users already being followed
  const { data: followingIds } = await supabase.from("follows").select("following_id").eq("follower_id", currentUserId)

  const followingSet = new Set(followingIds?.map((f) => f.following_id) || [])
  const filteredUsers = suggestedUsers?.filter((user) => !followingSet.has(user.id)) || []

  return (
    <Card className="border-banana/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-banana flex items-center">
          <span className="mr-2">✨</span>
          People You May Know
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.slice(0, 3).map((user) => <UserCard key={user.id} user={user} currentUserId={currentUserId} />)
        ) : (
          <p className="text-sm text-cream-dark/70 text-center py-4">No suggestions available</p>
        )}
      </CardContent>
    </Card>
  )
}
