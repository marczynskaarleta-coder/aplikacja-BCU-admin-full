'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Trophy,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Question {
  id: string
  module_id: string
  question_text: string
  options: string[]
  correct_answer: number
  explanation: string
  difficulty: string
  modules: { title: string } | null
}

interface QuizContentProps {
  questions: Question[]
  userId: string
}

export function QuizContent({ questions, userId }: QuizContentProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<Array<{ questionId: string; selected: number; correct: boolean }>>([])
  const [quizFinished, setQuizFinished] = useState(false)

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  const handleAnswer = async (index: number) => {
    if (showResult) return
    
    setSelectedAnswer(index)
    setShowResult(true)
    
    const isCorrect = index === currentQuestion.correct_answer
    
    // Save answer to database
    const supabase = createClient()
    await supabase.from('user_answers').insert({
      user_id: userId,
      question_id: currentQuestion.id,
      selected_answer: index,
      is_correct: isCorrect,
    })
    
    // If wrong, add to review queue
    if (!isCorrect) {
      await supabase.from('review_queue').upsert({
        user_id: userId,
        question_id: currentQuestion.id,
        difficulty_level: 1,
      }, {
        onConflict: 'user_id,question_id',
      })
    } else {
      // If correct, remove from review queue
      await supabase.from('review_queue')
        .delete()
        .eq('user_id', userId)
        .eq('question_id', currentQuestion.id)
    }
    
    setAnswers([...answers, {
      questionId: currentQuestion.id,
      selected: index,
      correct: isCorrect,
    }])
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizFinished(true)
    }
  }

  const correctCount = answers.filter(a => a.correct).length
  const percentage = Math.round((correctCount / questions.length) * 100)

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b-2 border-foreground">
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
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </div>
            
            <h1 className="text-4xl font-black mb-4">Quiz ukończony!</h1>
            
            <div className="text-7xl font-black text-primary mb-2">
              {percentage}%
            </div>
            <p className="text-muted-foreground mb-8">
              {correctCount} z {questions.length} poprawnych odpowiedzi
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card className="border-2 border-foreground bg-success/10">
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-success" />
                  <p className="text-2xl font-black">{correctCount}</p>
                  <p className="text-sm text-muted-foreground">Poprawne</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-foreground bg-destructive/10">
                <CardContent className="p-4 text-center">
                  <XCircle className="w-8 h-8 mx-auto mb-2 text-destructive" />
                  <p className="text-2xl font-black">{questions.length - correctCount}</p>
                  <p className="text-sm text-muted-foreground">Błędne</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.refresh()}
                className="w-full h-14 text-lg font-bold gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Kolejny quiz
              </Button>
              <Link href="/dashboard" className="block">
                <Button variant="outline" className="w-full h-12 font-bold border-2 border-foreground">
                  Wróć do dashboardu
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-foreground">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Zakończ quiz</span>
            </Link>
            <div className="text-center">
              <span className="text-sm text-muted-foreground">Pytanie</span>
              <span className="font-black ml-2">{currentIndex + 1}/{questions.length}</span>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-muted">
        <Progress value={progress} className="h-2 rounded-none" />
      </div>

      {/* Question */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
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
                if (isCorrect) {
                  cardClass = 'border-2 border-success bg-success/10'
                } else if (isSelected && !isCorrect) {
                  cardClass = 'border-2 border-destructive bg-destructive/10'
                } else {
                  cardClass = 'border-2 border-muted opacity-50'
                }
              } else if (isSelected) {
                cardClass = 'border-2 border-primary bg-primary/10'
              }

              return (
                <Card
                  key={index}
                  className={cardClass}
                  onClick={() => handleAnswer(index)}
                >
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
                    {showResult && isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-6 h-6 text-destructive shrink-0" />
                    )}
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
            <Button
              onClick={handleNext}
              className="w-full h-14 mt-8 text-lg font-bold gap-2"
            >
              {currentIndex < questions.length - 1 ? (
                <>
                  Następne pytanie
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Zobacz wyniki
                  <Trophy className="w-5 h-5" />
                </>
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
