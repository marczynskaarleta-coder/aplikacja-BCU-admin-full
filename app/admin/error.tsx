'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
      <div className="w-16 h-16 bg-destructive/10 border-2 border-destructive flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-black mb-2">Wystąpił błąd</h2>
      <p className="text-muted-foreground mb-2 max-w-md">
        {error.message || 'Coś poszło nie tak. Sprawdź czy uruchomiłeś wszystkie migracje SQL.'}
      </p>
      {error.message?.includes('column') && (
        <p className="text-sm text-muted-foreground mb-6 max-w-md p-3 border-2 border-yellow-400 bg-yellow-50">
          Prawdopodobna przyczyna: nie uruchomiono migracji SQL.<br />
          Uruchom pliki <strong>scripts/002–005</strong> w Supabase SQL Editor.
        </p>
      )}
      <Button
        onClick={reset}
        className="gap-2 font-bold border-2 border-foreground mt-4"
      >
        <RotateCcw className="w-4 h-4" />
        Spróbuj ponownie
      </Button>
    </div>
  )
}
