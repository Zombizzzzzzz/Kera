import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { ProfileHeader } from "@/components/profile-header"
import { ProfilePosts } from "@/components/profile-posts"
import { FollowButton } from "@/components/follow-button"

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  // Get current user's profile
  const { data: currentUserProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get profile being viewed
  const { data: viewedProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single()

  if (profileError || !viewedProfile) {
    return (
      <div className="min-h-screen bg-cream">
        <Navigation user={user} profile={currentUserProfile} />
        <main className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4">🍌</div>
          <h1 className="text-2xl font-bold text-banana mb-2">Profile Not Found</h1>
          <p className="text-cream-dark">This user doesn't exist or has been removed.</p>
        </main>
      </div>
    )
  }

  // Get follower/following counts
  const { count: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", viewedProfile.id)

  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", viewedProfile.id)

  // Check if current user follows this profile
  const { data: followRelation } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", viewedProfile.id)
    .single()

  const isOwnProfile = user.id === viewedProfile.id
  const isFollowing = !!followRelation

  return (
    <div className="min-h-screen bg-cream">
      <Navigation user={user} profile={currentUserProfile} />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <ProfileHeader
          profile={viewedProfile}
          followersCount={followersCount || 0}
          followingCount={followingCount || 0}
          isOwnProfile={isOwnProfile}
        />

        {!isOwnProfile && (
          <div className="flex justify-center">
            <FollowButton
              targetUserId={viewedProfile.id}
              currentUserId={user.id}
              isFollowing={isFollowing}
              targetUsername={viewedProfile.username}
            />
          </div>
        )}

        <ProfilePosts userId={viewedProfile.id} currentUserId={user.id} />
      </main>
    </div>
  )
}
