import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, ExternalLink, Trash2, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { deleteModuleFile } from '../modules/actions'

export const metadata = { title: 'Pliki - Admin BCU' }

function formatBytes(bytes: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default async function AdminFilesPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: files, error } = await supabase
    .from('module_files')
    .select(`
      id, name, file_url, file_type, file_size, created_at, module_id,
      modules(title)
    `)
    .order('created_at', { ascending: false })

  // Total storage used
  const totalBytes = files?.reduce((sum, f) => sum + (f.file_size ?? 0), 0) ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Pliki</h1>
          <p className="text-muted-foreground mt-1">
            {files?.length ?? 0} plików · {formatBytes(totalBytes)} łącznie
          </p>
        </div>
        <Link href="/admin/modules">
          <Button variant="outline" className="gap-2 font-bold border-2 border-foreground">
            <FolderOpen className="w-4 h-4" />
            Wgraj przez moduł
          </Button>
        </Link>
      </div>

      <Card className="border-2 border-foreground">
        <CardHeader className="border-b-2 border-foreground pb-4">
          <div className="grid grid-cols-12 text-xs font-black uppercase text-muted-foreground">
            <span className="col-span-4">Nazwa pliku</span>
            <span className="col-span-3">Moduł</span>
            <span className="col-span-2">Typ</span>
            <span className="col-span-1">Rozmiar</span>
            <span className="col-span-2 text-right">Akcje</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error && (
            <p className="p-6 text-sm text-destructive">
              Błąd: {error.message}. Uruchom scripts/003_modules_files.sql
            </p>
          )}
          {!error && (!files || files.length === 0) && (
            <div className="p-12 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-bold mb-1">Brak plików</p>
              <p className="text-sm">
                Pliki wgrywasz przez zakładkę{' '}
                <Link href="/admin/modules" className="underline font-bold">
                  Moduły → edytuj moduł → Pliki
                </Link>
              </p>
            </div>
          )}
          {files?.map((file) => (
            <div
              key={file.id}
              className="grid grid-cols-12 items-center px-6 py-3 border-b border-border last:border-b-0 text-sm hover:bg-muted/30"
            >
              <div className="col-span-4 flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 shrink-0 text-muted-foreground" />
                <span className="truncate font-medium">{file.name}</span>
              </div>

              <div className="col-span-3 text-xs text-muted-foreground truncate">
                {(file.modules as any)?.title ?? '—'}
              </div>

              <div className="col-span-2 text-xs text-muted-foreground">
                {file.file_type?.split('/')[1]?.toUpperCase() ?? '—'}
              </div>

              <div className="col-span-1 text-xs text-muted-foreground">
                {formatBytes(file.file_size)}
              </div>

              <div className="col-span-2 flex justify-end gap-1">
                <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" title="Otwórz plik">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
                <form action={deleteModuleFile.bind(null, file.id, file.file_url, file.module_id)}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    title="Usuń plik"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      if (!confirm(`Usunąć plik "${file.name}"?`)) e.preventDefault()
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
