"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import Image from "next/image"

interface NavigationProps {
  user: User
  profile: any
}

export function Navigation({ user, profile }: NavigationProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchUnreadCount()
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .is("read_at", null)

      setUnreadCount(count || 0)
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <nav className="bg-white border-b border-banana/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/feed" className="flex items-center space-x-3 hover:opacity-80 transition-banana">
              <div className="text-2xl">🍌</div>
              <h1 className="text-xl font-bold text-banana">Kera</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/feed" className="text-cream-dark hover:text-banana transition-banana font-medium">
              Feed
            </Link>
            <Link href="/search" className="text-cream-dark hover:text-banana transition-banana font-medium">
              Search
            </Link>
          
           
            
          </div>
         <div className="flex space-x-5">
             <Link href="/messages" className="text-cream-dark hover:text-banana transition-banana font-medium">
              <Image src="/4639762.webp" alt="messages" height={30} width={30}/>
            </Link>
           <Link
              href="/notifications"
              className="relative text-cream-dark hover:text-banana transition-banana font-medium"
            >
              <div className="flex items-center space-x-1">
                <Bell className="w-7 h-7" />
                
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-banana text-white text-xs rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </Link>
         </div>
          <div className="flex items-center space-x-4">
            <Link
              href={`/profile/${profile?.username || user.id}`}
              className="flex items-center space-x-2 hover:opacity-80 transition-banana"
            >
              <div className="w-8 h-8 bg-banana-gradient rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {profile?.display_name?.charAt(0) || user.email?.charAt(0)}
              </div>
              <span className="text-cream-dark font-medium">{profile?.display_name || "User"}</span>
            </Link>

            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-banana/30 text-banana hover:bg-banana/10 bg-transparent"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
