import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/helpers'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Moduły - BCU Spedycja',
  description: 'Przeglądaj wszystkie moduły kursu',
}

export default async function ModulesPage() {
  const { user } = await requireAuth()
  const supabase = await createClient()

  // Get published modules (RLS ensures only published are returned for non-admins)
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .order('order_index')
  
  // Get user progress
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
  
  // Get question counts per module
  const { data: questionCounts } = await supabase
    .from('questions')
    .select('module_id')
    .eq('is_active', true)

  const countByModule: Record<string, number> = {}
  questionCounts?.forEach(q => {
    countByModule[q.module_id] = (countByModule[q.module_id] || 0) + 1
  })

  const getModuleProgress = (moduleId: string) => {
    const p = progress?.find(pr => pr.module_id === moduleId)
    return p?.completed_questions?.length || 0
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-foreground">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Powrót</span>
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/images/bcu-logo.png"
                alt="BCU Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="font-black text-lg">BCU Spedycja</span>
            </Link>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Moduły kursu</h1>
              <p className="text-muted-foreground">
                {modules?.length || 0} modułów tematycznych
              </p>
            </div>
          </div>

          {!modules || modules.length === 0 ? (
            <Card className="border-2 border-dashed border-muted-foreground">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-black mb-2">Brak modułów</h2>
                <p className="text-muted-foreground">
                  Administrator musi dodać moduły do platformy.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {modules.map((module, index) => {
                const questionCount = countByModule[module.id] || 0
                const completedCount = getModuleProgress(module.id)
                const progressPercent = questionCount > 0 
                  ? Math.round((completedCount / questionCount) * 100) 
                  : 0

                return (
                  <Link key={module.id} href={`/modules/${module.id}`}>
                    <Card className="border-2 border-foreground hover:border-primary hover:shadow-[4px_4px_0_0_hsl(var(--primary))] transition-all h-full group">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex h-14 w-14 items-center justify-center bg-foreground text-background font-black text-xl group-hover:bg-primary">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <span className="text-sm font-bold text-muted-foreground">
                            {questionCount} pytań
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle className="text-xl font-black mb-2 group-hover:text-primary">
                          {module.title}
                        </CardTitle>
                        <p className="text-muted-foreground text-sm mb-4">
                          {module.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Postęp</span>
                            <span className="font-bold">{progressPercent}%</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                        <Button 
                          variant="ghost" 
                          className="w-full mt-4 gap-2 font-bold group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                          Rozpocznij moduł
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
