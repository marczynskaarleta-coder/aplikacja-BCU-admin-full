'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  userId: string
  firstName: string
  lastName: string
}

export function ProfileForm({ userId, firstName, lastName }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [first, setFirst] = useState(firstName)
  const [last, setLast] = useState(lastName)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: first.trim() || null,
          last_name:  last.trim()  || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  return (
    <Card className="border-2 border-foreground">
      <CardHeader className="border-b-2 border-foreground">
        <CardTitle className="font-black">Dane osobowe</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive font-medium border-2 border-destructive bg-destructive/5 p-3">{error}</p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first" className="font-bold">Imię</Label>
              <Input
                id="first"
                value={first}
                onChange={e => setFirst(e.target.value)}
                placeholder="Jan"
                className="border-2 border-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last" className="font-bold">Nazwisko</Label>
              <Input
                id="last"
                value={last}
                onChange={e => setLast(e.target.value)}
                placeholder="Kowalski"
                className="border-2 border-foreground"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            {isPending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : success
                ? <><CheckCircle2 className="w-4 h-4 mr-2" />Zapisano!</>
                : 'Zapisz zmiany'
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
