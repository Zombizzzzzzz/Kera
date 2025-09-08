import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { SearchInterface } from "@/components/search-interface"
import { TrendingSection } from "@/components/trending-section"
import { SuggestedUsers } from "@/components/suggested-users"

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type } = await searchParams
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

  return (
    <div className="min-h-screen bg-cream">
      <Navigation user={user} profile={profile} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Search Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-banana mb-2">Discover Kera</h1>
              <p className="text-cream-dark">Find amazing people and posts in the banana-verse</p>
            </div>

            <SearchInterface initialQuery={q} initialType={type} currentUserId={user.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TrendingSection />
            <SuggestedUsers currentUserId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
