import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { QuestionForm } from '../../_components/question-form'
import { updateQuestion, deleteQuestion } from '../../actions'

export const metadata = { title: 'Edytuj pytanie - Admin BCU' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditQuestionPage({ params }: Props) {
  await requireAdmin()
  const { id } = await params
  const supabase = await createClient()

  const [{ data: question }, { data: modules }] = await Promise.all([
    supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single(),
    supabase
      .from('modules')
      .select('id, title')
      .order('order_index'),
  ])

  if (!question) notFound()

  const options: string[] = Array.isArray(question.options)
    ? question.options
    : (typeof question.options === 'string' ? JSON.parse(question.options) : [])

  const questionData = {
    module_id:       question.module_id,
    question_text:   question.question_text,
    options,
    correct_answer:  question.correct_answer ?? parseInt(question.correct_option_id ?? '0', 10),
    explanation:     question.explanation ?? null,
    difficulty_text: question.difficulty_text ?? null,
    difficulty:      question.difficulty ?? 1,
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/quizzes">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Powrót
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black">Edytuj pytanie</h1>
          <p className="text-muted-foreground mt-1 text-sm line-clamp-1">{question.question_text}</p>
        </div>
        <form action={deleteQuestion.bind(null, id)}>
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            className="border-2 border-destructive font-bold"
            onClick={(e) => {
              if (!confirm('Usunąć to pytanie?')) e.preventDefault()
            }}
          >
            Usuń
          </Button>
        </form>
      </div>

      <QuestionForm
        modules={modules ?? []}
        question={questionData}
        action={updateQuestion.bind(null, id)}
        submitLabel="Zapisz zmiany"
      />
    </div>
  )
}
