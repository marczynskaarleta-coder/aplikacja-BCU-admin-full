'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const getErrorMessage = () => {
    if (errorDescription?.includes('expired') || error === 'otp_expired') {
      return {
        title: 'Link wygasł',
        description: 'Link aktywacyjny wygasł. Linki są ważne przez 24 godziny. Zarejestruj się ponownie lub poproś o nowy link.',
        showResend: true,
      }
    }
    if (error === 'access_denied') {
      return {
        title: 'Odmowa dostępu',
        description: 'Nie udało się zweryfikować Twojego konta. Spróbuj zarejestrować się ponownie.',
        showResend: true,
      }
    }
    return {
      title: 'Błąd autoryzacji',
      description: errorDescription || 'Wystąpił nieoczekiwany błąd podczas autoryzacji.',
      showResend: false,
    }
  }

  const errorInfo = getErrorMessage()

  return (
    <Card className="w-full max-w-md border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-destructive mx-auto mb-4 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-destructive-foreground" />
        </div>
        <h2 className="text-2xl font-black mb-2">{errorInfo.title}</h2>
        <p className="text-muted-foreground mb-6">
          {errorInfo.description}
        </p>
        
        <div className="space-y-3">
          {errorInfo.showResend && (
            <Link href="/auth/sign-up" className="block">
              <Button 
                variant="outline"
                className="w-full h-12 font-bold border-2 border-foreground"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Zarejestruj się ponownie
              </Button>
            </Link>
          )}
          <Link href="/auth/login" className="block">
            <Button className="w-full h-12 font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              Przejdź do logowania
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Wróć na stronę główną
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AuthErrorPage() {
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
        <Suspense fallback={
          <Card className="w-full max-w-md border-2 border-foreground p-8 text-center">
            <p>Ładowanie...</p>
          </Card>
        }>
          <ErrorContent />
        </Suspense>
      </main>
    </div>
  )
}
