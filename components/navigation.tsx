"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Bell, Menu, X } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import Image from "next/image"

interface NavigationProps {
  user: User
  profile: any
}

export function Navigation({ user, profile }: NavigationProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    <nav className="bg-white border-b border-banana/20 sticky top-0 z-50 sm:px-6">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/feed" className="flex items-center space-x-3 hover:opacity-80 transition-banana">
          <div className="text-2xl">🍌</div>
          <h1 className="text-xl font-bold text-banana">Kera</h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/feed" className="text-cream-dark hover:text-banana transition-banana font-medium">Feed</Link>
          <Link href="/search" className="text-cream-dark hover:text-banana transition-banana font-medium">Search</Link>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-5">
            <Link href="/messages" className="text-cream-dark hover:text-banana transition-banana font-medium">
              <Image src="/4639762.webp" alt="messages" height={30} width={30} />
            </Link>
            <Link href="/notifications" className="relative text-cream-dark hover:text-banana transition-banana font-medium">
              <Bell className="w-7 h-7" />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-banana text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </Link>
          </div>

          {/* Profile + Sign Out */}
          <div className="hidden md:flex items-center space-x-4">
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

          {/* Mobile menu button */}
          <button
            className="md:hidden text-cream-dark hover:text-banana transition-banana"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 border-t border-banana/20 bg-white">
          <Link href="/feed" className="block text-cream-dark hover:text-banana font-medium">Feed</Link>
          <Link href="/search" className="block text-cream-dark hover:text-banana font-medium">Search</Link>
          <Link href="/messages" className="block text-cream-dark hover:text-banana font-medium">Messages</Link>
          <Link href="/notifications" className="block text-cream-dark hover:text-banana font-medium">
            Notifications {unreadCount > 0 && `(${unreadCount > 9 ? "9+" : unreadCount})`}
          </Link>
          <Link
            href={`/profile/${profile?.username || user.id}`}
            className="block text-cream-dark hover:text-banana font-medium"
          >
            {profile?.display_name || "User"}'s Profile
          </Link>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="border-banana/30 text-banana hover:bg-banana/10 bg-transparent w-full"
          >
            Sign Out
          </Button>
        </div>
      )}
    </nav>
  )
}
