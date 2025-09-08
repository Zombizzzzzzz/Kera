import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-banana/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">📧</div>
            <CardTitle className="text-2xl text-banana font-bold">Check Your Email</CardTitle>
            <CardDescription className="text-cream-dark">We've sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-cream-dark">
              Please check your email and click the confirmation link to activate your Kera account.
            </p>
            <p className="text-xs text-cream-dark/70">
              Didn't receive the email? Check your spam folder or{" "}
              <Link href="/auth/signup" className="text-banana hover:text-banana-600 underline">
                try signing up again
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
