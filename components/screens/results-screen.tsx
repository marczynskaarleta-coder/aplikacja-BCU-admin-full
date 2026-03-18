"use client"

import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { questions, modules } from "@/lib/data"
import {
  Trophy,
  RefreshCcw,
  Home,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function ResultsScreen() {
  const { quizResults, quizQuestions, userAnswers, setScreen, goBack, resetQuiz } =
    useAppStore()

  if (!quizResults) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Brak wyników do wyswietlenia</p>
          <Button onClick={goBack}>Powrót</Button>
        </div>
      </div>
    )
  }

  const percentage = Math.round((quizResults.correct / quizResults.total) * 100)
  const isPassing = percentage >= 70

  const quizQuestionsData = quizQuestions
    .map((id) => questions.find((q) => q.id === id))
    .filter(Boolean)

  const moduleResults = quizQuestionsData.reduce(
    (acc, question) => {
      if (!question) return acc
      const moduleId = question.moduleId
      if (!acc[moduleId]) {
        acc[moduleId] = { total: 0, correct: 0 }
      }
      acc[moduleId].total++

      const answer = userAnswers.find((a) => a.questionId === question.id)
      if (answer?.isCorrect) {
        acc[moduleId].correct++
      }

      return acc
    },
    {} as Record<string, { total: number; correct: number }>
  )

  const strongModules: string[] = []
  const weakModules: string[] = []

  Object.entries(moduleResults).forEach(([moduleId, results]) => {
    const modulePercentage = (results.correct / results.total) * 100
    const module = modules.find((m) => m.id === moduleId)
    if (!module) return

    if (modulePercentage >= 80) {
      strongModules.push(module.title)
    } else if (modulePercentage < 60) {
      weakModules.push(module.title)
    }
  })

  const wrongQuestions = userAnswers
    .filter((a) => quizQuestions.includes(a.questionId) && !a.isCorrect)
    .map((a) => questions.find((q) => q.id === a.questionId))
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Score Card */}
        <div
          className={cn(
            "border-2 p-8 text-center mb-8",
            isPassing ? "border-success bg-success/5" : "border-primary bg-primary/5"
          )}
        >
          <div
            className={cn(
              "w-20 h-20 flex items-center justify-center mx-auto mb-4",
              isPassing ? "bg-success" : "bg-primary"
            )}
          >
            <Trophy
              className={cn(
                "h-10 w-10",
                isPassing ? "text-success-foreground" : "text-primary-foreground"
              )}
            />
          </div>
          <h2 className="text-2xl font-black mb-2">
            {isPassing ? "Gratulacje!" : "Prawie udalo sie!"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isPassing
              ? "Swietnie sobie poradziles z tym quizem!"
              : "Jeszcze troche nauki i na pewno zdasz!"}
          </p>

          {/* Score Display */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-muted"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={`${percentage * 4.4} 440`}
                strokeLinecap="square"
                className={isPassing ? "text-success" : "text-primary"}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black">{percentage}%</span>
              <span className="text-sm text-muted-foreground">poprawnych</span>
            </div>
          </div>

          <div className="flex justify-center gap-12">
            <div className="text-center">
              <div className="text-3xl font-black text-success">{quizResults.correct}</div>
              <div className="text-sm text-muted-foreground">Poprawnych</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-destructive">
                {quizResults.total - quizResults.correct}
              </div>
              <div className="text-sm text-muted-foreground">Blednych</div>
            </div>
          </div>
        </div>

        {/* Analysis */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {strongModules.length > 0 && (
            <div className="border-2 border-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <h3 className="font-bold">Mocne strony</h3>
              </div>
              <ul className="space-y-2">
                {strongModules.map((area, index) => (
                  <li key={index} className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-success" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {weakModules.length > 0 && (
            <div className="border-2 border-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Do powtórzenia</h3>
              </div>
              <ul className="space-y-2">
                {weakModules.map((area, index) => (
                  <li key={index} className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Wrong Questions Summary */}
        {wrongQuestions.length > 0 && (
          <div className="border-2 border-border p-5 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5" />
              <h3 className="font-bold">Pytania do powtórki</h3>
            </div>
            <div className="space-y-3">
              {wrongQuestions.slice(0, 3).map((question, index) => (
                <div key={index} className="p-3 bg-muted">
                  <p className="text-sm">{question?.question}</p>
                </div>
              ))}
              {wrongQuestions.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{wrongQuestions.length - 3} wiecej pytan
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {wrongQuestions.length > 0 && (
            <Button
              variant="outline"
              className="w-full font-bold"
              onClick={() => setScreen("review")}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Przejdz do powtórek
            </Button>
          )}
          <Button
            className="w-full font-bold"
            onClick={() => {
              resetQuiz()
              setScreen("dashboard")
            }}
          >
            <Home className="h-4 w-4 mr-2" />
            Wróc do dashboardu
          </Button>
        </div>
      </main>
    </div>
  )
}
