'use client'

import { useState, useTransition, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Upload, Loader2, CheckCircle2, AlertTriangle,
  Download, FileSpreadsheet, Trash2
} from 'lucide-react'
import { importQuestionsFromCSV, ImportRow, ImportResult } from '../actions'
import { useRouter } from 'next/navigation'

interface Module { id: string; title: string }

// Simple CSV parser (handles quoted fields)
function parseCSV(text: string): string[][] {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  return lines
    .filter(line => line.trim())
    .map(line => {
      const cols: string[] = []
      let cur = ''
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') { cur += '"'; i++ }
          else inQuotes = !inQuotes
        } else if (ch === ',' && !inQuotes) {
          cols.push(cur.trim())
          cur = ''
        } else {
          cur += ch
        }
      }
      cols.push(cur.trim())
      return cols
    })
}

const REQUIRED_COLS = ['question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct']
const TEMPLATE_URL_DATA = `question_text,option_a,option_b,option_c,option_d,correct,explanation,difficulty
"Jaki dokument jest wymagany przy przewozie towaru w UE?","CMR","WZ","FV","Konosament","A","Konwencja CMR reguluje międzynarodowy przewóz drogowy towarów.","easy"
"Ile godzin może pracować kierowca bez przerwy?","4.5","6","8","9","A","Zgodnie z rozporządzeniem WE 561/2006 po 4,5h jazdy wymagana jest przerwa 45min.","medium"`

export function ImportForm({ modules }: { modules: Module[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [moduleId, setModuleId] = useState('')
  const [preview, setPreview] = useState<ImportRow[] | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setParseError(null)
    setPreview(null)
    setResult(null)

    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      try {
        const rows = parseCSV(text)
        if (rows.length < 2) {
          setParseError('Plik jest pusty lub ma tylko nagłówek')
          return
        }

        const headers = rows[0].map(h => h.toLowerCase().replace(/\s+/g, '_'))
        const missing = REQUIRED_COLS.filter(c => !headers.includes(c))
        if (missing.length > 0) {
          setParseError(`Brakuje kolumn: ${missing.join(', ')}. Pobierz szablon poniżej.`)
          return
        }

        const data: ImportRow[] = rows.slice(1).map(row => {
          const obj: any = {}
          headers.forEach((h, i) => { obj[h] = row[i] ?? '' })
          return obj as ImportRow
        })
        setPreview(data)
      } catch (err) {
        setParseError('Nie udało się odczytać pliku. Upewnij się że to CSV z separatorem przecinka.')
      }
    }
    reader.readAsText(file, 'UTF-8')
  }

  const handleImport = () => {
    if (!preview || !moduleId) return
    startTransition(async () => {
      const res = await importQuestionsFromCSV(moduleId, preview)
      setResult(res)
      if (res.saved > 0 && res.errors.length === 0) {
        setTimeout(() => router.push('/admin/quizzes'), 2000)
      }
    })
  }

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_URL_DATA], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'szablon_pytania_bcu.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setPreview(null)
    setResult(null)
    setParseError(null)
    setFileName('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-5">
      {/* Instructions */}
      <Card className="border-2 border-foreground">
        <CardHeader className="border-b-2 border-foreground">
          <CardTitle className="font-black">Format pliku CSV</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Plik CSV musi mieć następujące kolumny (nagłówek w pierwszym wierszu):
          </p>
          <div className="overflow-x-auto">
            <table className="text-xs border-2 border-foreground w-full">
              <thead>
                <tr className="bg-foreground text-background">
                  {['question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct', 'explanation*', 'difficulty*'].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-black whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-3 py-2 text-muted-foreground">treść pytania</td>
                  <td className="px-3 py-2 text-muted-foreground">odp. A</td>
                  <td className="px-3 py-2 text-muted-foreground">odp. B</td>
                  <td className="px-3 py-2 text-muted-foreground">odp. C</td>
                  <td className="px-3 py-2 text-muted-foreground">odp. D</td>
                  <td className="px-3 py-2 font-bold">A / B / C / D</td>
                  <td className="px-3 py-2 text-muted-foreground">opcjonalne</td>
                  <td className="px-3 py-2 text-muted-foreground">easy/medium/hard</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">* kolumny opcjonalne</p>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadTemplate}
            className="gap-2 border-2 border-foreground font-bold"
          >
            <Download className="w-4 h-4" />
            Pobierz szablon CSV
          </Button>
        </CardContent>
      </Card>

      {/* Upload */}
      <Card className="border-2 border-foreground">
        <CardHeader className="border-b-2 border-foreground">
          <CardTitle className="font-black">Wgraj plik i wybierz moduł</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold">Moduł *</Label>
              <select
                value={moduleId}
                onChange={e => setModuleId(e.target.value)}
                className="w-full h-10 px-3 border-2 border-foreground bg-background text-sm font-medium"
              >
                <option value="" disabled>Wybierz moduł...</option>
                {modules.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Plik CSV *</Label>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileChange}
                className="w-full text-sm file:mr-3 file:py-2 file:px-3 file:border-2 file:border-foreground file:font-bold file:bg-background hover:file:bg-muted cursor-pointer"
              />
            </div>
          </div>

          {parseError && (
            <div className="flex items-start gap-2 p-3 border-2 border-destructive bg-destructive/5 text-destructive text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{parseError}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      {preview && !result && (
        <Card className="border-2 border-foreground">
          <CardHeader className="border-b-2 border-foreground">
            <div className="flex items-center justify-between">
              <CardTitle className="font-black">
                Podgląd — {preview.length} pytań z &quot;{fileName}&quot;
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={reset} className="gap-2">
                <Trash2 className="w-4 h-4" />
                Usuń
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {preview.slice(0, 5).map((row, i) => (
              <div key={i} className="px-6 py-3 border-b border-border last:border-b-0 text-sm">
                <p className="font-bold truncate">{i + 1}. {row.question_text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  A: {row.option_a} · B: {row.option_b} · C: {row.option_c} · D: {row.option_d}
                  {' '} — <span className="font-bold text-green-700">Poprawna: {row.correct?.toUpperCase()}</span>
                </p>
              </div>
            ))}
            {preview.length > 5 && (
              <p className="px-6 py-3 text-sm text-muted-foreground">
                ... i {preview.length - 5} więcej pytań
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card className={`border-2 ${result.errors.length === 0 ? 'border-green-600 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
              <p className="font-black text-lg">
                Zapisano {result.saved} pytań!
              </p>
            </div>
            {result.errors.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-bold text-yellow-800">Pominięte wiersze ({result.errors.length}):</p>
                {result.errors.map((e, i) => (
                  <p key={i} className="text-xs text-yellow-700">{e}</p>
                ))}
              </div>
            )}
            {result.errors.length === 0 && (
              <p className="text-sm text-green-700">Za chwilę przekierowanie do listy pytań...</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Import button */}
      {preview && !result && (
        <Button
          onClick={handleImport}
          disabled={isPending || !moduleId}
          className="w-full h-12 text-base font-bold gap-2 border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          {isPending
            ? <><Loader2 className="w-5 h-5 animate-spin" />Importuję...</>
            : <><Upload className="w-5 h-5" />Importuj {preview.length} pytań</>
          }
        </Button>
      )}

      {!moduleId && preview && (
        <p className="text-sm text-center text-destructive font-medium">
          Wybierz moduł przed importem
        </p>
      )}
    </div>
  )
}
