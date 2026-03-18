'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles, Loader2, CheckCircle2, Save, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { generateQuestionsAction, saveGeneratedQuestions } from '../actions'
import type { GeneratedQuestion } from '@/lib/ai/generate-questions'
import { useRouter } from 'next/navigation'

interface Module { id: string; title: string }

const ANSWER_LABELS = ['A', 'B', 'C', 'D']
const DIFF_LABELS: Record<string, string> = { easy: 'Łatwe', medium: 'Średnie', hard: 'Trudne' }
const DIFF_COLORS: Record<string, string> = {
  easy:   'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard:   'bg-red-100 text-red-800',
}

export function GenerateForm({ modules, disabled }: { modules: Module[]; disabled?: boolean }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSaving, startSaveTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<GeneratedQuestion[] | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState('')
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [saved, setSaved] = useState(false)

  const handleGenerate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setQuestions(null)
    setSaved(false)
    const fd = new FormData(e.currentTarget)
    setSelectedModuleId(fd.get('module_id') as string)
    startTransition(async () => {
      try {
        const result = await generateQuestionsAction(fd)
        setQuestions(result.questions)
        setExpanded(Object.fromEntries(result.questions.map((_, i) => [i, i === 0])))
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  const handleSave = () => {
    if (!questions || !selectedModuleId) return
    startSaveTransition(async () => {
      try {
        await saveGeneratedQuestions(selectedModuleId, questions)
        setSaved(true)
        setTimeout(() => router.push('/admin/quizzes'), 1500)
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev?.filter((_, i) => i !== index) ?? null)
  }

  return (
    <div className="space-y-6">
      {/* Generation form */}
      <Card className="border-2 border-foreground">
        <CardHeader className="border-b-2 border-foreground">
          <CardTitle className="font-black">1. Wklej tekst materiału</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 space-y-2">
                <Label htmlFor="module_id" className="font-bold">Moduł *</Label>
                <select
                  id="module_id"
                  name="module_id"
                  required
                  disabled={disabled}
                  className="w-full h-10 px-3 border-2 border-foreground bg-background text-sm font-medium"
                >
                  <option value="" disabled>Wybierz...</option>
                  {modules.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="count" className="font-bold">Liczba pytań</Label>
                <select
                  id="count"
                  name="count"
                  defaultValue="5"
                  disabled={disabled}
                  className="w-full h-10 px-3 border-2 border-foreground bg-background text-sm font-medium"
                >
                  {[3, 5, 8, 10, 15, 20].map(n => (
                    <option key={n} value={n}>{n} pytań</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="font-bold">Poziom</Label>
                <select
                  id="difficulty"
                  name="difficulty"
                  defaultValue="mixed"
                  disabled={disabled}
                  className="w-full h-10 px-3 border-2 border-foreground bg-background text-sm font-medium"
                >
                  <option value="mixed">Mieszany</option>
                  <option value="easy">Łatwy</option>
                  <option value="medium">Średni</option>
                  <option value="hard">Trudny</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source_text" className="font-bold">
                Tekst źródłowy *
                <span className="font-normal text-muted-foreground ml-2">
                  (min. 100 znaków, max. ~12 000)
                </span>
              </Label>
              <Textarea
                id="source_text"
                name="source_text"
                required
                disabled={disabled}
                rows={12}
                placeholder="Wklej tu fragment skryptu, notatki, treść przepisu, opis procedury..."
                className="border-2 border-foreground resize-y font-mono text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={disabled || isPending}
              className="w-full h-12 text-base font-bold gap-2 border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              {isPending
                ? <><Loader2 className="w-5 h-5 animate-spin" />Generuję pytania...</>
                : <><Sparkles className="w-5 h-5" />Generuj pytania przez AI</>
              }
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="border-2 border-destructive bg-destructive/5 p-4 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      {/* Generated questions preview */}
      {questions && questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">
              2. Przejrzyj wygenerowane pytania ({questions.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-2 border-foreground font-bold"
              onClick={() => setExpanded(Object.fromEntries(questions.map((_, i) => [i, true])))}
            >
              Rozwiń wszystkie
            </Button>
          </div>

          {questions.map((q, index) => (
            <Card key={index} className="border-2 border-foreground">
              <button
                type="button"
                onClick={() => setExpanded(prev => ({ ...prev, [index]: !prev[index] }))}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 w-7 h-7 bg-foreground text-background text-xs font-black flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className={`shrink-0 text-xs font-bold px-2 py-0.5 ${DIFF_COLORS[q.difficulty] ?? 'bg-muted'}`}>
                    {DIFF_LABELS[q.difficulty] ?? q.difficulty}
                  </span>
                  <span className="font-bold text-sm truncate">{q.question_text}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeQuestion(index) }}
                    className="text-xs text-destructive hover:underline font-bold"
                  >
                    Usuń
                  </button>
                  {expanded[index]
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  }
                </div>
              </button>

              {expanded[index] && (
                <CardContent className="px-5 pb-5 pt-0 space-y-3 border-t-2 border-foreground">
                  <p className="font-bold text-base pt-4">{q.question_text}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`flex items-center gap-3 px-3 py-2 border-2 ${
                          oi === q.correct_answer
                            ? 'border-primary bg-primary/5'
                            : 'border-border'
                        }`}
                      >
                        <span className={`shrink-0 w-7 h-7 flex items-center justify-center text-xs font-black ${
                          oi === q.correct_answer
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}>
                          {oi === q.correct_answer
                            ? <CheckCircle2 className="w-4 h-4" />
                            : ANSWER_LABELS[oi]
                          }
                        </span>
                        <span className={`text-sm ${oi === q.correct_answer ? 'font-bold' : ''}`}>
                          {opt}
                        </span>
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className="bg-muted/50 border border-border p-3 text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">Wyjaśnienie: </span>
                      {q.explanation}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}

          {/* Save button */}
          <div className="flex gap-3 pt-2">
            {saved ? (
              <div className="flex-1 flex items-center justify-center gap-2 h-12 border-2 border-green-600 bg-green-50 text-green-700 font-bold">
                <CheckCircle2 className="w-5 h-5" />
                Zapisano! Przekierowuję...
              </div>
            ) : (
              <Button
                onClick={handleSave}
                disabled={isSaving || questions.length === 0}
                className="flex-1 h-12 text-base font-bold gap-2 border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                {isSaving
                  ? <><Loader2 className="w-5 h-5 animate-spin" />Zapisuję...</>
                  : <><Save className="w-5 h-5" />Zapisz {questions.length} pytań do bazy</>
                }
              </Button>
            )}
            <Button
              variant="outline"
              className="gap-2 border-2 border-foreground font-bold"
              onClick={() => { setQuestions(null); setSaved(false) }}
            >
              <RotateCcw className="w-4 h-4" />
              Generuj ponownie
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
