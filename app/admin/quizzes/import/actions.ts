'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { revalidatePath } from 'next/cache'

export interface ImportRow {
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct: 'A' | 'B' | 'C' | 'D'
  explanation?: string
  difficulty?: string
}

export interface ImportResult {
  saved: number
  errors: string[]
}

export async function importQuestionsFromCSV(
  moduleId: string,
  rows: ImportRow[]
): Promise<ImportResult> {
  const { user } = await requireAdmin()
  const supabase = await createClient()

  const errors: string[] = []
  const validRows = []

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    const lineNum = i + 2 // +2 bo 1 = nagłówek

    if (!r.question_text?.trim()) {
      errors.push(`Wiersz ${lineNum}: brak treści pytania`)
      continue
    }
    if (!r.option_a?.trim() || !r.option_b?.trim() || !r.option_c?.trim() || !r.option_d?.trim()) {
      errors.push(`Wiersz ${lineNum}: brak jednej z odpowiedzi A-D`)
      continue
    }
    if (!['A', 'B', 'C', 'D'].includes((r.correct ?? '').toUpperCase())) {
      errors.push(`Wiersz ${lineNum}: pole "correct" musi być A, B, C lub D`)
      continue
    }

    const correctIndex = { A: 0, B: 1, C: 2, D: 3 }[(r.correct as string).toUpperCase() as 'A'|'B'|'C'|'D']
    const diff = ['easy', 'medium', 'hard'].includes(r.difficulty ?? '')
      ? r.difficulty
      : 'easy'

    validRows.push({
      module_id:         moduleId,
      question_text:     r.question_text.trim(),
      options:           JSON.stringify([r.option_a.trim(), r.option_b.trim(), r.option_c.trim(), r.option_d.trim()]),
      correct_answer:    correctIndex,
      correct_option_id: String(correctIndex),
      explanation:       r.explanation?.trim() || null,
      difficulty_text:   diff,
      difficulty:        diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3,
      is_active:         true,
      created_by:        user.id,
    })
  }

  if (validRows.length === 0) {
    return { saved: 0, errors }
  }

  // Insert in batches of 100
  let saved = 0
  for (let i = 0; i < validRows.length; i += 100) {
    const batch = validRows.slice(i, i + 100)
    const { error } = await supabase.from('questions').insert(batch)
    if (error) {
      errors.push(`Błąd zapisu (wiersze ${i + 2}–${i + batch.length + 1}): ${error.message}`)
    } else {
      saved += batch.length
    }
  }

  revalidatePath('/admin/quizzes')
  return { saved, errors }
}
