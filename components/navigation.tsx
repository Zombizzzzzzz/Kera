"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Bell, Menu, X, Home, Search, MessageCircle } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import Image from "next/image"

/** ---------------- Page Loading Bar ---------------- */
export function PageLoadingBar() {
  const [loading, setLoading] = useState(false)
  const [width, setWidth] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    setWidth(0)
    let start = 0
    const interval = setInterval(() => {
      start += Math.random() * 10
      if (start >= 90) start = 90
      setWidth(start)
    }, 100)
    const finishTimeout = setTimeout(() => {
      setWidth(100)
      setTimeout(() => {
        setLoading(false)
        setWidth(0)
      }, 300)
    }, 500)
    return () => {
      clearInterval(interval)
      clearTimeout(finishTimeout)
    }
  }, [pathname])

  if (!loading) return null

  return (
    <div
      className="fixed top-0 left-0 h-[3px] bg-gray-400 z-50"
      style={{ width: `${width}%`, transition: "width 0.1s linear" }}
    ></div>
  )
}

/** ---------------- Navigation Component ---------------- */
interface NavigationProps {
  user: User
  profile: any
}

export function Navigation({ user, profile }: NavigationProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
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
      {/* Loading bar */}
      <PageLoadingBar />

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo + links */}
        <div className="flex items-center space-x-6">
          <Link href="/feed" className="flex items-center space-x-2 hover:opacity-80 transition-banana">
            <div className="text-2xl">🍌</div>
            <h1 className="text-xl font-bold text-banana">Kera</h1>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/feed" className="text-cream-dark hover:text-banana font-medium transition-banana">Feed</Link>
            <Link href="/search" className="text-cream-dark hover:text-banana font-medium transition-banana">Search</Link>
          </div>
        </div>

        {/* Right: Icons + profile */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/messages" className="text-cream-dark hover:text-banana transition-banana">
            <Image src="/4639762.webp" alt="messages" height={30} width={30} />
          </Link>

          <Link href="/notifications" className="relative text-cream-dark hover:text-banana transition-banana">
            <Bell className="w-7 h-7" />
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-banana text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
          </Link>

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

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-cream-dark hover:text-banana transition-banana"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform z-50
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-banana/20">
          <span className="text-xl font-bold text-banana">Menu</span>
          <button onClick={() => setDrawerOpen(false)}>
            <X className="w-6 h-6 text-cream-dark" />
          </button>
        </div>
        <div className="flex flex-col px-4 py-3 space-y-4">
          <div className="hidden md:flex items-center space-x-4">
  <Link href="/feed" className="flex items-center space-x-1 text-cream-dark hover:text-banana transition-banana">
    <Home className="w-5 h-5" /> 
    <span>Feed</span>
  </Link>
  <Link href="/search" className="flex items-center space-x-1 text-cream-dark hover:text-banana transition-banana">
    <Search className="w-5 h-5" />
    <span>Search</span>
  </Link>
</div>
          <Link href="/messages" className="flex items-center space-x-2 text-cream-dark hover:text-banana">
            <MessageCircle className="w-5 h-5" />
            <span>Messages</span>
          </Link>
          <Link href="/notifications" className="flex items-center space-x-2 text-cream-dark hover:text-banana relative">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <div className="absolute top-0 right-0 bg-banana text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
          </Link>
          <Link
            href={`/profile/${profile?.username || user.id}`}
            className="flex items-center space-x-2 text-cream-dark hover:text-banana"
          >
            <div className="w-6 h-6 bg-banana-gradient rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {profile?.display_name?.charAt(0) || user.email?.charAt(0)}
            </div>
            <span>Profile</span>
          </Link>

          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="border-banana/30 text-banana hover:bg-banana/10 bg-transparent mt-4"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}
    </nav>
  )
}
