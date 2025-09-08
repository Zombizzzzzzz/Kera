import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { NotificationItem } from "@/components/notification-item"

interface NotificationsListProps {
  userId: string
}

export async function NotificationsList({ userId }: NotificationsListProps) {
  const supabase = await createClient()

  // Get notifications with related user information
  const { data: notifications, error } = await supabase
    .from("notifications")
    .select(`
      *,
      related_user:related_user_id (
        id,
        displayname,
        full_name,
        avatar_url
      ),
      related_post:related_post_id (
        id,
        content
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Error fetching notifications:", error)
    return (
      <Card className="border-banana/20 shadow-sm">
        <CardContent className="p-8 text-center">
          <p className="text-cream-dark">Failed to load notifications. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Card className="border-banana/20 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-xl font-semibold text-banana mb-2">No Notifications Yet</h3>
          <p className="text-cream-dark">
            When someone follows you, reacts to your posts, or sends you a message, you'll see it here!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  )
}
