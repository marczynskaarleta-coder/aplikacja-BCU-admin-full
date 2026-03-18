import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { BookOpen, Brain, TrendingUp } from 'lucide-react'

export const metadata = {
  title: 'BCU Spedycja - Platforma Edukacyjna',
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">

      {/* Logo + nazwa */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <Image
          src="/images/bcu-logo.png"
          alt="BCU Spedycja"
          width={80}
          height={80}
          className="w-20 h-20"
          priority
        />
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight">BCU Spedycja</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Branżowe Centrum Umiejętności w Andrychowie
          </p>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-center text-base font-medium max-w-xs mb-8 leading-relaxed">
        Przygotuj się do egzaminów i kursów zawodowych z zakresu spedycji, transportu i logistyki.
      </p>

      {/* Cechy */}
      <div className="flex flex-col gap-3 w-full max-w-xs mb-8">
        <div className="flex items-center gap-3 px-4 py-3 border-2 border-foreground bg-muted/30">
          <div className="p-1.5 bg-primary shrink-0">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">Moduły tematyczne z materiałami</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 border-2 border-foreground bg-muted/30">
          <div className="p-1.5 bg-primary shrink-0">
            <Brain className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">Quizy i powtórki pytań egzaminacyjnych</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 border-2 border-foreground bg-muted/30">
          <div className="p-1.5 bg-primary shrink-0">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">Śledzenie postępów i statystyki</span>
        </div>
      </div>

      {/* Przyciski */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link href="/auth/login" className="w-full">
          <Button className="w-full h-12 text-base font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            Zaloguj się
          </Button>
        </Link>
        <Link href="/auth/sign-up" className="w-full">
          <Button variant="outline" className="w-full h-12 text-base font-bold border-2 border-foreground hover:bg-foreground hover:text-background transition-colors">
            Zarejestruj się
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-xs text-muted-foreground space-x-3">
        <Link href="/polityka-prywatnosci" className="hover:underline">
          Polityka prywatności
        </Link>
        <span>·</span>
        <Link href="/regulamin" className="hover:underline">
          Regulamin
        </Link>
      </div>
    </div>
  )
}
