"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SearchResults } from "@/components/search-results"
import { useRouter } from "next/navigation"
import { Search, Users, FileText } from "lucide-react"

interface SearchInterfaceProps {
  initialQuery?: string
  initialType?: string
  currentUserId: string
}

export function SearchInterface({ initialQuery = "", initialType = "all", currentUserId }: SearchInterfaceProps) {
  const [query, setQuery] = useState(initialQuery)
  const [searchType, setSearchType] = useState(initialType)
  const [results, setResults] = useState<any>({ users: [], posts: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(!!initialQuery)

  const router = useRouter()
  const supabase = createClient()

  const performSearch = async (searchQuery: string, type: string) => {
    if (!searchQuery.trim()) {
      setResults({ users: [], posts: [] })
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const searchResults: any = { users: [], posts: [] }

      if (type === "all" || type === "users") {
        // Search users
        const { data: users } = await supabase
          .from("profiles")
          .select("*")
          .or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`)
          .neq("id", currentUserId)
          .limit(10)

        searchResults.users = users || []
      }

      if (type === "all" || type === "posts") {
        // Search posts
        const { data: posts } = await supabase
          .from("posts")
          .select(`
            *,
            profiles:user_id (
              id,
              username,
              full_name,
              avatar_url
            ),
            reactions (
              id,
              user_id,
              type
            )
          `)
          .ilike("content", `%${searchQuery}%`)
          .order("created_at", { ascending: false })
          .limit(20)

        searchResults.posts = posts || []
      }

      setResults(searchResults)
    } catch (error) {
      console.error("Search error:", error)
      setResults({ users: [], posts: [] })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query, searchType)

    // Update URL
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (searchType !== "all") params.set("type", searchType)
    router.push(`/search?${params.toString()}`)
  }

  // Perform initial search if query exists
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, initialType)
    }
  }, [initialQuery, initialType])

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card className="border-banana/20 shadow-sm">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream-dark/50 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search for users, posts, or topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 border-banana/30 focus:border-banana"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant={searchType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("all")}
                className={
                  searchType === "all"
                    ? "bg-banana-gradient text-white"
                    : "border-banana/30 text-banana hover:bg-banana/10"
                }
              >
                All
              </Button>
              <Button
                type="button"
                variant={searchType === "users" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("users")}
                className={
                  searchType === "users"
                    ? "bg-banana-gradient text-white"
                    : "border-banana/30 text-banana hover:bg-banana/10"
                }
              >
                <Users className="w-4 h-4 mr-1" />
                Users
              </Button>
              <Button
                type="button"
                variant={searchType === "posts" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("posts")}
                className={
                  searchType === "posts"
                    ? "bg-banana-gradient text-white"
                    : "border-banana/30 text-banana hover:bg-banana/10"
                }
              >
                <FileText className="w-4 h-4 mr-1" />
                Posts
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="w-full bg-banana-gradient hover:bg-banana-600 text-white font-semibold"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      <SearchResults
        results={results}
        isLoading={isLoading}
        hasSearched={hasSearched}
        query={query}
        searchType={searchType}
        currentUserId={currentUserId}
      />
    </div>
  )
}
