"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface FollowButtonProps {
  targetUserId: string
  currentUserId: string
  isFollowing: boolean
  targetUsername: string
}

export function FollowButton({ targetUserId, currentUserId, isFollowing, targetUsername }: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [following, setFollowing] = useState(isFollowing)
  const router = useRouter()
  const supabase = createClient()

  const handleFollow = async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      if (following) {
        // Unfollow
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", targetUserId)

        if (error) throw error
        setFollowing(false)
      } else {
        // Follow
        const { error } = await supabase.from("follows").insert({
          follower_id: currentUserId,
          following_id: targetUserId,
        })

        if (error) throw error
        setFollowing(true)

        // Create notification
        await supabase.from("notifications").insert({
          user_id: targetUserId,
          type: "follow",
          title: "New Follower",
          message: `@${targetUsername} started following you!`,
          related_user_id: currentUserId,
        })
      }

      router.refresh()
    } catch (error) {
      console.error("Error handling follow:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      className={
        following
          ? "bg-leaf hover:bg-leaf/80 text-white font-semibold px-8"
          : "bg-banana-gradient hover:bg-banana-600 text-white font-semibold px-8"
      }
    >
      {isLoading ? "..." : following ? "Following" : "Follow"}
    </Button>
  )
}
