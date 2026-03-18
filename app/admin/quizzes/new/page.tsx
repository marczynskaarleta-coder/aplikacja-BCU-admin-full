import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { QuestionForm } from '../_components/question-form'
import { createQuestion } from '../actions'

export const metadata = { title: 'Nowe pytanie - Admin BCU' }

export default async function NewQuestionPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: modules } = await supabase
    .from('modules')
    .select('id, title')
    .order('order_index')

  if (!modules || modules.length === 0) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/quizzes">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Powrót
            </Button>
          </Link>
          <h1 className="text-3xl font-black">Nowe pytanie</h1>
        </div>
        <Card className="border-2 border-dashed border-muted-foreground">
          <CardContent className="p-12 text-center text-muted-foreground">
            <p className="font-bold mb-2">Brak modułów</p>
            <p className="text-sm mb-4">
              Najpierw dodaj moduł, do którego przypisane będzie pytanie.
            </p>
            <Link href="/admin/modules/new">
              <Button className="font-bold border-2 border-foreground">
                Dodaj moduł
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
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
        <div>
          <h1 className="text-3xl font-black">Nowe pytanie</h1>
          <p className="text-muted-foreground mt-1">Dodaj pytanie do quizu</p>
        </div>
      </div>

      <QuestionForm
        modules={modules}
        action={createQuestion}
        submitLabel="Zapisz pytanie"
      />
    </div>
  )
}
