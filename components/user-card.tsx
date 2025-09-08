"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface UserCardProps {
  user: any
  currentUserId: string
}

export function UserCard({ user, currentUserId }: UserCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkFollowStatus()
  }, [])

  const checkFollowStatus = async () => {
    const { data } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", currentUserId)
      .eq("following_id", user.id)
      .single()

    setIsFollowing(!!data)
  }

  const handleFollow = async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      if (isFollowing) {
        await supabase.from("follows").delete().eq("follower_id", currentUserId).eq("following_id", user.id)
        setIsFollowing(false)
      } else {
        await supabase.from("follows").insert({
          follower_id: currentUserId,
          following_id: user.id,
        })
        setIsFollowing(true)

        // Create notification
        await supabase.from("notifications").insert({
          user_id: user.id,
          type: "follow",
          title: "New Follower",
          message: `Someone started following you!`,
          related_user_id: currentUserId,
        })
      }
    } catch (error) {
      console.error("Error handling follow:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-banana/10 hover:border-banana/30 transition-banana">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Link
            href={`/profile/${user.username}`}
            className="flex items-center space-x-3 flex-1 hover:opacity-80 transition-banana"
          >
            <div className="w-12 h-12 bg-banana-gradient rounded-full flex items-center justify-center text-white font-semibold">
              {user.display_name?.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-cream-dark">{user.display_name}</h4>
              <p className="text-sm text-banana">@{user.username}</p>
              {user.bio && <p className="text-sm text-cream-dark/70 mt-1 line-clamp-2">{user.bio}</p>}
            </div>
          </Link>

          <Button
            onClick={handleFollow}
            disabled={isLoading}
            size="sm"
            className={
              isFollowing ? "bg-leaf hover:bg-leaf/80 text-white" : "bg-banana-gradient hover:bg-banana-600 text-white"
            }
          >
            {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
