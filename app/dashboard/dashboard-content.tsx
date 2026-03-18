'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  Target,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  LogOut,
  Settings,
  BarChart3,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

interface DashboardContentProps {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    isAdmin: boolean
  }
  modules: Array<{
    id: string
    title: string
    description: string
    icon: string
    order_index: number
    completedCount: number
    totalCount: number
    progressPercent: number
  }>
  stats: {
    totalQuestions: number
    answeredQuestions: number
    correctAnswers: number
    reviewCount: number
  }
}

export function DashboardContent({ user, modules, stats }: DashboardContentProps) {
  const router = useRouter()
  const overallProgress = stats.totalQuestions > 0 
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
    : 0

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b-2 border-foreground">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/images/bcu-logo.png"
                alt="BCU Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="font-black text-lg">BCU Spedycja</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {user.isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="gap-2 border-2 border-foreground font-bold">
                    <Settings className="w-4 h-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="w-6 h-6 bg-primary flex items-center justify-center text-primary-foreground text-xs font-black">
                    {(user.firstName?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium">
                    {user.firstName || 'Profil'}
                  </span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Wyloguj</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-foreground text-background p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-background/60 text-sm font-medium mb-1">Witaj ponownie</p>
              <h1 className="text-3xl font-black">
                {user.firstName || 'Użytkowniku'} {user.lastName}
              </h1>
              <p className="text-background/70 mt-2">
                Kontynuuj naukę i przygotuj się do egzaminu!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-5xl font-black text-primary">{overallProgress}%</div>
                <div className="text-sm text-background/60">postępu</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-foreground">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary">
                  <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.correctAnswers}</p>
                  <p className="text-xs text-muted-foreground">Zaliczone pytania</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-foreground">
                  <Target className="w-5 h-5 text-background" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.totalQuestions}</p>
                  <p className="text-xs text-muted-foreground">Wszystkich pytań</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-foreground">
                  <RefreshCw className="w-5 h-5 text-background" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.reviewCount}</p>
                  <p className="text-xs text-muted-foreground">Do powtórki</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-foreground">
                  <BarChart3 className="w-5 h-5 text-background" />
                </div>
                <div>
                  <p className="text-2xl font-black">
                    {stats.answeredQuestions > 0 
                      ? Math.round((stats.correctAnswers / stats.answeredQuestions) * 100) 
                      : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">Skuteczność</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/quiz" className="block">
            <Card className="border-2 border-foreground hover:bg-primary hover:border-primary transition-colors group h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary group-hover:bg-primary-foreground">
                  <Zap className="w-6 h-6 text-primary-foreground group-hover:text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-lg group-hover:text-primary-foreground">Szybki Quiz</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/70">10 losowych pytań</p>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto group-hover:text-primary-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/review" className="block">
            <Card className="border-2 border-foreground hover:bg-foreground hover:text-background transition-colors group h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-foreground group-hover:bg-background">
                  <RefreshCw className="w-6 h-6 text-background group-hover:text-foreground" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Powtórki</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-background/70">
                    {stats.reviewCount} pytań czeka
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/results" className="block">
            <Card className="border-2 border-foreground hover:bg-foreground hover:text-background transition-colors group h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-foreground group-hover:bg-background">
                  <TrendingUp className="w-6 h-6 text-background group-hover:text-foreground" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Statystyki</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-background/70">Zobacz wyniki</p>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Modules */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black">Moduły</h2>
            <Link href="/modules">
              <Button variant="outline" size="sm" className="gap-2 border-2 border-foreground font-bold">
                Zobacz wszystkie
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {modules.length === 0 ? (
            <Card className="border-2 border-dashed border-muted-foreground">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-bold text-lg mb-2">Brak modułów</h3>
                <p className="text-muted-foreground">
                  Administrator musi dodać moduły do platformy.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.slice(0, 6).map((module, index) => (
                  <Link key={module.id} href={`/modules/${module.id}`}>
                    <Card className="border-2 border-foreground hover:border-primary hover:shadow-[4px_4px_0_0_hsl(var(--primary))] transition-all h-full group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex h-12 w-12 items-center justify-center bg-foreground text-background font-black text-lg group-hover:bg-primary">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <span className="text-xs font-bold text-muted-foreground">
                            {module.completedCount}/{module.totalCount} pytań
                          </span>
                        </div>
                        <CardTitle className="text-lg font-bold mt-3 group-hover:text-primary">
                          {module.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {module.description}
                        </p>
                        <Progress value={module.progressPercent} className="h-2" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          )}
        </div>

        {/* Progress Overview */}
        <Card className="border-2 border-foreground">
          <CardHeader>
            <CardTitle className="font-black flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Twój postęp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Ogólny postęp</span>
                  <span className="font-bold">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </div>
              <p className="text-sm text-muted-foreground">
                {overallProgress < 50 && "Dopiero zaczynasz - każdy krok przybliża Cię do celu!"}
                {overallProgress >= 50 && overallProgress < 80 && "Świetnie Ci idzie! Kontynuuj naukę."}
                {overallProgress >= 80 && overallProgress < 95 && "Jesteś blisko! Jeszcze trochę i będziesz gotowy."}
                {overallProgress >= 95 && "Gratulacje! Jesteś gotowy do egzaminu!"}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-foreground mt-12 py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BCU Spedycja</p>
          <div className="flex gap-4">
            <Link href="/polityka-prywatnosci" className="hover:text-foreground">Prywatność</Link>
            <Link href="/regulamin" className="hover:text-foreground">Regulamin</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
