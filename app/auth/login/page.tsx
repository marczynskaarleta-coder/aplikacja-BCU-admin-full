'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('Email nie został potwierdzony. Sprawdź swoją skrzynkę pocztową.')
      } else if (error.message.includes('Invalid login credentials')) {
        setError('Nieprawidłowy email lub hasło')
      } else {
        setError('Wystąpił błąd podczas logowania: ' + error.message)
      }
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/bcu-logo.png"
              alt="BCU Logo"
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <span className="font-black text-xl">BCU Spedycja</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót
            </Button>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]">
          <CardHeader className="text-center border-b-2 border-foreground bg-primary">
            <CardTitle className="text-2xl font-black">Zaloguj się</CardTitle>
            <CardDescription className="text-foreground/80">
              Wpisz swoje dane, aby kontynuować naukę
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border-2 border-destructive text-destructive p-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="twoj@email.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-2 border-foreground"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Hasło</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-2 border-foreground"
                />
              </Field>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                disabled={loading}
              >
                {loading ? <Spinner className="w-5 h-5" /> : 'Zaloguj się'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link href="/auth/forgot-password" className="text-muted-foreground hover:text-foreground underline">
                Nie pamiętasz hasła?
              </Link>
            </div>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Nie masz konta? </span>
              <Link href="/auth/sign-up" className="font-bold underline hover:text-primary">
                Zarejestruj się
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-foreground py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <Link href="/polityka-prywatnosci" className="hover:underline">
            Polityka prywatności
          </Link>
          {' · '}
          <Link href="/regulamin" className="hover:underline">
            Regulamin
          </Link>
        </div>
      </footer>
    </div>
  )
}
