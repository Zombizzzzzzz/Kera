// lib/supabase/middleware.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

// Edge-safe Supabase client
const getSupabaseClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { fetch } }
  )

// Pages that should be publicly accessible (no redirect)
const PUBLIC_PATHS = ['/', '/auth/login', '/auth/signup']

// The function you can call anywhere in your app
export async function updateSession(request: NextRequest) {
  const supabase = getSupabaseClient()
  const path = request.nextUrl.pathname

  // Skip auth check for public pages
  if (PUBLIC_PATHS.includes(path)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('sb-access-token')?.value

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Check user session
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Everything ok, continue request
  const response = NextResponse.next()
  // Optionally pass user info to headers
  response.headers.set('x-user-id', data.user.id)
  return response
}

// Export as middleware for Vercel
export const middleware = updateSession

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
