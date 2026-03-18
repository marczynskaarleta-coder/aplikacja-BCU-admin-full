'use client'

import { useState, useTransition, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Plus, ExternalLink, FileText, Loader2 } from 'lucide-react'
import {
  updateModule,
  deleteModule,
  addModuleLink,
  deleteModuleLink,
  addModuleFile,
  deleteModuleFile,
} from '../../../actions'

type Tab = 'content' | 'files' | 'links'

interface ModuleFile {
  id: string
  name: string
  file_url: string
  file_type: string | null
  file_size: number | null
}

interface ModuleLink {
  id: string
  title: string
  url: string
  type: string
}

interface Module {
  id: string
  title: string
  description: string | null
  category: string | null
  difficulty: string
  status: string
  educational_content: string | null
}

interface Props {
  module: Module
  files: ModuleFile[]
  links: ModuleLink[]
}

const LINK_TYPE_LABELS: Record<string, string> = {
  video:    'Wideo',
  article:  'Artykuł',
  download: 'Pobierz',
  link:     'Link',
}

const LINK_TYPE_COLORS: Record<string, string> = {
  video:    'bg-purple-100 text-purple-800',
  article:  'bg-blue-100 text-blue-800',
  download: 'bg-green-100 text-green-800',
  link:     'bg-gray-100 text-gray-600',
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ModuleEditTabs({ module, files, links }: Props) {
  const [tab, setTab] = useState<Tab>('content')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handle = (fn: () => Promise<void>, successMsg?: string) => {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      try {
        await fn()
        if (successMsg) setSuccess(successMsg)
      } catch (e: any) {
        setError(e.message)
      }
    })
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'content', label: 'Treść i ustawienia' },
    { key: 'files',   label: 'Pliki',  count: files.length },
    { key: 'links',   label: 'Linki',  count: links.length },
  ]

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex border-b-2 border-foreground">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3 text-sm font-bold border-b-2 -mb-0.5 transition-colors ${
              tab === t.key
                ? 'border-foreground bg-primary text-primary-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="ml-2 text-xs font-black opacity-70">({t.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {(error || success) && (
        <div className={`px-4 py-2 text-sm font-medium border-2 ${error ? 'border-destructive text-destructive bg-destructive/5' : 'border-green-600 text-green-700 bg-green-50'}`}>
          {error ?? success}
        </div>
      )}

      {/* ── TAB: CONTENT ── */}
      {tab === 'content' && (
        <Card className="border-2 border-foreground">
          <CardHeader className="border-b-2 border-foreground">
            <CardTitle className="font-black">Treść i ustawienia</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form
              action={(fd) => handle(() => updateModule(module.id, fd), 'Zapisano zmiany!')}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="title" className="font-bold">Tytuł *</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={module.title}
                  required
                  className="border-2 border-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Opis (skrócony)</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={module.description ?? ''}
                  rows={2}
                  className="border-2 border-foreground resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="font-bold">Kategoria</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={module.category ?? ''}
                    className="border-2 border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="font-bold">Poziom trudności</Label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    defaultValue={module.difficulty}
                    className="w-full h-10 px-3 border-2 border-foreground bg-background text-sm font-medium"
                  >
                    <option value="beginner">Podstawowy</option>
                    <option value="intermediate">Średni</option>
                    <option value="advanced">Zaawansowany</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-bold">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={module.status}
                  className="w-full h-10 px-3 border-2 border-foreground bg-background text-sm font-medium"
                >
                  <option value="draft">Draft (niewidoczny dla użytkowników)</option>
                  <option value="published">Opublikowany</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="educational_content" className="font-bold">
                  Treść edukacyjna
                </Label>
                <p className="text-xs text-muted-foreground">
                  Tekst widoczny dla użytkowników przed quizem. Możesz wkleić materiały tu lub wgrać pliki na zakładce &quot;Pliki&quot;.
                </p>
                <Textarea
                  id="educational_content"
                  name="educational_content"
                  defaultValue={module.educational_content ?? ''}
                  rows={12}
                  className="border-2 border-foreground resize-y font-mono text-sm"
                  placeholder="Wklej treść materiału edukacyjnego..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Zapisz zmiany
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isPending}
                  className="border-2 border-destructive font-bold"
                  onClick={() => {
                    if (confirm('Usunąć ten moduł? Wszystkie pliki i linki zostaną usunięte.')) {
                      handle(() => deleteModule(module.id))
                    }
                  }}
                >
                  Usuń moduł
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── TAB: FILES ── */}
      {tab === 'files' && (
        <div className="space-y-4">
          {/* Upload form */}
          <Card className="border-2 border-foreground">
            <CardHeader className="border-b-2 border-foreground">
              <CardTitle className="font-black">Wgraj plik</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form
                action={(fd) => {
                  handle(() => addModuleFile(module.id, fd), 'Plik został wgrany!')
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="file-name" className="font-bold">Nazwa wyświetlana</Label>
                  <Input
                    id="file-name"
                    name="name"
                    placeholder="np. Skrypt – Podstawy spedycji"
                    className="border-2 border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="font-bold">Plik *</Label>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    name="file"
                    type="file"
                    required
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.mp4,.zip"
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-2 file:border-foreground file:font-bold file:bg-background hover:file:bg-muted cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    PDF, Word, PowerPoint, Excel, obrazy, MP4, ZIP — max 50 MB
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="gap-2 font-bold border-2 border-foreground"
                >
                  {isPending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Plus className="w-4 h-4" />
                  }
                  Wgraj plik
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* File list */}
          <Card className="border-2 border-foreground">
            <CardHeader className="border-b-2 border-foreground">
              <CardTitle className="font-black">Pliki modułu ({files.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {files.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground text-center">Brak plików</p>
              ) : (
                files.map(file => (
                  <div key={file.id} className="flex items-center gap-3 px-6 py-4 border-b border-border last:border-b-0">
                    <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {file.file_type ?? 'unknown'}{file.file_size ? ` · ${formatBytes(file.file_size)}` : ''}
                      </div>
                    </div>
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <Button variant="ghost" size="sm" title="Otwórz plik">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                    <form action={() => handle(() => deleteModuleFile(file.id, file.file_url, module.id), 'Plik usunięty')}>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
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
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TAB: LINKS ── */}
      {tab === 'links' && (
        <div className="space-y-4">
          {/* Add link form */}
          <Card className="border-2 border-foreground">
            <CardHeader className="border-b-2 border-foreground">
              <CardTitle className="font-black">Dodaj link</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form
                action={(fd) => handle(() => addModuleLink(module.id, fd), 'Link dodany!')}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="link-title" className="font-bold">Tytuł *</Label>
                    <Input
                      id="link-title"
                      name="title"
                      placeholder="np. Filmik – Listy przewozowe"
                      required
                      className="border-2 border-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link-type" className="font-bold">Typ</Label>
                    <select
                      id="link-type"
                      name="type"
                      defaultValue="link"
                      className="w-full h-10 px-3 border-2 border-foreground bg-background text-sm font-medium"
                    >
                      <option value="link">Link</option>
                      <option value="video">Wideo</option>
                      <option value="article">Artykuł</option>
                      <option value="download">Do pobrania</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link-url" className="font-bold">URL *</Label>
                  <Input
                    id="link-url"
                    name="url"
                    type="url"
                    placeholder="https://..."
                    required
                    className="border-2 border-foreground"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="gap-2 font-bold border-2 border-foreground"
                >
                  {isPending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Plus className="w-4 h-4" />
                  }
                  Dodaj link
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Link list */}
          <Card className="border-2 border-foreground">
            <CardHeader className="border-b-2 border-foreground">
              <CardTitle className="font-black">Linki modułu ({links.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {links.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground text-center">Brak linków</p>
              ) : (
                links.map(link => (
                  <div key={link.id} className="flex items-center gap-3 px-6 py-4 border-b border-border last:border-b-0">
                    <span className={`text-xs font-bold px-2 py-0.5 shrink-0 ${LINK_TYPE_COLORS[link.type] ?? 'bg-gray-100 text-gray-600'}`}>
                      {LINK_TYPE_LABELS[link.type] ?? link.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{link.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{link.url}</div>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <Button variant="ghost" size="sm" title="Otwórz link">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                    <form action={() => handle(() => deleteModuleLink(link.id, module.id), 'Link usunięty')}>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        title="Usuń link"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          if (!confirm(`Usunąć link "${link.title}"?`)) e.preventDefault()
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
