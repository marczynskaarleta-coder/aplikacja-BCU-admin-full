"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { modules, questions } from "@/lib/data"
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  PlayCircle,
  ChevronRight,
  CheckCircle2,
} from "lucide-react"

export function LessonScreen() {
  const { currentModuleId, startQuiz, goBack } = useAppStore()
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0)

  const module = modules.find((m) => m.id === currentModuleId)
  const moduleQuestions = questions.filter((q) => q.moduleId === currentModuleId)

  if (!module) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Modul nie zostal znaleziony</p>
          <Button onClick={goBack}>Powrót</Button>
        </div>
      </div>
    )
  }

  const lesson = module.lessons[selectedLessonIndex]
  const hasLessons = module.lessons.length > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border bg-background sticky top-0 z-50">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-bold text-lg">{module.title}</h1>
            <p className="text-sm text-muted-foreground">{module.totalQuestions} pytan</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {hasLessons ? (
          <>
            {/* Lesson Navigation */}
            <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
              {module.lessons.map((l, index) => (
                <button
                  key={l.id}
                  className={`flex items-center gap-2 px-4 py-2 border-2 font-semibold text-sm transition-colors flex-shrink-0 ${
                    selectedLessonIndex === index
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  }`}
                  onClick={() => setSelectedLessonIndex(index)}
                >
                  {l.completed && <CheckCircle2 className="h-4 w-4" />}
                  Lekcja {index + 1}
                </button>
              ))}
            </div>

            {/* Lesson Content */}
            {lesson && (
              <div className="space-y-6">
                <div className="border-2 border-border p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="h-5 w-5" />
                    <h2 className="text-xl font-bold">{lesson.title}</h2>
                  </div>
                  <div className="space-y-4">
                    {lesson.content.map((block, index) => {
                      if (block.type === "heading") {
                        return (
                          <h3
                            key={index}
                            className="text-lg font-bold mt-8 first:mt-0 pb-2 border-b border-border"
                          >
                            {block.content as string}
                          </h3>
                        )
                      }
                      if (block.type === "paragraph") {
                        return (
                          <p key={index} className="text-muted-foreground leading-relaxed">
                            {block.content as string}
                          </p>
                        )
                      }
                      if (block.type === "list") {
                        return (
                          <ul key={index} className="space-y-2 pl-4">
                            {(block.content as string[]).map((item, i) => (
                              <li
                                key={i}
                                className="text-muted-foreground flex items-start gap-2"
                              >
                                <ChevronRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )
                      }
                      if (block.type === "note") {
                        return (
                          <div
                            key={index}
                            className="bg-primary p-4 border-l-4 border-foreground"
                          >
                            <p className="text-sm font-medium text-primary-foreground">
                              {block.content as string}
                            </p>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>

                {/* Key Points */}
                <div className="border-2 border-border p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <h3 className="font-bold">Najwazniejsze punkty</h3>
                  </div>
                  <ul className="space-y-3">
                    {lesson.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="border-2 border-border p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Tresc w przygotowaniu</h3>
            <p className="text-muted-foreground mb-4">
              Lekcje dla tego modulu sa aktualnie przygotowywane. Mozesz juz teraz
              przejsc do quizu i przetestowac swoja wiedze.
            </p>
          </div>
        )}

        {/* Quiz Button */}
        <div className="mt-8">
          <Button
            size="lg"
            className="w-full font-bold"
            onClick={() => startQuiz(moduleQuestions.map((q) => q.id))}
          >
            <PlayCircle className="h-5 w-5 mr-2" />
            Przejdz do quizu ({moduleQuestions.length} pytan)
          </Button>
        </div>
      </main>
    </div>
  )
}
