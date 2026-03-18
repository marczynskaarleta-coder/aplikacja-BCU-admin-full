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
import { AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const handleResendEmail = async () => {
    setResending(true)
    setResendMessage('')
    
    const supabase = createClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      setResendMessage('Nie udało się wysłać emaila. Sprobuj ponownie za chwilę.')
    } else {
      setResendMessage('Email został wysłany ponownie!')
    }
    
    setResending(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków')
      setLoading(false)
      return
    }

    if (!acceptedTerms) {
      setError('Musisz zaakceptować regulamin i politykę prywatności')
      setLoading(false)
      return
    }

    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
          is_admin: false,
        },
      },
    })

    if (error) {
      setError(error.message === 'User already registered' 
        ? 'Użytkownik o tym adresie email już istnieje' 
        : 'Wystąpił błąd podczas rejestracji')
      setLoading(false)
      return
    }

    // If session exists (email confirmation disabled in Supabase), redirect to dashboard
    if (data.session) {
      router.push('/dashboard')
      router.refresh()
      return
    }

    // Otherwise show success message (email confirmation required)
    localStorage.setItem('pendingVerificationEmail', email)
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
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
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-success mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-success-foreground" />
              </div>
              <h2 className="text-2xl font-black mb-2">Sprawdź swoją skrzynkę!</h2>
              <p className="text-muted-foreground mb-4">
                Wysłaliśmy link aktywacyjny na adres <strong className="text-foreground">{email}</strong>. 
                Kliknij w link, aby aktywować konto.
              </p>
              <p className="text-sm text-muted-foreground mb-6 bg-muted p-3 border-2 border-border">
                <strong>Wskazówka:</strong> Sprawdź folder spam, jeśli nie widzisz emaila.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={handleResendEmail}
                  disabled={resending}
                  variant="outline"
                  className="w-full h-12 font-bold border-2 border-foreground"
                >
                  {resending ? <Spinner className="w-5 h-5" /> : 'Wyślij email ponownie'}
                </Button>
                {resendMessage && (
                  <p className={`text-sm text-center ${resendMessage.includes('ponownie!') ? 'text-green-600' : 'text-destructive'}`}>
                    {resendMessage}
                  </p>
                )}
                <Link href="/auth/login">
                  <Button className="w-full h-12 font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    Przejdź do logowania
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
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
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <Card className="w-full max-w-md border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]">
          <CardHeader className="text-center border-b-2 border-foreground bg-primary">
            <CardTitle className="text-2xl font-black">Załóż konto</CardTitle>
            <CardDescription className="text-foreground/80">
              Dołącz do platformy BCU Spedycja
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border-2 border-destructive text-destructive p-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">Imię</FieldLabel>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Jan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="border-2 border-foreground"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="lastName">Nazwisko</FieldLabel>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Kowalski"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="border-2 border-foreground"
                  />
                </Field>
              </div>

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
                  placeholder="Min. 6 znaków"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-2 border-foreground"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">Powtórz hasło</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-2 border-foreground"
                />
              </Field>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 border-2 border-foreground accent-primary"
                />
                <span className="text-sm text-muted-foreground">
                  Akceptuję{' '}
                  <Link href="/regulamin" className="underline text-foreground hover:text-primary">
                    regulamin
                  </Link>
                  {' '}oraz{' '}
                  <Link href="/polityka-prywatnosci" className="underline text-foreground hover:text-primary">
                    politykę prywatności
                  </Link>
                </span>
              </label>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                disabled={loading}
              >
                {loading ? <Spinner className="w-5 h-5" /> : 'Zarejestruj się'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Masz już konto? </span>
              <Link href="/auth/login" className="font-bold underline hover:text-primary">
                Zaloguj się
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
