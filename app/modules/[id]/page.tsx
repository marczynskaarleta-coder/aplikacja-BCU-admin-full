import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/helpers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, HelpCircle, BookOpen, ExternalLink, FileText, Video, Newspaper } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

const LINK_TYPE_ICONS: Record<string, any> = {
  video:    Video,
  article:  Newspaper,
  download: Download,
  link:     ExternalLink,
}

const LINK_TYPE_COLORS: Record<string, string> = {
  video:    'bg-purple-100 text-purple-800 border-purple-300',
  article:  'bg-blue-100 text-blue-800 border-blue-300',
  download: 'bg-green-100 text-green-800 border-green-300',
  link:     'bg-gray-100 text-gray-700 border-gray-300',
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default async function ModuleDetailPage({ params }: Props) {
  const { id } = await params
  const { user } = await requireAuth()
  const supabase = await createClient()

  const { data: module } = await supabase
    .from('modules')
    .select('*')
    .eq('id', id)
    .single()

  if (!module) notFound()

  const [{ data: questions }, { data: files }, { data: links }] = await Promise.all([
    supabase
      .from('questions')
      .select('id, difficulty')
      .eq('module_id', id)
      .eq('is_active', true),
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

  const questionCount = questions?.length || 0
  const easy   = questions?.filter(q => q.difficulty === 'easy').length   || 0
  const medium = questions?.filter(q => q.difficulty === 'medium').length || 0
  const hard   = questions?.filter(q => q.difficulty === 'hard').length   || 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-foreground sticky top-0 z-50 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/modules" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Moduły</span>
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/images/bcu-logo.png"
                alt="BCU Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </Link>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Tytuł modułu */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-primary shrink-0">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-black">{module.title}</h1>
              {module.description && (
                <p className="text-muted-foreground mt-1">{module.description}</p>
              )}
            </div>
          </div>

          {/* Statystyki pytań */}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-foreground bg-background">
              <HelpCircle className="w-4 h-4" />
              <span className="font-bold text-sm">{questionCount} pytań</span>
            </div>
            {easy > 0 && (
              <Badge className="border-2 border-green-600 bg-green-50 text-green-700 font-bold">
                {easy} łatwych
              </Badge>
            )}
            {medium > 0 && (
              <Badge className="border-2 border-yellow-600 bg-yellow-50 text-yellow-700 font-bold">
                {medium} średnich
              </Badge>
            )}
            {hard > 0 && (
              <Badge className="border-2 border-red-600 bg-red-50 text-red-700 font-bold">
                {hard} trudnych
              </Badge>
            )}
          </div>
        </div>

        {/* Treść edukacyjna */}
        {module.educational_content && (
          <Card className="border-2 border-foreground mb-6">
            <CardHeader className="border-b-2 border-foreground">
              <CardTitle className="font-black">Materiał</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {module.educational_content}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pliki modułu */}
        {files && files.length > 0 && (
          <Card className="border-2 border-foreground mb-6">
            <CardHeader className="border-b-2 border-foreground">
              <CardTitle className="font-black flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Pliki do pobrania ({files.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {files.map((file) => (
                <a
                  key={file.id}
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors group"
                >
                  <div className="p-2 bg-foreground text-background group-hover:bg-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{file.name}</div>
                    {file.file_size && (
                      <div className="text-xs text-muted-foreground">
                        {formatBytes(file.file_size)}
                      </div>
                    )}
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                </a>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Linki modułu */}
        {links && links.length > 0 && (
          <Card className="border-2 border-foreground mb-6">
            <CardHeader className="border-b-2 border-foreground">
              <CardTitle className="font-black flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Dodatkowe materiały ({links.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {links.map((link) => {
                const Icon = LINK_TYPE_ICONS[link.type] ?? ExternalLink
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors group"
                  >
                    <span className={`text-xs font-bold px-2 py-0.5 border shrink-0 ${LINK_TYPE_COLORS[link.type] ?? 'bg-gray-100 text-gray-600 border-gray-300'}`}>
                      {link.type === 'video' ? 'Wideo' : link.type === 'article' ? 'Artykuł' : link.type === 'download' ? 'Pobierz' : 'Link'}
                    </span>
                    <span className="flex-1 font-bold text-sm truncate group-hover:text-primary">
                      {link.title}
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                  </a>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Akcje */}
        <div className="flex flex-col sm:flex-row gap-4">
          {questionCount > 0 ? (
            <Link href={`/quiz?module=${id}`} className="flex-1">
              <Button className="w-full h-12 text-lg font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                Rozpocznij quiz ({questionCount} pytań)
              </Button>
            </Link>
          ) : (
            <Card className="flex-1 border-2 border-dashed border-muted-foreground">
              <CardContent className="p-4 text-center text-muted-foreground text-sm">
                Brak pytań w tym module
              </CardContent>
            </Card>
          )}
          <Link href="/modules">
            <Button variant="outline" className="h-12 font-bold border-2 border-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
