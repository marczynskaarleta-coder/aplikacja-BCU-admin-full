'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  BookOpen,
  Users,
  HelpCircle,
  BarChart3,
  Plus,
  Search,
  ArrowLeft,
  Trash2,
  Edit,
  Save,
  Upload,
  FileText,
  X,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AdminContentProps {
  modules: Array<{
    id: string
    title: string
    description: string
    icon: string
    order_index: number
    is_active: boolean
    file_url: string | null
  }>
  questions: Array<{
    id: string
    module_id: string
    question_text: string
    options: string[]
    correct_answer: number
    explanation: string
    difficulty: string
    is_active: boolean
    modules: { title: string } | null
  }>
  stats: {
    totalUsers: number
    totalQuestions: number
    totalAnswers: number
  }
}

export function AdminContent({ modules, questions, stats }: AdminContentProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModule, setShowAddModule] = useState(false)
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)

  // New module form
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
  })
  const [moduleFile, setModuleFile] = useState<File | null>(null)
  
  // New question form
  const [newQuestion, setNewQuestion] = useState({
    module_id: '',
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    explanation: '',
    difficulty: 'medium',
  })

  const filteredQuestions = questions.filter(q =>
    q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.modules?.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUploadProgress(null)

    const supabase = createClient()
    let file_url: string | null = null

    if (moduleFile) {
      setUploadProgress('Przesyłanie pliku...')
      const fileName = `${Date.now()}-${moduleFile.name.replace(/\s+/g, '_')}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('module-files')
        .upload(fileName, moduleFile, { upsert: false })

      if (uploadError) {
        setUploadProgress(`Błąd uploadu: ${uploadError.message}`)
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('module-files')
        .getPublicUrl(uploadData.path)
      file_url = urlData.publicUrl
      setUploadProgress(null)
    }

    const { error } = await supabase.from('modules').insert({
      title: newModule.title,
      description: newModule.description,
      order_index: modules.length,
      file_url,
    })

    if (!error) {
      setNewModule({ title: '', description: '' })
      setModuleFile(null)
      setShowAddModule(false)
      router.refresh()
    }

    setLoading(false)
  }

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const supabase = createClient()
    const { error } = await supabase.from('questions').insert({
      module_id: newQuestion.module_id,
      question_text: newQuestion.question_text,
      options: newQuestion.options,
      correct_answer: newQuestion.correct_answer,
      explanation: newQuestion.explanation,
      difficulty: newQuestion.difficulty,
    })
    
    if (!error) {
      setNewQuestion({
        module_id: '',
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: '',
        difficulty: 'medium',
      })
      setShowAddQuestion(false)
      router.refresh()
    }
    
    setLoading(false)
  }

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć to pytanie?')) return
    
    const supabase = createClient()
    await supabase.from('questions').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-foreground text-background border-b-2 border-foreground">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 hover:text-primary">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link href="/dashboard" className="flex items-center gap-3">
                <Image
                  src="/images/bcu-logo.png"
                  alt="BCU Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <span className="font-black text-lg">Panel Administratora</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-2 border-foreground">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-black">{stats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Użytkowników</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-foreground">
                  <HelpCircle className="w-6 h-6 text-background" />
                </div>
                <div>
                  <p className="text-3xl font-black">{stats.totalQuestions}</p>
                  <p className="text-sm text-muted-foreground">Pytań</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-foreground">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-foreground">
                  <BarChart3 className="w-6 h-6 text-background" />
                </div>
                <div>
                  <p className="text-3xl font-black">{stats.totalAnswers}</p>
                  <p className="text-sm text-muted-foreground">Odpowiedzi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="border-2 border-foreground p-1 bg-background">
            <TabsTrigger value="modules" className="font-bold data-[state=active]:bg-foreground data-[state=active]:text-background">
              <BookOpen className="w-4 h-4 mr-2" />
              Moduły ({modules.length})
            </TabsTrigger>
            <TabsTrigger value="questions" className="font-bold data-[state=active]:bg-foreground data-[state=active]:text-background">
              <HelpCircle className="w-4 h-4 mr-2" />
              Pytania ({questions.length})
            </TabsTrigger>
          </TabsList>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Moduły</h2>
              <Button 
                onClick={() => setShowAddModule(!showAddModule)}
                className="gap-2 font-bold border-2 border-foreground"
              >
                <Plus className="w-4 h-4" />
                Dodaj moduł
              </Button>
            </div>

            {showAddModule && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle>Nowy moduł</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddModule} className="space-y-4">
                    <Field>
                      <FieldLabel>Nazwa modułu</FieldLabel>
                      <Input
                        value={newModule.title}
                        onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                        placeholder="np. Dokumentacja transportowa"
                        required
                        className="border-2 border-foreground"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Opis</FieldLabel>
                      <Input
                        value={newModule.description}
                        onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                        placeholder="Krótki opis modułu..."
                        className="border-2 border-foreground"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Materiały do pobrania (PDF, DOCX, itp.)</FieldLabel>
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-foreground cursor-pointer hover:bg-muted transition-colors">
                        {moduleFile ? (
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <FileText className="w-5 h-5 text-primary" />
                            <span className="max-w-[200px] truncate">{moduleFile.name}</span>
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); setModuleFile(null) }}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-muted-foreground">
                            <Upload className="w-6 h-6" />
                            <span className="text-xs">Kliknij, aby wybrać plik</span>
                          </div>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                          onChange={(e) => setModuleFile(e.target.files?.[0] || null)}
                        />
                      </label>
                      {uploadProgress && (
                        <p className="text-xs text-muted-foreground mt-1">{uploadProgress}</p>
                      )}
                    </Field>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading} className="gap-2 font-bold">
                        <Save className="w-4 h-4" />
                        Zapisz
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddModule(false)}>
                        Anuluj
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((module, index) => (
                <Card key={module.id} className="border-2 border-foreground">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground font-black">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 ${module.is_active ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {module.is_active ? 'Aktywny' : 'Nieaktywny'}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{module.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                    {module.file_url && (
                      <a
                        href={module.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        <FileText className="w-3 h-3" />
                        Plik załączony
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Pytania</h2>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj pytań..."
                    className="pl-10 border-2 border-foreground"
                  />
                </div>
                <Button 
                  onClick={() => setShowAddQuestion(!showAddQuestion)}
                  className="gap-2 font-bold border-2 border-foreground shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Dodaj
                </Button>
              </div>
            </div>

            {showAddQuestion && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle>Nowe pytanie</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddQuestion} className="space-y-4">
                    <Field>
                      <FieldLabel>Moduł</FieldLabel>
                      <select
                        value={newQuestion.module_id}
                        onChange={(e) => setNewQuestion({ ...newQuestion, module_id: e.target.value })}
                        required
                        className="w-full h-10 px-3 border-2 border-foreground bg-background"
                      >
                        <option value="">Wybierz moduł...</option>
                        {modules.map((m) => (
                          <option key={m.id} value={m.id}>{m.title}</option>
                        ))}
                      </select>
                    </Field>
                    <Field>
                      <FieldLabel>Treść pytania</FieldLabel>
                      <Input
                        value={newQuestion.question_text}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                        placeholder="Wpisz treść pytania..."
                        required
                        className="border-2 border-foreground"
                      />
                    </Field>
                    <div className="space-y-2">
                      <FieldLabel>Odpowiedzi</FieldLabel>
                      {newQuestion.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="correct"
                            checked={newQuestion.correct_answer === i}
                            onChange={() => setNewQuestion({ ...newQuestion, correct_answer: i })}
                            className="w-5 h-5"
                          />
                          <Input
                            value={opt}
                            onChange={(e) => {
                              const opts = [...newQuestion.options]
                              opts[i] = e.target.value
                              setNewQuestion({ ...newQuestion, options: opts })
                            }}
                            placeholder={`Odpowiedź ${String.fromCharCode(65 + i)}`}
                            required
                            className="border-2 border-foreground flex-1"
                          />
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground">Zaznacz prawidłową odpowiedź</p>
                    </div>
                    <Field>
                      <FieldLabel>Wyjaśnienie (opcjonalne)</FieldLabel>
                      <Input
                        value={newQuestion.explanation}
                        onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                        placeholder="Wyjaśnienie poprawnej odpowiedzi..."
                        className="border-2 border-foreground"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Poziom trudności</FieldLabel>
                      <select
                        value={newQuestion.difficulty}
                        onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                        className="w-full h-10 px-3 border-2 border-foreground bg-background"
                      >
                        <option value="easy">Łatwy</option>
                        <option value="medium">Średni</option>
                        <option value="hard">Trudny</option>
                      </select>
                    </Field>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading} className="gap-2 font-bold">
                        <Save className="w-4 h-4" />
                        Zapisz
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddQuestion(false)}>
                        Anuluj
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {filteredQuestions.length === 0 ? (
              <Card className="border-2 border-dashed border-muted-foreground">
                <CardContent className="p-12 text-center">
                  <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-bold text-lg mb-2">Brak pytań</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Nie znaleziono pytań pasujących do wyszukiwania.' : 'Dodaj pierwsze pytanie do bazy.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {filteredQuestions.slice(0, 20).map((question) => (
                  <Card key={question.id} className="border-2 border-foreground">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold px-2 py-0.5 bg-muted">
                              {question.modules?.title || 'Brak modułu'}
                            </span>
                            <span className={`text-xs font-bold px-2 py-0.5 ${
                              question.difficulty === 'easy' ? 'bg-success/20 text-success' :
                              question.difficulty === 'hard' ? 'bg-destructive/20 text-destructive' :
                              'bg-primary/20 text-primary-foreground'
                            }`}>
                              {question.difficulty === 'easy' ? 'Łatwy' : question.difficulty === 'hard' ? 'Trudny' : 'Średni'}
                            </span>
                          </div>
                          <p className="font-medium text-sm line-clamp-2">{question.question_text}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredQuestions.length > 20 && (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    Wyświetlono 20 z {filteredQuestions.length} pytań
                  </p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
