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

  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .order('order_index')

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)

  const { count: totalQuestions } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { data: answers } = await supabase
    .from('user_answers')
    .select('question_id, is_correct')
    .eq('user_id', user.id)

  const { count: reviewCount } = await supabase
    .from('review_queue')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { data: questionCounts } = await supabase
    .from('questions')
    .select('module_id')
    .eq('is_active', true)

  const uniqueCorrectAnswers = new Set(
    (answers || []).filter(a => a.is_correct).map(a => a.question_id)
  ).size

  const uniqueTotalAnswered = new Set(
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
      modules={modules || []}
      progress={progress || []}
      questionCountsPerModule={(questionCounts || []).reduce((acc, q) => {
        acc[q.module_id] = (acc[q.module_id] || 0) + 1
        return acc
      }, {} as Record<string, number>)}
      stats={{
        totalQuestions: totalQuestions || 0,
        answeredQuestions: uniqueTotalAnswered,
        correctAnswers: uniqueCorrectAnswers,
        reviewCount: reviewCount || 0,
      }}
    />
  )
}
