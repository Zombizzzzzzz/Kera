"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProfileHeaderProps {
  profile: any
  followersCount: number
  followingCount: number
  isOwnProfile: boolean
}

export function ProfileHeader({ profile, followersCount, followingCount, isOwnProfile }: ProfileHeaderProps) {
  return (
    <Card className="border-banana/20 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Profile Avatar */}
          <div className="w-24 h-24 bg-banana-gradient rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {profile.display_name?.charAt(0) || "U"}
          </div>

          {/* Profile Info */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-cream-dark">{profile.display_name}</h1>
            <p className="text-banana font-medium">@{profile.username}</p>
            {profile.bio && <p className="text-cream-dark max-w-md mx-auto leading-relaxed">{profile.bio}</p>}
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8 pt-4">
            <div className="text-center">
              <div className="text-xl font-bold text-banana">{profile.banana_count || 0}</div>
              <div className="text-sm text-cream-dark">Bananas</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-banana">{followersCount}</div>
              <div className="text-sm text-cream-dark">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-banana">{followingCount}</div>
              <div className="text-sm text-cream-dark">Following</div>
            </div>
          </div>

          {/* Edit Profile Button for own profile */}
          {isOwnProfile && (
            <div className="pt-4">
              <Link href="/profile/edit">
                <Button variant="outline" className="border-banana/30 text-banana hover:bg-banana/10 bg-transparent">
                  Edit Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
