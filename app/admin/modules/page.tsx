import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react'
import { toggleModuleStatus } from './actions'

export const metadata = { title: 'Moduły - Admin BCU' }

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner:     'Podstawowy',
  intermediate: 'Średni',
  advanced:     'Zaawansowany',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner:     'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced:     'bg-red-100 text-red-800',
}

export default async function AdminModulesPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: modules, error } = await supabase
    .from('modules')
    .select('id, title, description, category, difficulty, status, order_index, created_at')
    .order('order_index', { ascending: true })

  const { data: questionCounts } = await supabase
    .from('questions')
    .select('module_id')

  const countByModule: Record<string, number> = {}
  questionCounts?.forEach(q => {
    countByModule[q.module_id] = (countByModule[q.module_id] || 0) + 1
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Moduły</h1>
          <p className="text-muted-foreground mt-1">
            {modules?.length ?? 0} modułów w bazie
          </p>
        </div>
        <Link href="/admin/modules/new">
          <Button className="gap-2 font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            <Plus className="w-4 h-4" />
            Nowy moduł
          </Button>
        </Link>
      </div>

      <Card className="border-2 border-foreground">
        <CardHeader className="border-b-2 border-foreground pb-4">
          <div className="grid grid-cols-12 text-xs font-black uppercase text-muted-foreground">
            <span className="col-span-4">Moduł</span>
            <span className="col-span-2">Kategoria</span>
            <span className="col-span-2">Poziom</span>
            <span className="col-span-1 text-center">Pytań</span>
            <span className="col-span-1 text-center">Status</span>
            <span className="col-span-2 text-right">Akcje</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error && (
            <p className="p-6 text-sm text-destructive">
              Błąd: {error.message}. Uruchom scripts/003_modules_files.sql
            </p>
          )}
          {!error && (!modules || modules.length === 0) && (
            <div className="p-12 text-center text-muted-foreground">
              <p className="font-bold mb-2">Brak modułów</p>
              <p className="text-sm">Kliknij &quot;Nowy moduł&quot; aby dodać pierwszy.</p>
            </div>
          )}
          {modules?.map((module) => (
            <div
              key={module.id}
              className="grid grid-cols-12 items-center px-6 py-4 border-b border-border text-sm hover:bg-muted/30"
            >
              <div className="col-span-4 min-w-0">
                <div className="font-bold truncate">{module.title}</div>
                {module.description && (
                  <div className="text-xs text-muted-foreground truncate mt-0.5">
                    {module.description}
                  </div>
                )}
              </div>

              <div className="col-span-2 text-xs text-muted-foreground">
                {module.category || '—'}
              </div>

              <div className="col-span-2">
                <span className={`text-xs font-bold px-2 py-0.5 ${DIFFICULTY_COLORS[module.difficulty] ?? 'bg-muted text-muted-foreground'}`}>
                  {DIFFICULTY_LABELS[module.difficulty] ?? module.difficulty}
                </span>
              </div>

              <div className="col-span-1 text-center text-xs font-bold">
                {countByModule[module.id] || 0}
              </div>

              <div className="col-span-1 text-center">
                <span className={`text-xs font-bold px-2 py-0.5 ${module.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {module.status === 'published' ? 'Pub.' : 'Draft'}
                </span>
              </div>

              <div className="col-span-2 flex justify-end gap-1">
                <form action={toggleModuleStatus.bind(null, module.id, module.status)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="submit"
                    title={module.status === 'published' ? 'Cofnij do draftu' : 'Opublikuj'}
                  >
                    {module.status === 'published'
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </Button>
                </form>
                <Link href={`/admin/modules/${module.id}/edit`}>
                  <Button variant="ghost" size="sm" title="Edytuj moduł">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
