import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { GenerateForm } from './_components/generate-form'

export const metadata = { title: 'Generuj pytania AI - Admin BCU' }

export default async function GeneratePage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: modules } = await supabase
    .from('modules')
    .select('id, title')
    .order('order_index')

  const hasApiKey = !!process.env.ANTHROPIC_API_KEY

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
            <Sparkles className="w-7 h-7 text-primary" />
            Generuj pytania przez AI
          </h1>
          <p className="text-muted-foreground mt-1">
            Wklej fragment materiału — Claude wygeneruje pytania do quizu
          </p>
        </div>
      </div>

      {!hasApiKey && (
        <div className="border-2 border-yellow-500 bg-yellow-50 p-4 text-sm">
          <p className="font-bold text-yellow-800 mb-1">Brak klucza API</p>
          <p className="text-yellow-700">
            Dodaj <code className="bg-yellow-100 px-1">ANTHROPIC_API_KEY=sk-ant-...</code> do pliku <code>.env.local</code>.
            Klucz wygenerujesz na{' '}
            <span className="font-bold">console.anthropic.com</span>.
          </p>
        </div>
      )}

      <GenerateForm modules={modules ?? []} disabled={!hasApiKey} />
    </div>
  )
}
