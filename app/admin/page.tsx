import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, HelpCircle, BookOpen, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Panel Administratora - BCU Spedycja',
}

export default async function AdminPage() {
  await requireAdmin()
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalModules },
    { count: totalQuestions },
    { count: totalAnswers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('modules').select('*', { count: 'exact', head: true }),
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('user_answers').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Użytkownicy',  value: totalUsers     ?? 0, icon: Users,       href: '/admin/users' },
    { label: 'Moduły',       value: totalModules   ?? 0, icon: BookOpen,    href: '/admin/modules' },
    { label: 'Pytania',      value: totalQuestions ?? 0, icon: HelpCircle,  href: '/admin/quizzes' },
    { label: 'Odpowiedzi',   value: totalAnswers   ?? 0, icon: BarChart3,   href: null },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Przegląd platformy BCU Spedycja</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const card = (
            <Card className="border-2 border-foreground hover:border-primary transition-colors">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary shrink-0">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-black">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
          return stat.href
            ? <Link key={stat.label} href={stat.href}>{card}</Link>
            : <div key={stat.label}>{card}</div>
        })}
      </div>

      {/* Quick links */}
      <Card className="border-2 border-foreground">
        <CardHeader>
          <CardTitle className="font-black">Szybkie akcje</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Zarządzaj użytkownikami', href: '/admin/users',   desc: 'Role, status, konta' },
            { label: 'Zarządzaj modułami',      href: '/admin/modules', desc: 'Treści edukacyjne' },
            { label: 'Zarządzaj quizami',        href: '/admin/quizzes', desc: 'Pytania i odpowiedzi' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block p-4 border-2 border-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors group"
            >
              <div className="font-bold">{link.label}</div>
              <div className="text-sm text-muted-foreground group-hover:text-primary-foreground/70 mt-1">
                {link.desc}
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
