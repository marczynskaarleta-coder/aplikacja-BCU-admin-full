'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react'

export function PasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (password.length < 6) { setError('Hasło musi mieć co najmniej 6 znaków'); return }
    if (password !== confirm) { setError('Hasła nie są identyczne'); return }

    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setPassword('')
        setConfirm('')
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  return (
    <Card className="border-2 border-foreground">
      <CardHeader className="border-b-2 border-foreground">
        <CardTitle className="font-black">Zmień hasło</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive font-medium border-2 border-destructive bg-destructive/5 p-3">{error}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="new-pass" className="font-bold">Nowe hasło</Label>
            <div className="relative">
              <Input
                id="new-pass"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 znaków"
                required
                className="border-2 border-foreground pr-10"
              />
              <button
                type="button"
                onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-pass" className="font-bold">Powtórz hasło</Label>
            <Input
              id="confirm-pass"
              type={show ? 'text' : 'password'}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              className="border-2 border-foreground"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            variant="outline"
            className="w-full font-bold border-2 border-foreground"
          >
            {isPending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : success
                ? <><CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />Hasło zmienione!</>
                : 'Zmień hasło'
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
