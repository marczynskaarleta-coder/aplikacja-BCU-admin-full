import { createClient } from '@/lib/supabase/server'
import { requireAuth, isAdmin } from '@/lib/auth/helpers'
import { DashboardContent } from './dashboard-content'

export const metadata = {
  title: 'Dashboard - BCU Spedycja',
  description: 'Twój panel nauki na platformie BCU Spedycja',
}

export default async function DashboardPage() {
  const { user, profile } = await requireAuth()
  const supabase = await createClient()

  const [
    { data: modules },
    { count: totalQuestions },
    { data: answers },
    { count: reviewCount },
    { data: questionMeta },
  ] = await Promise.all([
    supabase.from('modules').select('*').order('order_index'),
    supabase.from('questions').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('user_answers').select('question_id, is_correct, questions(module_id)').eq('user_id', user.id),
    supabase.from('review_queue').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('questions').select('id, module_id').eq('is_active', true),
  ])

  // Liczba pytań per moduł
  const countByModule: Record<string, number> = {}
  questionMeta?.forEach(q => {
    countByModule[q.module_id] = (countByModule[q.module_id] || 0) + 1
  })

  // Unikalne poprawne odpowiedzi per moduł (z user_answers)
  const correctByModule: Record<string, Set<string>> = {}
  answers?.forEach(a => {
    if (!a.is_correct) return
    const moduleId = (a.questions as any)?.module_id
    if (!moduleId) return
    if (!correctByModule[moduleId]) correctByModule[moduleId] = new Set()
    correctByModule[moduleId].add(a.question_id)
  })

  // Moduły z postępem
  const modulesWithProgress = (modules || []).map(module => {
    const completed = correctByModule[module.id]?.size || 0
    const total = countByModule[module.id] || 0
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    return { ...module, completedCount: completed, totalCount: total, progressPercent: percent }
  })

  // Globalne statystyki
  const uniqueCorrect = new Set(
    (answers || []).filter(a => a.is_correct).map(a => a.question_id)
  ).size

  const uniqueAnswered = new Set(
    (answers || []).map(a => a.question_id)
  ).size

  return (
    <DashboardContent
      user={{
        id: user.id,
        email: user.email ?? '',
        firstName: profile?.first_name ?? '',
        lastName: profile?.last_name ?? '',
        isAdmin: isAdmin(user, profile),
      }}
      modules={modulesWithProgress}
      stats={{
        totalQuestions: totalQuestions || 0,
        answeredQuestions: uniqueAnswered,
        correctAnswers: uniqueCorrect,
        reviewCount: reviewCount || 0,
      }}
    />
  )
}
