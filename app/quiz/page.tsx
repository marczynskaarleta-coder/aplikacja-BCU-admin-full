import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/helpers'
import { QuizContent } from './quiz-content'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Quiz - BCU Spedycja',
  description: 'Rozwiąż quiz i sprawdź swoją wiedzę',
}

interface Props {
  searchParams: Promise<{ module?: string; count?: string }>
}

export default async function QuizPage({ searchParams }: Props) {
  const { user } = await requireAuth()
  const { module: moduleId, count: countParam } = await searchParams
  const supabase = await createClient()

  const limit = Math.min(50, Math.max(5, parseInt(countParam ?? '10', 10)))

  let query = supabase
    .from('questions')
    .select('*, modules(title)')
    .eq('is_active', true)
    .limit(limit)

  if (moduleId) {
    query = query.eq('module_id', moduleId)
  }

  const { data: questions } = await query

  // Shuffle questions using Fisher-Yates
  const shuffled = questions ? [...questions] : []
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  if (shuffled.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl font-black mb-4">?</div>
          <h1 className="text-2xl font-black mb-3">Brak pytań</h1>
          <p className="text-muted-foreground mb-6">
            {moduleId
              ? 'Ten moduł nie ma jeszcze pytań. Administrator musi je dodać.'
              : 'Baza pytań jest pusta. Administrator musi dodać pytania.'}
          </p>
          <div className="flex flex-col gap-3">
            {moduleId && (
              <Link href="/modules">
                <Button variant="outline" className="w-full font-bold border-2 border-foreground">
                  Wróć do modułów
                </Button>
              </Link>
            )}
            <Link href="/dashboard">
              <Button className="w-full font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                Wróć do dashboardu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <QuizContent questions={shuffled} userId={user.id} />
}
