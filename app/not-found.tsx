import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md">
        <div className="text-8xl font-black mb-4 leading-none">404</div>
        <h1 className="text-2xl font-black mb-2">Strona nie istnieje</h1>
        <p className="text-muted-foreground mb-8">
          Szukana strona została usunięta lub nigdy nie istniała.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard">
            <Button className="font-bold border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              Przejdź do aplikacji
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="gap-2 font-bold border-2 border-foreground">
              <ArrowLeft className="w-4 h-4" />
              Strona główna
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
