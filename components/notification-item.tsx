"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

interface NotificationItemProps {
  notification: any
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const [isRead, setIsRead] = useState(!!notification.read_at)
  const router = useRouter()
  const supabase = createClient()

  const markAsRead = async () => {
    if (isRead) return

    try {
      await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", notification.id)
      setIsRead(true)
      router.refresh()
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "follow":
        return "👥"
      case "reaction":
        return "🍌"
      case "message":
        return "💬"
      default:
        return "🔔"
    }
  }

  const getNotificationLink = () => {
    switch (notification.type) {
      case "follow":
        return `/profile/${notification.related_user?.username}`
      case "reaction":
        return `/feed` // Could be enhanced to link to specific post
      case "message":
        return `/messages/${notification.related_user?.id}`
      default:
        return "/notifications"
    }
  }

  return (
    <Link href={getNotificationLink()} onClick={markAsRead}>
      <Card
        className={`border-banana/20 hover:border-banana/40 transition-banana cursor-pointer ${
          !isRead ? "bg-banana/5 border-banana/30" : ""
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">{getNotificationIcon(notification.type)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`font-semibold ${!isRead ? "text-cream-dark" : "text-cream-dark/80"}`}>
                  {notification.title}
                </h4>
                <span className="text-xs text-cream-dark/70">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </span>
              </div>

              <p className={`text-sm mt-1 ${!isRead ? "text-cream-dark" : "text-cream-dark/70"}`}>
                {notification.message}
              </p>

              {notification.related_user && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-6 h-6 bg-banana-gradient rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {notification.related_user.display_name?.charAt(0) || "U"}
                  </div>
                  <span className="text-xs text-banana">@{notification.related_user.username}</span>
                </div>
              )}

              {notification.related_post && (
                <div className="mt-2 p-2 bg-cream rounded text-xs text-cream-dark/70 line-clamp-2">
                  "{notification.related_post.content}"
                </div>
              )}
            </div>

            {!isRead && <div className="w-2 h-2 bg-banana rounded-full mt-2"></div>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
