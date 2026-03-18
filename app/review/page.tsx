import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/helpers'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { ReviewQuiz } from './_components/review-quiz'

export const metadata = {
  title: 'Powtórki - BCU Spedycja',
}

export default async function ReviewPage() {
  const { user } = await requireAuth()
  const supabase = await createClient()

  const { data: reviewItems } = await supabase
    .from('review_queue')
    .select(`
      *,
      questions (
        id,
        question_text,
        options,
        correct_answer,
        explanation,
        difficulty,
        modules (title)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at')
    .limit(20)

  const questions = (reviewItems || [])
    .map(item => item.questions)
    .filter(Boolean) as Array<{
      id: string
      question_text: string
      options: string[]
      correct_answer: number
      explanation: string
      difficulty: string
      modules: { title: string } | null
    }>

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
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {questions.length === 0 ? (
            <Card className="border-2 border-foreground">
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="w-16 h-16 mx-auto text-success mb-4" />
                <h2 className="text-2xl font-black mb-2">Brawo!</h2>
                <p className="text-muted-foreground mb-6">
                  Nie masz żadnych pytań do powtórki. Wszystko opanowane!
                </p>
                <Link href="/quiz">
                  <Button className="font-bold">Rozwiąż kolejny quiz</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <ReviewQuiz questions={questions} userId={user.id} />
          )}
        </div>
      </main>
    </div>
  )
}
