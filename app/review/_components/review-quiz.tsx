'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, XCircle, ArrowRight, Trophy, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Question {
  id: string
  question_text: string
  options: string[]
  correct_answer: number
  explanation: string
  difficulty: string
  modules: { title: string } | null
}

interface ReviewQuizProps {
  questions: Question[]
  userId: string
}

export function ReviewQuiz({ questions, userId }: ReviewQuizProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<Array<{ questionId: string; correct: boolean }>>([])
  const [finished, setFinished] = useState(false)

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const correctCount = answers.filter(a => a.correct).length
  const percentage = Math.round((correctCount / questions.length) * 100)

  const handleAnswer = async (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)

    const isCorrect = index === currentQuestion.correct_answer
    const supabase = createClient()

    await supabase.from('user_answers').insert({
      user_id: userId,
      question_id: currentQuestion.id,
      selected_answer: index,
      is_correct: isCorrect,
    })

    if (isCorrect) {
      await supabase.from('review_queue')
        .delete()
        .eq('user_id', userId)
        .eq('question_id', currentQuestion.id)
    }

    setAnswers(prev => [...prev, { questionId: currentQuestion.id, correct: isCorrect }])
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setFinished(true)
    }
  }

  if (finished) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary flex items-center justify-center">
          <Trophy className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-black mb-2">Powtórka ukończona!</h1>
        <div className="text-7xl font-black text-primary mb-2">{percentage}%</div>
        <p className="text-muted-foreground mb-8">
          {correctCount} z {questions.length} poprawnych odpowiedzi
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="border-2 border-foreground bg-success/10">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-success" />
              <p className="text-2xl font-black">{correctCount}</p>
              <p className="text-sm text-muted-foreground">Opanowane</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-foreground bg-destructive/10">
            <CardContent className="p-4 text-center">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-destructive" />
              <p className="text-2xl font-black">{questions.length - correctCount}</p>
              <p className="text-sm text-muted-foreground">Do powtórki</p>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-3">
          <Button onClick={() => router.push('/review')} className="w-full h-14 text-lg font-bold gap-2">
            <RefreshCw className="w-5 h-5" />
            Powtórz jeszcze raz
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full h-12 font-bold border-2 border-foreground">
              Wróć do dashboardu
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black">Powtórki</h1>
          <p className="text-sm text-muted-foreground">{questions.length} pytań do powtórzenia</p>
        </div>
        <span className="font-black text-muted-foreground">{currentIndex + 1}/{questions.length}</span>
      </div>

      <Progress value={progress} className="h-2 mb-8" />

      <div className="mb-4">
        <span className="text-xs font-bold px-3 py-1 bg-muted">
          {currentQuestion.modules?.title || 'Ogólne'}
        </span>
      </div>

      <h2 className="text-2xl font-black mb-8 leading-relaxed">
        {currentQuestion.question_text}
      </h2>

      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === currentQuestion.correct_answer

          let cardClass = 'border-2 border-foreground cursor-pointer hover:border-primary transition-all'
          if (showResult) {
            if (isCorrect) cardClass = 'border-2 border-success bg-success/10'
            else if (isSelected && !isCorrect) cardClass = 'border-2 border-destructive bg-destructive/10'
            else cardClass = 'border-2 border-muted opacity-50'
          } else if (isSelected) {
            cardClass = 'border-2 border-primary bg-primary/10'
          }

          return (
            <Card key={index} className={cardClass} onClick={() => handleAnswer(index)}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center font-bold ${
                  showResult && isCorrect ? 'bg-success text-success-foreground' :
                  showResult && isSelected && !isCorrect ? 'bg-destructive text-destructive-foreground' :
                  isSelected ? 'bg-primary text-primary-foreground' :
                  'bg-foreground text-background'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-medium flex-1">{option}</span>
                {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-success shrink-0" />}
                {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-destructive shrink-0" />}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {showResult && currentQuestion.explanation && (
        <Card className="mt-6 border-2 border-primary bg-primary/5">
          <CardContent className="p-4">
            <p className="font-bold mb-2">Wyjaśnienie:</p>
            <p className="text-muted-foreground">{currentQuestion.explanation}</p>
          </CardContent>
        </Card>
      )}

      {showResult && (
        <Button onClick={handleNext} className="w-full h-14 mt-8 text-lg font-bold gap-2">
          {currentIndex < questions.length - 1 ? (
            <>Następne pytanie <ArrowRight className="w-5 h-5" /></>
          ) : (
            <>Zobacz wyniki <Trophy className="w-5 h-5" /></>
          )}
        </Button>
      )}
    </div>
  )
}
