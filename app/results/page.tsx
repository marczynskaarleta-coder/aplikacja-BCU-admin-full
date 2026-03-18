import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/helpers'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Target,
  TrendingUp,
  Award
} from 'lucide-react'

export const metadata = {
  title: 'Statystyki - BCU Spedycja',
  description: 'Twoje wyniki i statystyki nauki',
}

export default async function ResultsPage() {
  const { user } = await requireAuth()
  const supabase = await createClient()

  // Get all user answers
  const { data: answers } = await supabase
    .from('user_answers')
    .select(`
      *,
      questions (
        id,
        module_id,
        difficulty,
        modules (title)
      )
    `)
    .eq('user_id', user.id)
    .order('answered_at', { ascending: false })

  // Get modules for stats
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .order('order_index')

  // Calculate stats
  const totalAnswers = answers?.length || 0
  const correctAnswers = answers?.filter(a => a.is_correct).length || 0
  const incorrectAnswers = totalAnswers - correctAnswers
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0

  // Stats by module
  const moduleStats = modules?.map(module => {
    const moduleAnswers = answers?.filter(a => a.questions?.module_id === module.id) || []
    const correct = moduleAnswers.filter(a => a.is_correct).length
    const total = moduleAnswers.length
    return {
      ...module,
      correct,
      total,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    }
  }) || []

  // Stats by difficulty
  const difficultyStats = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  }
  
  answers?.forEach(a => {
    const diff = a.questions?.difficulty as keyof typeof difficultyStats
    if (diff && difficultyStats[diff]) {
      difficultyStats[diff].total++
      if (a.is_correct) difficultyStats[diff].correct++
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-foreground">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Powrót</span>
            </Link>
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
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary">
              <BarChart3 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Twoje statystyki</h1>
              <p className="text-muted-foreground">
                Przegląd wyników i postępów w nauce
              </p>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-2 border-foreground">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-black">{totalAnswers}</p>
                <p className="text-xs text-muted-foreground">Odpowiedzi</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-foreground bg-success/5">
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-success" />
                <p className="text-3xl font-black text-success">{correctAnswers}</p>
                <p className="text-xs text-muted-foreground">Poprawne</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-foreground bg-destructive/5">
              <CardContent className="p-4 text-center">
                <XCircle className="w-8 h-8 mx-auto mb-2 text-destructive" />
                <p className="text-3xl font-black text-destructive">{incorrectAnswers}</p>
                <p className="text-xs text-muted-foreground">Błędne</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-foreground">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-black">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">Skuteczność</p>
              </CardContent>
            </Card>
          </div>

          {/* Readiness Card */}
          <Card className="border-2 border-foreground mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Gotowość do egzaminu</h3>
                <Award className={`w-8 h-8 ${accuracy >= 80 ? 'text-success' : accuracy >= 50 ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <Progress value={accuracy} className="h-4 mb-4" />
              <p className="text-muted-foreground">
                {accuracy < 50 && "Potrzebujesz więcej praktyki. Rozwiązuj quizy i powtarzaj materiał!"}
                {accuracy >= 50 && accuracy < 80 && "Jesteś na dobrej drodze! Kontynuuj naukę i ćwiczenia."}
                {accuracy >= 80 && accuracy < 95 && "Świetnie Ci idzie! Jeszcze trochę i będziesz gotowy."}
                {accuracy >= 95 && "Doskonale! Jesteś w pełni przygotowany do egzaminu!"}
              </p>
            </CardContent>
          </Card>

          {/* Stats by Module */}
          <Card className="border-2 border-foreground mb-8">
            <CardHeader>
              <CardTitle className="font-black">Wyniki według modułów</CardTitle>
            </CardHeader>
            <CardContent>
              {moduleStats.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Brak danych. Rozwiąż kilka quizów!
                </p>
              ) : (
                <div className="space-y-4">
                  {moduleStats.map((module) => (
                    <div key={module.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{module.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {module.correct}/{module.total} ({module.accuracy}%)
                        </span>
                      </div>
                      <Progress value={module.accuracy} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats by Difficulty */}
          <Card className="border-2 border-foreground mb-8">
            <CardHeader>
              <CardTitle className="font-black">Wyniki według trudności</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-success/10 border-2 border-success/20">
                  <p className="text-sm font-bold text-success mb-1">Łatwe</p>
                  <p className="text-2xl font-black">
                    {difficultyStats.easy.total > 0 
                      ? Math.round((difficultyStats.easy.correct / difficultyStats.easy.total) * 100) 
                      : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {difficultyStats.easy.correct}/{difficultyStats.easy.total}
                  </p>
                </div>
                <div className="text-center p-4 bg-primary/10 border-2 border-primary/20">
                  <p className="text-sm font-bold text-primary mb-1">Średnie</p>
                  <p className="text-2xl font-black">
                    {difficultyStats.medium.total > 0 
                      ? Math.round((difficultyStats.medium.correct / difficultyStats.medium.total) * 100) 
                      : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {difficultyStats.medium.correct}/{difficultyStats.medium.total}
                  </p>
                </div>
                <div className="text-center p-4 bg-destructive/10 border-2 border-destructive/20">
                  <p className="text-sm font-bold text-destructive mb-1">Trudne</p>
                  <p className="text-2xl font-black">
                    {difficultyStats.hard.total > 0 
                      ? Math.round((difficultyStats.hard.correct / difficultyStats.hard.total) * 100) 
                      : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {difficultyStats.hard.correct}/{difficultyStats.hard.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link href="/quiz" className="flex-1">
              <Button className="w-full h-12 font-bold">
                Rozwiąż quiz
              </Button>
            </Link>
            <Link href="/review" className="flex-1">
              <Button variant="outline" className="w-full h-12 font-bold border-2 border-foreground">
                Powtórki
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
