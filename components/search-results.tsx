"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostCard } from "@/components/post-card"
import { UserCard } from "@/components/user-card"

interface SearchResultsProps {
  results: { users: any[]; posts: any[] }
  isLoading: boolean
  hasSearched: boolean
  query: string
  searchType: string
  currentUserId: string
}

export function SearchResults({
  results,
  isLoading,
  hasSearched,
  query,
  searchType,
  currentUserId,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <Card className="border-banana/20 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-cream-dark">Searching the banana-verse...</p>
        </CardContent>
      </Card>
    )
  }

  if (!hasSearched) {
    return (
      <Card className="border-banana/20 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🍌</div>
          <h3 className="text-xl font-semibold text-banana mb-2">Start Your Discovery</h3>
          <p className="text-cream-dark">Search for users, posts, or topics to explore the Kera community</p>
        </CardContent>
      </Card>
    )
  }

  const hasUsers = results.users.length > 0
  const hasPosts = results.posts.length > 0
  const hasResults = hasUsers || hasPosts

  if (!hasResults) {
    return (
      <Card className="border-banana/20 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-banana mb-2">No Results Found</h3>
          <p className="text-cream-dark">
            No {searchType === "all" ? "results" : searchType} found for "{query}". Try different keywords or check your
            spelling.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Users Results */}
      {hasUsers && (searchType === "all" || searchType === "users") && (
        <Card className="border-banana/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-banana flex items-center">
              <span className="mr-2">👥</span>
              Users ({results.users.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.users.map((user) => (
              <UserCard key={user.id} user={user} currentUserId={currentUserId} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Posts Results */}
      {hasPosts && (searchType === "all" || searchType === "posts") && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-banana flex items-center">
            <span className="mr-2">📝</span>
            Posts ({results.posts.length})
          </h2>
          {results.posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  )
}
