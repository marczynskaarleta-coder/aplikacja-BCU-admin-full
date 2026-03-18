"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAppStore } from "@/lib/store"
import { adminQuestions, modules, users } from "@/lib/data"
import {
  ArrowLeft,
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  FileQuestion,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

export function AdminScreen() {
  const { goBack } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModule, setSelectedModule] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredQuestions = adminQuestions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesModule = selectedModule === "all" || q.moduleId === selectedModule
    return matchesSearch && matchesModule
  })

  const totalQuestions = adminQuestions.length
  const totalUsers = users.length
  const activeQuestions = adminQuestions.filter((q) => q.status === "active").length
  const avgProgress = Math.round(users.reduce((acc, u) => acc + u.progress, 0) / users.length)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border bg-background sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center bg-foreground">
              <span className="text-sm font-black text-background">B</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Panel Administratora</h1>
              <p className="text-xs text-muted-foreground">Zarzadzanie platforma BCU</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="border-2 border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary flex items-center justify-center">
                <FileQuestion className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-2xl font-black">{totalQuestions}</div>
                <div className="text-xs text-muted-foreground">Pytan</div>
              </div>
            </div>
          </div>
          <div className="border-2 border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-foreground flex items-center justify-center">
                <Users className="h-6 w-6 text-background" />
              </div>
              <div>
                <div className="text-2xl font-black">{totalUsers}</div>
                <div className="text-xs text-muted-foreground">Uzytkowników</div>
              </div>
            </div>
          </div>
          <div className="border-2 border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-success-foreground" />
              </div>
              <div>
                <div className="text-2xl font-black">{activeQuestions}</div>
                <div className="text-xs text-muted-foreground">Aktywnych</div>
              </div>
            </div>
          </div>
          <div className="border-2 border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-black">{avgProgress}%</div>
                <div className="text-xs text-muted-foreground">Sr. postep</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md border-2 border-border bg-transparent p-1">
            <TabsTrigger
              value="questions"
              className="font-bold data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              Pytania
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="font-bold data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              Uzytkownicy
            </TabsTrigger>
          </TabsList>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Szukaj pytan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2"
                />
              </div>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger className="w-full sm:w-[200px] border-2">
                  <SelectValue placeholder="Wybierz modul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie moduly</SelectItem>
                  {modules.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="font-bold">
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj pytanie
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-black">Dodaj nowe pytanie</DialogTitle>
                  </DialogHeader>
                  <FieldGroup className="space-y-4 mt-4">
                    <Field>
                      <FieldLabel className="font-bold">Pytanie</FieldLabel>
                      <Textarea placeholder="Wpisz tresc pytania..." className="border-2" />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel className="font-bold">Modul</FieldLabel>
                        <Select>
                          <SelectTrigger className="border-2">
                            <SelectValue placeholder="Wybierz modul" />
                          </SelectTrigger>
                          <SelectContent>
                            {modules.map((m) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel className="font-bold">Poziom trudnosci</FieldLabel>
                        <Select>
                          <SelectTrigger className="border-2">
                            <SelectValue placeholder="Wybierz poziom" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Latwe</SelectItem>
                            <SelectItem value="medium">Srednie</SelectItem>
                            <SelectItem value="hard">Trudne</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <FieldGroup className="space-y-3">
                      <FieldLabel className="font-bold">
                        Odpowiedzi (zaznacz poprawna)
                      </FieldLabel>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type="radio" name="correct" className="w-4 h-4" />
                          <Input placeholder={`Odpowiedz ${i}`} className="border-2" />
                        </div>
                      ))}
                    </FieldGroup>
                    <Field>
                      <FieldLabel className="font-bold">Wyjasnienie (opcjonalne)</FieldLabel>
                      <Textarea
                        placeholder="Wyjasnienie poprawnej odpowiedzi..."
                        className="border-2"
                      />
                    </Field>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Anuluj
                      </Button>
                      <Button onClick={() => setIsAddDialogOpen(false)} className="font-bold">
                        Zapisz pytanie
                      </Button>
                    </div>
                  </FieldGroup>
                </DialogContent>
              </Dialog>
            </div>

            {/* Questions Table */}
            <div className="border-2 border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead className="w-[50%] font-bold">Pytanie</TableHead>
                      <TableHead className="font-bold">Modul</TableHead>
                      <TableHead className="font-bold">Trudnosc</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="text-right font-bold">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.map((question) => {
                      const module = modules.find((m) => m.id === question.moduleId)
                      return (
                        <TableRow key={question.id}>
                          <TableCell className="font-medium">
                            <p className="line-clamp-2">{question.question}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-semibold">
                              {module?.title || "Nieznany"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                "font-bold",
                                question.difficulty === "easy" &&
                                  "bg-success text-success-foreground",
                                question.difficulty === "medium" &&
                                  "bg-primary text-primary-foreground",
                                question.difficulty === "hard" &&
                                  "bg-foreground text-background"
                              )}
                            >
                              {question.difficulty === "easy" && "Latwe"}
                              {question.difficulty === "medium" && "Srednie"}
                              {question.difficulty === "hard" && "Trudne"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                question.status === "active" ? "default" : "secondary"
                              }
                              className="font-semibold"
                            >
                              {question.status === "active" ? "Aktywne" : "Nieaktywne"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="border-2 border-border overflow-hidden">
              <div className="p-4 border-b-2 border-border bg-muted">
                <h3 className="font-bold text-lg">Wyniki uzytkowników</h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Uzytkownik</TableHead>
                      <TableHead className="font-bold">Email</TableHead>
                      <TableHead className="font-bold">Postep</TableHead>
                      <TableHead className="font-bold">Pytania</TableHead>
                      <TableHead className="font-bold">Ostatnia aktywnosc</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-semibold">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${user.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold">{user.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{user.questionsCompleted}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.lastActive.toLocaleDateString("pl-PL")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
