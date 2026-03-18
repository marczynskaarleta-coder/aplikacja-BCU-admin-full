import { requireAuth } from '@/lib/auth/helpers'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ProfileForm } from './_components/profile-form'
import { PasswordForm } from './_components/password-form'

export const metadata = { title: 'Profil - BCU Spedycja' }

export default async function ProfilePage() {
  const { user, profile } = await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-2 border-foreground sticky top-0 z-50 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Powrót</span>
            </Link>
            <Link href="/dashboard">
              <Image src="/images/bcu-logo.png" alt="BCU Logo" width={40} height={40} className="w-10 h-10" />
            </Link>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-xl">
        <h1 className="text-3xl font-black mb-8">Twój profil</h1>

        <div className="space-y-6">
          {/* Avatar + email info */}
          <div className="flex items-center gap-4 p-6 border-2 border-foreground">
            <div className="w-16 h-16 bg-primary flex items-center justify-center font-black text-primary-foreground text-2xl shrink-0">
              {(profile?.first_name?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()}
            </div>
            <div>
              <p className="font-black text-lg">
                {profile?.first_name
                  ? `${profile.first_name} ${profile.last_name ?? ''}`.trim()
                  : 'Użytkownik'}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Konto od {new Date(user.created_at).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          {/* Update name */}
          <ProfileForm
            userId={user.id}
            firstName={profile?.first_name ?? ''}
            lastName={profile?.last_name ?? ''}
          />

          {/* Change password */}
          <PasswordForm />
        </div>
      </main>
    </div>
  )
}
