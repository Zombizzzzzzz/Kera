import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { EditProfileForm } from "@/components/edit-profile-form"

export default async function EditProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-cream">
      <Navigation user={user} profile={profile} />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-banana mb-2">Edit Profile</h1>
          <p className="text-cream-dark">Update your Kera profile information</p>
        </div>

        <EditProfileForm profile={profile} userId={user.id} />
      </main>
    </div>
  )
}
