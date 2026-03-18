import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ModuleEditTabs } from './_components/module-edit-tabs'

export const metadata = { title: 'Edycja modułu - Admin BCU' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditModulePage({ params }: Props) {
  await requireAdmin()
  const { id } = await params
  const supabase = await createClient()

  const { data: module } = await supabase
    .from('modules')
    .select('*')
    .eq('id', id)
    .single()

  if (!module) notFound()

  const [{ data: files }, { data: links }] = await Promise.all([
    supabase
      .from('module_files')
      .select('*')
      .eq('module_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('module_links')
      .select('*')
      .eq('module_id', id)
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/modules">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Powrót
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black truncate">{module.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-xs font-bold px-2 py-0.5 ${module.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {module.status === 'published' ? 'Opublikowany' : 'Draft'}
            </span>
            {module.category && (
              <span className="text-xs text-muted-foreground">{module.category}</span>
            )}
          </div>
        </div>
      </div>

      <ModuleEditTabs module={module} files={files ?? []} links={links ?? []} />
    </div>
  )
}
