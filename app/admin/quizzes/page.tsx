import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Pencil, Eye, EyeOff, Sparkles, FileSpreadsheet } from 'lucide-react'
import { toggleQuestionActive } from './actions'
import { ModuleFilter } from './_components/module-filter'

export const metadata = { title: 'Quizy - Admin BCU' }

const DIFF_LABELS: Record<string, string> = {
  easy:   'Łatwe',
  medium: 'Średnie',
  hard:   'Trudne',
}
const DIFF_COLORS: Record<string, string> = {
  easy:   'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard:   'bg-red-100 text-red-800',
}

interface Props {
  searchParams: Promise<{ module?: string }>
}

export default async function AdminQuizzesPage({ searchParams }: Props) {
  await requireAdmin()
  const { module: moduleFilter } = await searchParams
  const supabase = await createClient()

  const [{ data: modules }, questionsResult] = await Promise.all([
    supabase
      .from('modules')
      .select('id, title')
      .order('order_index'),
    (() => {
      let q = supabase
        .from('questions')
        .select('id, question_text, difficulty_text, difficulty, is_active, module_id, modules(title)')
        .order('created_at', { ascending: false })
      if (moduleFilter) q = q.eq('module_id', moduleFilter)
      return q
    })(),
  ])

  const { data: questions, error } = questionsResult

  type QuestionRow = { id: string; question_text: string; difficulty_text: string | null; difficulty: number | string; is_active: boolean; module_id: string; modules: { title: string } | null }
  const byModule: Record<string, { title: string; questions: QuestionRow[] }> = {}
  questions?.forEach(q => {
    const modTitle = q.modules?.title ?? 'Bez modułu'
    if (!byModule[q.module_id]) byModule[q.module_id] = { title: modTitle, questions: [] }
    byModule[q.module_id].questions.push(q as QuestionRow)
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Quizy</h1>
          <p className="text-muted-foreground mt-1">
            {questions?.length ?? 0} pytań w bazie
          </p>
        </div>
        <div className="flex gap-3">
          {/* Filter by module */}
          <ModuleFilter modules={modules ?? []} selected={moduleFilter ?? ''} />
          <Link href="/admin/quizzes/import">
            <Button variant="outline" className="gap-2 font-bold border-2 border-foreground">
              <FileSpreadsheet className="w-4 h-4" />
              Import CSV
            </Button>
          </Link>
          <Link href="/admin/quizzes/generate">
            <Button variant="outline" className="gap-2 font-bold border-2 border-foreground">
              <Sparkles className="w-4 h-4" />
              Generuj AI
            </Button>
          </Link>
          <Link href="/admin/quizzes/new">
            <Button className="gap-2 font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              <Plus className="w-4 h-4" />
              Nowe pytanie
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive border-2 border-destructive p-4">
          Błąd: {error.message}. Uruchom scripts/004_questions_admin.sql
        </p>
      )}

      {!error && (!questions || questions.length === 0) && (
        <Card className="border-2 border-dashed border-muted-foreground">
          <CardContent className="p-12 text-center text-muted-foreground">
            <p className="font-bold mb-2">Brak pytań</p>
            <p className="text-sm">Kliknij &quot;Nowe pytanie&quot; aby dodać pierwsze.</p>
          </CardContent>
        </Card>
      )}

      {Object.entries(byModule).map(([moduleId, group]) => (
        <Card key={moduleId} className="border-2 border-foreground">
          <CardHeader className="border-b-2 border-foreground pb-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg">{group.title}</h2>
              <span className="text-sm text-muted-foreground font-bold">
                {group.questions.length} pytań
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-12 px-6 py-2 text-xs font-black uppercase text-muted-foreground border-b border-border">
              <span className="col-span-7">Pytanie</span>
              <span className="col-span-2">Poziom</span>
              <span className="col-span-1 text-center">Aktywne</span>
              <span className="col-span-2 text-right">Akcje</span>
            </div>
            {group.questions.map((q) => {
              const diff = q.difficulty_text ?? (q.difficulty === 1 ? 'easy' : q.difficulty === 2 ? 'medium' : 'hard')
              return (
                <div
                  key={q.id}
                  className={`grid grid-cols-12 items-center px-6 py-3 border-b border-border last:border-b-0 text-sm ${!q.is_active ? 'opacity-50' : ''}`}
                >
                  <div className="col-span-7 min-w-0 pr-4">
                    <p className="truncate">{q.question_text}</p>
                  </div>

                  <div className="col-span-2">
                    <span className={`text-xs font-bold px-2 py-0.5 ${DIFF_COLORS[diff] ?? 'bg-muted'}`}>
                      {DIFF_LABELS[diff] ?? diff}
                    </span>
                  </div>

                  <div className="col-span-1 text-center">
                    <form action={toggleQuestionActive.bind(null, q.id, q.is_active)}>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        title={q.is_active ? 'Dezaktywuj' : 'Aktywuj'}
                      >
                        {q.is_active
                          ? <Eye className="w-4 h-4 text-green-600" />
                          : <EyeOff className="w-4 h-4 text-muted-foreground" />
                        }
                      </Button>
                    </form>
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <Link href={`/admin/quizzes/${q.id}/edit`}>
                      <Button variant="ghost" size="sm" title="Edytuj pytanie">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
