'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków')
      return
    }
    if (password !== confirm) {
      setError('Hasła nie są identyczne')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Błąd zmiany hasła: ' + error.message)
      setLoading(false)
      return
    }

    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b-2 border-foreground">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/bcu-logo.png" alt="BCU Logo" width={48} height={48} className="w-12 h-12" />
            <span className="font-black text-xl">BCU Spedycja</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]">
          {done ? (
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 border-2 border-green-600 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-green-600" />
              </div>
              <h2 className="text-2xl font-black mb-2">Hasło zmienione!</h2>
              <p className="text-muted-foreground">Za chwilę zostaniesz przekierowany do aplikacji...</p>
            </CardContent>
          ) : (
            <>
              <CardHeader className="text-center border-b-2 border-foreground bg-primary">
                <CardTitle className="text-2xl font-black">Nowe hasło</CardTitle>
                <CardDescription className="text-foreground/80">
                  Wpisz nowe hasło do swojego konta
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
                    <Label htmlFor="password" className="font-bold">Nowe hasło</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 6 znaków"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-2 border-foreground pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm" className="font-bold">Powtórz hasło</Label>
                    <Input
                      id="confirm"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      className="border-2 border-foreground"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-base font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ustaw nowe hasło'}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </main>
    </div>
  )
}
