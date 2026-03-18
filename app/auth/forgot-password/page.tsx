'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    })

    if (error) {
      setError('Nie udało się wysłać emaila. Sprawdź adres i spróbuj ponownie.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b-2 border-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/bcu-logo.png" alt="BCU Logo" width={48} height={48} className="w-12 h-12" />
            <span className="font-black text-xl">BCU Spedycja</span>
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Powrót
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]">
          {sent ? (
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 border-2 border-green-600 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-green-600" />
              </div>
              <h2 className="text-2xl font-black mb-2">Sprawdź email</h2>
              <p className="text-muted-foreground mb-6">
                Wysłaliśmy link do resetu hasła na adres <strong className="text-foreground">{email}</strong>.
                Sprawdź też folder spam.
              </p>
              <Link href="/auth/login">
                <Button className="w-full h-11 font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                  Wróć do logowania
                </Button>
              </Link>
            </CardContent>
          ) : (
            <>
              <CardHeader className="text-center border-b-2 border-foreground bg-primary">
                <CardTitle className="text-2xl font-black">Resetuj hasło</CardTitle>
                <CardDescription className="text-foreground/80">
                  Wyślemy link resetujący na Twój email
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-destructive/10 border-2 border-destructive text-destructive p-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold">Adres email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="twoj@email.pl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-2 border-foreground"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-base font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Wyślij link resetujący'}
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  <Link href="/auth/login" className="font-bold underline hover:text-primary">
                    Wróć do logowania
                  </Link>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </main>
    </div>
  )
}
