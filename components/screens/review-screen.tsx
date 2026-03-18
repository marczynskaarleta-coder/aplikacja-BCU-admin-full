"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { questions, userAnswers as mockUserAnswers, modules } from "@/lib/data"
import { ArrowLeft, RefreshCcw, AlertCircle, PlayCircle, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export function ReviewScreen() {
  const { goBack, startQuiz, userAnswers } = useAppStore()

  const allAnswers = [...mockUserAnswers, ...userAnswers]

  const reviewQuestionIds = [
    ...new Set(allAnswers.filter((a) => a.needsReview).map((a) => a.questionId)),
  ]

  const reviewQuestions = reviewQuestionIds
    .map((id) => questions.find((q) => q.id === id))
    .filter(Boolean)

  const questionsByModule = reviewQuestions.reduce(
    (acc, question) => {
      if (!question) return acc
      const moduleId = question.moduleId
      if (!acc[moduleId]) {
        acc[moduleId] = []
      }
      acc[moduleId].push(question)
      return acc
    },
    {} as Record<string, typeof questions>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border bg-background sticky top-0 z-50">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-bold text-lg">Powtórki</h1>
            <p className="text-sm text-muted-foreground">
              {reviewQuestions.length} pytan do powtórzenia
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {reviewQuestions.length === 0 ? (
          <div className="border-2 border-border p-8 text-center">
            <div className="w-16 h-16 bg-success flex items-center justify-center mx-auto mb-4">
              <RefreshCcw className="h-8 w-8 text-success-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Swietna robota!</h3>
            <p className="text-muted-foreground mb-6">
              Nie masz zadnych pytan do powtórzenia. Wszystkie odpowiedzi byly poprawne!
            </p>
            <Button onClick={goBack}>Wróc do nauki</Button>
          </div>
        ) : (
          <>
            {/* Start Review Quiz */}
            <div className="border-2 border-primary bg-primary/5 p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary flex items-center justify-center flex-shrink-0">
                  <PlayCircle className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Rozpocznij sesje powtórek</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Przejdz przez wszystkie {reviewQuestions.length} pytan, które wymagaja
                    powtórzenia.
                  </p>
                  <Button onClick={() => startQuiz(reviewQuestionIds)}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Rozpocznij powtórke
                  </Button>
                </div>
              </div>
            </div>

            {/* Questions by Module */}
            <div className="space-y-8">
              {Object.entries(questionsByModule).map(([moduleId, moduleQuestions]) => {
                const module = modules.find((m) => m.id === moduleId)

                return (
                  <div key={moduleId}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        <h3 className="font-bold">{module?.title || "Nieznany modul"}</h3>
                      </div>
                      <Badge variant="secondary" className="font-bold">
                        {moduleQuestions.length} pytan
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {moduleQuestions.map((question) => {
                        if (!question) return null

                        return (
                          <div
                            key={question.id}
                            className="border-2 border-border p-4 hover:border-foreground transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium mb-2">{question.question}</p>
                                <Badge
                                  className={cn(
                                    "font-bold text-xs",
                                    question.difficulty === "easy" &&
                                      "bg-success text-success-foreground",
                                    question.difficulty === "medium" &&
                                      "bg-primary text-primary-foreground",
                                    question.difficulty === "hard" &&
                                      "bg-foreground text-background"
                                  )}
                                >
                                  {question.difficulty === "easy" && "Latwe"}
                                  {question.difficulty === "medium" && "Srednie"}
                                  {question.difficulty === "hard" && "Trudne"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
