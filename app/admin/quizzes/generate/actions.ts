'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { generateQuestionsFromText, GeneratedQuestion } from '@/lib/ai/generate-questions'
import { revalidatePath } from 'next/cache'

export async function generateQuestionsAction(formData: FormData): Promise<{
  questions: GeneratedQuestion[]
  jobId: string
  error?: string
}> {
  const { user } = await requireAdmin()
  const supabase = await createClient()

  const text       = (formData.get('source_text') as string)?.trim()
  const module_id  = formData.get('module_id') as string
  const countRaw   = formData.get('count') as string
  const difficulty = (formData.get('difficulty') as string) ?? 'mixed'
  const count      = Math.min(20, Math.max(1, parseInt(countRaw ?? '5', 10)))

  if (!text || text.length < 100) {
    throw new Error('Tekst musi mieć co najmniej 100 znaków')
  }
  if (!module_id) throw new Error('Wybierz moduł')

  let questions: GeneratedQuestion[] = []
  let errorMsg: string | undefined

  try {
    questions = await generateQuestionsFromText(text, count, difficulty as any)
  } catch (e: any) {
    errorMsg = e.message
  }

  // Log the job
  const { data: job } = await supabase
    .from('ai_generation_jobs')
    .insert({
      module_id,
      created_by:          user.id,
      status:              errorMsg ? 'failed' : 'completed',
      source_text:         text.slice(0, 5000),
      questions_generated: questions.length,
      result_raw:          questions.length > 0 ? questions : null,
      error_message:       errorMsg ?? null,
    })
    .select('id')
    .single()

  if (errorMsg) throw new Error(errorMsg)

  return { questions, jobId: job?.id ?? '' }
}

export async function saveGeneratedQuestions(
  moduleId: string,
  questions: GeneratedQuestion[]
) {
  const { user } = await requireAdmin()
  const supabase = await createClient()

  const rows = questions.map(q => ({
    module_id:         moduleId,
    question_text:     q.question_text,
    options:           JSON.stringify(q.options),
    correct_answer:    q.correct_answer,
    correct_option_id: String(q.correct_answer),
    explanation:       q.explanation || null,
    difficulty_text:   q.difficulty,
    difficulty:        q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3,
    is_active:         true,
    created_by:        user.id,
  }))

  const { error } = await supabase.from('questions').insert(rows)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/quizzes')
}
