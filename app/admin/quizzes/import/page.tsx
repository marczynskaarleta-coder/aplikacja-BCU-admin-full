import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, FileSpreadsheet } from 'lucide-react'
import { ImportForm } from './_components/import-form'

export const metadata = { title: 'Import pytań z CSV - Admin BCU' }

export default async function ImportPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: modules } = await supabase
    .from('modules')
    .select('id, title')
    .order('order_index')

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/quizzes">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Powrót
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2">
            <FileSpreadsheet className="w-7 h-7 text-primary" />
            Import z CSV
          </h1>
          <p className="text-muted-foreground mt-1">
            Wgraj setki pytań naraz z pliku Excel/CSV
          </p>
        </div>
      </div>

      <ImportForm modules={modules ?? []} />
    </div>
  )
}
