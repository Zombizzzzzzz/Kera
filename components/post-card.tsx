'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle, Share, MoreHorizontal } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: {
    id: string
    content: string
    image_url: string | null
    banana_count: number
    created_at: string
    user_id: string
    profiles: {
      username: string
      full_name: string | null
      avatar_url: string | null
    }
  }
  currentUserId?: string
  onReaction?: (postId: string, hasReacted: boolean) => void
}

export function PostCard({ post, currentUserId, onReaction }: PostCardProps) {
  const [isReacting, setIsReacting] = useState(false)
  const [hasReacted, setHasReacted] = useState(false)
  const [reactionCount, setReactionCount] = useState(post.banana_count)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleReaction = async () => {
    if (!currentUserId || isReacting) return
    setIsReacting(true)

    try {
      if (hasReacted) {
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', currentUserId)

        if (!error) {
          setHasReacted(false)
          setReactionCount(prev => prev - 1)
        }
      } else {
        const { error } = await supabase.from('reactions').insert({
          post_id: post.id,
          user_id: currentUserId,
          type: 'banana',
        })

        if (!error) {
          setHasReacted(true)
          setReactionCount(prev => prev + 1)
        }
      }
      if (onReaction) onReaction(post.id, !hasReacted)
    } catch (error) {
      console.error('Error handling reaction:', error)
    } finally {
      setIsReacting(false)
    }
  }

  return (
    <Card className="border-banana-200 bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        {/* Avatar + post content */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 mb-2 sm:mb-0">
            <AvatarImage
              src={post.profiles.avatar_url || '/placeholder.svg'}
              alt={post.profiles.username}
            />
            <AvatarFallback className="bg-banana-100 text-banana-800">
              {post.profiles.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap">
              <div className="flex flex-wrap items-center space-x-1 sm:space-x-2">
                <h3 className="font-semibold text-banana-900 text-sm sm:text-base">
                  {post.profiles.full_name || post.profiles.username}
                </h3>
                <span className="text-gray-500 text-xs sm:text-sm">
                  @{post.profiles.username}
                </span>
                <span className="text-gray-400 hidden sm:inline">·</span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="mt-2">
              <p className="text-gray-900 whitespace-pre-wrap text-sm sm:text-base">
                {post.content}
              </p>

              {post.image_url && (
                <div className="mt-3">
                  <img
                    src={post.image_url || '/placeholder.svg'}
                    alt="Post image"
                    className="rounded-lg w-full max-h-[400px] object-cover border border-banana-200"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-banana-100">
              <div className="flex items-center justify-around sm:justify-start w-full sm:w-auto space-x-4 sm:space-x-6">
                {/* React (banana) */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReaction}
                  disabled={isReacting}
                  className={`flex items-center space-x-1 sm:space-x-2 hover:bg-banana-50 ${
                    hasReacted ? 'text-banana-600' : 'text-gray-500'
                  }`}
                >
                  <span className="text-base sm:text-lg">🍌</span>
                  <span className="text-xs sm:text-sm font-medium">
                    {reactionCount}
                  </span>
                </Button>

                {/* Reply */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:bg-banana-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Reply</span>
                </Button>

                {/* Share */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:bg-banana-50"
                >
                  <Share className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Share</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
