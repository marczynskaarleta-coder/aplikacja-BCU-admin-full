import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/helpers'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Powtórki - BCU Spedycja',
  description: 'Przeglądaj pytania do powtórki',
}

export default async function ReviewPage() {
  const { user } = await requireAuth()
  const supabase = await createClient()

  // Get review queue with questions
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
    .order('next_review_at')
    .limit(20)

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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary">
              <RefreshCw className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Powtórki</h1>
              <p className="text-muted-foreground">
                {reviewItems?.length || 0} pytań do powtórzenia
              </p>
            </div>
          </div>

          {!reviewItems || reviewItems.length === 0 ? (
            <Card className="border-2 border-foreground">
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="w-16 h-16 mx-auto text-success mb-4" />
                <h2 className="text-2xl font-black mb-2">Brawo!</h2>
                <p className="text-muted-foreground mb-6">
                  Nie masz żadnych pytań do powtórki. Wszystko opanowane!
                </p>
                <Link href="/quiz">
                  <Button className="font-bold">
                    Rozwiąż kolejny quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviewItems.map((item) => (
                <Card key={item.id} className="border-2 border-foreground">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <span className="text-xs font-bold px-2 py-1 bg-muted">
                        {item.questions?.modules?.title || 'Ogólne'}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 ${
                        item.questions?.difficulty === 'easy' ? 'bg-success/20 text-success' :
                        item.questions?.difficulty === 'hard' ? 'bg-destructive/20 text-destructive' :
                        'bg-primary/20'
                      }`}>
                        {item.questions?.difficulty === 'easy' ? 'Łatwy' : 
                         item.questions?.difficulty === 'hard' ? 'Trudny' : 'Średni'}
                      </span>
                    </div>
                    <p className="font-bold text-lg mb-4">{item.questions?.question_text}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {item.questions?.options?.map((opt: string, i: number) => (
                        <div 
                          key={i} 
                          className={`p-3 text-sm ${
                            i === item.questions?.correct_answer 
                              ? 'bg-success/10 border-2 border-success font-bold' 
                              : 'bg-muted'
                          }`}
                        >
                          <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                          {opt}
                        </div>
                      ))}
                    </div>
                    {item.questions?.explanation && (
                      <p className="mt-4 text-sm text-muted-foreground">
                        <span className="font-bold">Wyjaśnienie:</span> {item.questions.explanation}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              <div className="pt-4">
                <Link href="/quiz">
                  <Button className="w-full h-14 text-lg font-bold">
                    Przećwicz te pytania w quizie
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
