"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { MessageCircle, Search } from "lucide-react"

interface StartNewChatProps {
  currentUserId: string
}

export function StartNewChat({ currentUserId }: StartNewChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    try {
      const { data: users } = await supabase
        .from("profiles")
        .select("*")
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .neq("id", currentUserId)
        .limit(10)

      setSearchResults(users || [])
    } catch (error) {
      console.error("Error searching users:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const startChat = (userId: string) => {
    setIsOpen(false)
    router.push(`/messages/${userId}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-banana-gradient hover:bg-banana-600 text-white">
          <MessageCircle className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-banana">Start New Chat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream-dark/50 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                searchUsers(e.target.value)
              }}
              className="pl-10 border-banana/30 focus:border-banana"
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {isSearching ? (
              <div className="text-center py-4 text-cream-dark">Searching...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <Card
                  key={user.id}
                  className="border-banana/10 hover:border-banana/30 transition-banana cursor-pointer"
                  onClick={() => startChat(user.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-banana-gradient rounded-full flex items-center justify-center text-white font-semibold">
                        {user.display_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <h4 className="font-semibold text-cream-dark">{user.display_name}</h4>
                        <p className="text-sm text-banana">@{user.username}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : searchQuery ? (
              <div className="text-center py-4 text-cream-dark">No users found</div>
            ) : (
              <div className="text-center py-4 text-cream-dark">Search for users to start chatting</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
