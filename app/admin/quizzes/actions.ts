'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function parseQuestionForm(formData: FormData) {
  const question_text = (formData.get('question_text') as string)?.trim()
  const optionA       = (formData.get('optionA') as string)?.trim()
  const optionB       = (formData.get('optionB') as string)?.trim()
  const optionC       = (formData.get('optionC') as string)?.trim()
  const optionD       = (formData.get('optionD') as string)?.trim()
  const correct_answer = parseInt(formData.get('correct_answer') as string, 10)
  const explanation   = (formData.get('explanation') as string)?.trim()
  const difficulty    = formData.get('difficulty') as string
  const module_id     = formData.get('module_id') as string

  if (!question_text) throw new Error('Treść pytania jest wymagana')
  if (!optionA || !optionB || !optionC || !optionD) throw new Error('Wszystkie 4 odpowiedzi są wymagane')
  if (isNaN(correct_answer) || correct_answer < 0 || correct_answer > 3) throw new Error('Zaznacz poprawną odpowiedź')
  if (!module_id) throw new Error('Wybierz moduł')

  const validDifficulties = ['easy', 'medium', 'hard']
  const diff = validDifficulties.includes(difficulty) ? difficulty : 'easy'

  return {
    question_text,
    options:         JSON.stringify([optionA, optionB, optionC, optionD]),
    correct_answer,
    correct_option_id: String(correct_answer), // backward compat
    explanation:     explanation || null,
    difficulty_text: diff,
    difficulty:      diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3,
    module_id,
    is_active:       true,
  }
}

export async function createQuestion(formData: FormData) {
  const { user } = await requireAdmin()
  const supabase = await createClient()

  const data = parseQuestionForm(formData)

  const { error } = await supabase
    .from('questions')
    .insert({ ...data, created_by: user.id })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/quizzes')
  redirect('/admin/quizzes')
}

export async function updateQuestion(questionId: string, formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()

  const data = parseQuestionForm(formData)

  const { error } = await supabase
    .from('questions')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', questionId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/quizzes')
  redirect('/admin/quizzes')
}

export async function deleteQuestion(questionId: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', questionId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/quizzes')
  redirect('/admin/quizzes')
}

export async function toggleQuestionActive(questionId: string, current: boolean) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('questions')
    .update({ is_active: !current, updated_at: new Date().toISOString() })
    .eq('id', questionId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/quizzes')
}
