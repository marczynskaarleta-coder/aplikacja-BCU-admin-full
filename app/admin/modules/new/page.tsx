import { requireAdmin } from '@/lib/auth/helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createModule } from '../actions'

export const metadata = { title: 'Nowy moduł - Admin BCU' }

export default async function NewModulePage() {
  await requireAdmin()

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/modules">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Powrót
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black">Nowy moduł</h1>
          <p className="text-muted-foreground mt-1">Wypełnij podstawowe dane modułu</p>
        </div>
      </div>

      <Card className="border-2 border-foreground">
        <CardHeader className="border-b-2 border-foreground">
          <CardTitle className="font-black">Dane modułu</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form action={createModule} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-bold">Tytuł *</Label>
              <Input
                id="title"
                name="title"
                placeholder="np. Podstawy spedycji"
                required
                className="border-2 border-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold">Opis</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Krótki opis modułu widoczny na liście..."
                rows={3}
                className="border-2 border-foreground resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="font-bold">Kategoria</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="np. Prawo, Dokumenty..."
                  className="border-2 border-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty" className="font-bold">Poziom trudności</Label>
                <select
                  id="difficulty"
                  name="difficulty"
                  defaultValue="beginner"
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
                defaultValue="draft"
                className="w-full h-10 px-3 border-2 border-foreground bg-background text-sm font-medium"
              >
                <option value="draft">Draft (niewidoczny dla użytkowników)</option>
                <option value="published">Opublikowany</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1 font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Utwórz moduł
              </Button>
              <Link href="/admin/modules">
                <Button variant="outline" className="border-2 border-foreground font-bold">
                  Anuluj
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
