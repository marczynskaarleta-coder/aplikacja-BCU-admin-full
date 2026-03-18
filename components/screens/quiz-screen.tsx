"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { questions } from "@/lib/data"
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function QuizScreen() {
  const {
    quizQuestions,
    currentQuestionIndex,
    answerQuestion,
    nextQuestion,
    goBack,
    userAnswers,
  } = useAppStore()

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const currentQuestionId = quizQuestions[currentQuestionIndex]
  const question = questions.find((q) => q.id === currentQuestionId)
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100

  useEffect(() => {
    setSelectedAnswer(null)
    setHasAnswered(false)
    setShowFeedback(false)
  }, [currentQuestionIndex])

  if (!question) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Nie znaleziono pytania</p>
          <Button onClick={goBack}>Powrót</Button>
        </div>
      </div>
    )
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered) return
    setSelectedAnswer(answerIndex)
  }

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === question.correctAnswer

    answerQuestion({
      questionId: question.id,
      selectedAnswer,
      isCorrect,
      attemptDate: new Date(),
      needsReview: !isCorrect,
    })

    setHasAnswered(true)
    setShowFeedback(true)
  }

  const handleNextQuestion = () => {
    nextQuestion()
  }

  const isCorrect = selectedAnswer === question.correctAnswer

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={goBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm font-bold">
              Pytanie {currentQuestionIndex + 1} z {quizQuestions.length}
            </span>
            <div className="w-10" />
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Question Content */}
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-8 flex flex-col">
        <div className="border-2 border-border bg-card p-6 flex-1 flex flex-col">
          {/* Difficulty Badge */}
          <div className="mb-4">
            <span
              className={cn(
                "inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider",
                question.difficulty === "easy" && "bg-success text-success-foreground",
                question.difficulty === "medium" && "bg-primary text-primary-foreground",
                question.difficulty === "hard" && "bg-foreground text-background"
              )}
            >
              {question.difficulty === "easy" && "Latwe"}
              {question.difficulty === "medium" && "Srednie"}
              {question.difficulty === "hard" && "Trudne"}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-xl font-bold mb-8 leading-relaxed">{question.question}</h2>

          {/* Answers */}
          <div className="space-y-3 flex-1">
            {question.answers.map((answer, index) => {
              const isSelected = selectedAnswer === index
              const isCorrectAnswer = index === question.correctAnswer
              const showCorrect = hasAnswered && isCorrectAnswer
              const showWrong = hasAnswered && isSelected && !isCorrectAnswer

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={hasAnswered}
                  className={cn(
                    "w-full p-4 border-2 text-left transition-all flex items-center gap-4",
                    !hasAnswered && !isSelected && "border-border hover:border-foreground",
                    !hasAnswered && isSelected && "border-foreground bg-primary/10",
                    showCorrect && "border-success bg-success/10",
                    showWrong && "border-destructive bg-destructive/10",
                    hasAnswered && !showCorrect && !showWrong && "border-border opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 flex items-center justify-center font-bold text-sm flex-shrink-0",
                      !hasAnswered && !isSelected && "bg-muted text-muted-foreground",
                      !hasAnswered && isSelected && "bg-foreground text-background",
                      showCorrect && "bg-success text-success-foreground",
                      showWrong && "bg-destructive text-destructive-foreground"
                    )}
                  >
                    {showCorrect && <CheckCircle2 className="h-5 w-5" />}
                    {showWrong && <XCircle className="h-5 w-5" />}
                    {!showCorrect && !showWrong && String.fromCharCode(65 + index)}
                  </div>
                  <span
                    className={cn(
                      "font-medium",
                      showCorrect && "text-success",
                      showWrong && "text-destructive"
                    )}
                  >
                    {answer}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div
              className={cn(
                "mt-6 p-4 flex items-start gap-3",
                isCorrect
                  ? "bg-success/10 border-2 border-success"
                  : "bg-destructive/10 border-2 border-destructive"
              )}
            >
              {isCorrect ? (
                <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
              ) : (
                <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0" />
              )}
              <div>
                <p
                  className={cn(
                    "font-bold mb-1",
                    isCorrect ? "text-success" : "text-destructive"
                  )}
                >
                  {isCorrect ? "Poprawna odpowiedz!" : "Niepoprawna odpowiedz"}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-muted-foreground">
                    To pytanie zostanie dodane do puli powtórek.
                  </p>
                )}
                {question.explanation && (
                  <p className="text-sm mt-2">{question.explanation}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {!hasAnswered ? (
            <Button
              size="lg"
              className="w-full font-bold"
              onClick={handleConfirmAnswer}
              disabled={selectedAnswer === null}
            >
              Sprawdz odpowiedz
            </Button>
          ) : (
            <Button size="lg" className="w-full font-bold" onClick={handleNextQuestion}>
              {currentQuestionIndex < quizQuestions.length - 1 ? (
                <>
                  Nastepne pytanie
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              ) : (
                "Zobacz wyniki"
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
