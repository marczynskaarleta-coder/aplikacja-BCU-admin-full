import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'BCU Spedycja',
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo + nazwa */}
      <div className="flex flex-col items-center gap-4 mb-12">
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
            Platforma edukacyjna
          </p>
        </div>
      </div>

      {/* Przyciski */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link href="/auth/login" className="w-full">
          <Button
            className="w-full h-12 text-base font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Zaloguj się
          </Button>
        </Link>
        <Link href="/auth/sign-up" className="w-full">
          <Button
            variant="outline"
            className="w-full h-12 text-base font-bold border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            Zarejestruj się
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-xs text-muted-foreground space-x-3">
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
