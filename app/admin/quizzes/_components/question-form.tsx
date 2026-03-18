'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle2 } from 'lucide-react'

interface Module {
  id: string
  title: string
}

interface QuestionData {
  module_id: string
  question_text: string
  options: string[]
  correct_answer: number
  explanation: string | null
  difficulty_text: string | null
  difficulty: number
}

interface Props {
  modules: Module[]
  question?: QuestionData
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

const ANSWER_LABELS = ['A', 'B', 'C', 'D']
const OPTION_NAMES = ['optionA', 'optionB', 'optionC', 'optionD']

export function QuestionForm({ modules, question, action, submitLabel }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<number>(question?.correct_answer ?? 0)

  const defaultDiff = question?.difficulty_text ?? (
    question?.difficulty === 1 ? 'easy' : question?.difficulty === 2 ? 'medium' : 'easy'
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await action(formData)
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="px-4 py-3 text-sm font-medium border-2 border-destructive text-destructive bg-destructive/5">
          {error}
        </div>
      )}

      {/* Module + Difficulty */}
      <Card className="border-2 border-foreground">
        <CardHeader className="border-b-2 border-foreground">
          <CardTitle className="font-black">Ustawienia pytania</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="module_id" className="font-bold">Moduł *</Label>
            <select
              id="module_id"
              name="module_id"
              defaultValue={question?.module_id ?? ''}
              required
              className="w-full h-10 px-3 border-2 border-foreground bg-background text-sm font-medium"
            >
              <option value="" disabled>Wybierz moduł...</option>
              {modules.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="difficulty" className="font-bold">Poziom trudności</Label>
            <select
              id="difficulty"
              name="difficulty"
              defaultValue={defaultDiff}
              className="w-full h-10 px-3 border-2 border-foreground bg-background text-sm font-medium"
            >
              <option value="easy">Łatwe</option>
              <option value="medium">Średnie</option>
              <option value="hard">Trudne</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Question text */}
      <Card className="border-2 border-foreground">
        <CardHeader className="border-b-2 border-foreground">
          <CardTitle className="font-black">Treść pytania</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Textarea
            name="question_text"
            defaultValue={question?.question_text ?? ''}
            required
            rows={4}
            placeholder="Wpisz treść pytania..."
            className="border-2 border-foreground resize-none text-base"
          />
        </CardContent>
      </Card>

      {/* Answer options */}
      <Card className="border-2 border-foreground">
        <CardHeader className="border-b-2 border-foreground">
          <CardTitle className="font-black">Odpowiedzi</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Kliknij przycisk przy odpowiedzi, żeby zaznaczyć ją jako poprawną.
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {/* Hidden field for correct answer */}
          <input type="hidden" name="correct_answer" value={correctAnswer} />

          {OPTION_NAMES.map((name, index) => (
            <div key={index} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCorrectAnswer(index)}
                className={`shrink-0 w-10 h-10 font-black text-sm border-2 transition-colors flex items-center justify-center ${
                  correctAnswer === index
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-foreground hover:bg-muted'
                }`}
                title={`Zaznacz odpowiedź ${ANSWER_LABELS[index]} jako poprawną`}
              >
                {correctAnswer === index
                  ? <CheckCircle2 className="w-5 h-5" />
                  : ANSWER_LABELS[index]
                }
              </button>
              <Input
                name={name}
                defaultValue={question?.options?.[index] ?? ''}
                required
                placeholder={`Odpowiedź ${ANSWER_LABELS[index]}...`}
                className={`flex-1 border-2 ${correctAnswer === index ? 'border-primary bg-primary/5 font-bold' : 'border-foreground'}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card className="border-2 border-foreground">
        <CardHeader className="border-b-2 border-foreground">
          <CardTitle className="font-black">Wyjaśnienie (opcjonalne)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Textarea
            name="explanation"
            defaultValue={question?.explanation ?? ''}
            rows={3}
            placeholder="Wyjaśnienie dlaczego dana odpowiedź jest poprawna — wyświetlane po udzieleniu odpowiedzi..."
            className="border-2 border-foreground resize-none"
          />
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 text-base font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
        {submitLabel}
      </Button>
    </form>
  )
}
