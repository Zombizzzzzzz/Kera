import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { NotificationsList } from "@/components/notifications-list"
import { NotificationActions } from "@/components/notification-actions"

export default async function NotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get current user's profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get notifications count
  const { count: totalCount } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("read_at", null)

  return (
    <div className="min-h-screen bg-cream">
      <Navigation user={user} profile={profile} />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-banana">Notifications</h1>
            <p className="text-cream-dark">
              {unreadCount || 0} unread of {totalCount || 0} total notifications
            </p>
          </div>
          <NotificationActions userId={user.id} />
        </div>

        <NotificationsList userId={user.id} />
      </main>
    </div>
  )
}
