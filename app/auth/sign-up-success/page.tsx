'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SignUpSuccessPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const handleResendEmail = async () => {
    setIsResending(true)
    setResendMessage('')
    
    const supabase = createClient()
    const email = localStorage.getItem('pendingVerificationEmail')
    
    if (!email) {
      setResendMessage('Nie znaleziono adresu email. Sprobuj zarejestrować się ponownie.')
      setIsResending(false)
      return
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    })

    if (error) {
      setResendMessage('Nie udało się wysłać emaila. Sprobuj ponownie za chwilę.')
    } else {
      setResendMessage('Email został wysłany ponownie! Sprawdź swoją skrzynkę.')
    }
    
    setIsResending(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/bcu-logo.png"
              alt="BCU Logo"
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <span className="font-black text-xl text-foreground">BCU Spedycja</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-border">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-primary mx-auto mb-6 flex items-center justify-center">
              <Mail className="w-10 h-10 text-primary-foreground" />
            </div>
            
            <h1 className="text-2xl font-black text-foreground mb-4">
              Sprawdź swoją skrzynkę email
            </h1>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Wysłaliśmy link potwierdzający na Twój adres email. 
              Kliknij w link, aby aktywować konto i rozpocząć naukę.
            </p>

            <div className="bg-muted p-4 border-2 border-border mb-6">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Wskazowka:</strong> Jeśli nie widzisz emaila, 
                sprawdź folder spam lub poczekaj kilka minut.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                variant="outline"
                className="w-full border-2 border-border font-bold"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Wysyłanie...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Wyślij email ponownie
                  </>
                )}
              </Button>

              {resendMessage && (
                <p className={`text-sm ${resendMessage.includes('wysłany') ? 'text-green-600' : 'text-destructive'}`}>
                  {resendMessage}
                </p>
              )}

              <Link href="/auth/login">
                <Button variant="ghost" className="w-full font-bold">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Powrot do logowania
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-border py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 Beskidzkie Centrum Umiejętności w Spedycji
        </div>
      </footer>
    </div>
  )
}
