"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/feed`,
          data: {
            username: username || `user_${Date.now()}`,
            display_name: displayName || "Kera User",
            bio: "New to Kera! 🍌",
          },
        },
      })
      if (error) throw error
      router.push("/auth/check-email")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-banana/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">🍌</div>
            <CardTitle className="text-2xl text-banana font-bold">Join Kera</CardTitle>
            <CardDescription className="text-cream-dark">Create your banana-themed social account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cream-dark">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-banana/30 focus:border-banana"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-cream-dark">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="your_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-banana/30 focus:border-banana"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-cream-dark">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="border-banana/30 focus:border-banana"
                />
             <br/> 
             <Label className="text-cream-dark">
                  Gender : 
                </Label>
                <label className="text-cream-dark">
    <input type="radio" name="fruit" value="banana"/>
    With
  </label><br/>

  <label className="text-cream-dark">
    <input type="radio" name="fruit" value="apple"/>
    Without
  </label><br/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-cream-dark">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-banana/30 focus:border-banana"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-cream-dark">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-banana/30 focus:border-banana"
                />
              </div>
              {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
              <Button
                type="submit"
                className="w-full bg-banana-gradient hover:bg-banana-600 text-white font-semibold py-2 px-4 rounded-lg transition-banana"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-cream-dark">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-banana hover:text-banana-600 font-semibold underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
