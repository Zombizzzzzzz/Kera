"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CheckCheck, Trash2 } from "lucide-react"

interface NotificationActionsProps {
  userId: string
}

export function NotificationActions({ userId }: NotificationActionsProps) {
  const [isMarkingRead, setIsMarkingRead] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const markAllAsRead = async () => {
    if (isMarkingRead) return

    setIsMarkingRead(true)

    try {
      await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("user_id", userId)
        .is("read_at", null)

      router.refresh()
    } catch (error) {
      console.error("Error marking all as read:", error)
    } finally {
      setIsMarkingRead(false)
    }
  }

  const clearAllNotifications = async () => {
    if (isClearing) return

    const confirmed = window.confirm("Are you sure you want to delete all notifications? This action cannot be undone.")
    if (!confirmed) return

    setIsClearing(true)

    try {
      await supabase.from("notifications").delete().eq("user_id", userId)
      router.refresh()
    } catch (error) {
      console.error("Error clearing notifications:", error)
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={markAllAsRead}
        disabled={isMarkingRead}
        variant="outline"
        size="sm"
        className="border-banana/30 text-banana hover:bg-banana/10 bg-transparent"
      >
        <CheckCheck className="w-4 h-4 mr-1" />
        {isMarkingRead ? "Marking..." : "Mark All Read"}
      </Button>

      <Button
        onClick={clearAllNotifications}
        disabled={isClearing}
        variant="outline"
        size="sm"
        className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
      >
        <Trash2 className="w-4 h-4 mr-1" />
        {isClearing ? "Clearing..." : "Clear All"}
      </Button>
    </div>
  )
}
