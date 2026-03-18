"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { modules } from "@/lib/data"
import {
  ArrowLeft,
  FileText,
  Globe,
  Scale,
  Truck,
  Calculator,
  Shield,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Globe,
  Scale,
  Truck,
  Calculator,
  Shield,
}

export function ModulesScreen() {
  const { setScreen, selectModule } = useAppStore()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border bg-background sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setScreen("dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center bg-foreground">
              <span className="text-sm font-black text-background">B</span>
            </div>
            <h1 className="font-bold text-lg">Moduly</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black mb-2">Wybierz modul</h2>
          <p className="text-muted-foreground">Kliknij na modul, aby rozpoczac nauke</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const Icon = iconMap[module.icon] || FileText
            const progress = Math.round(
              (module.completedQuestions / module.totalQuestions) * 100
            )
            const isCompleted = progress === 100

            return (
              <button
                key={module.id}
                className="border-2 border-border p-6 text-left hover:border-foreground transition-all group relative"
                onClick={() => selectModule(module.id)}
              >
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                )}
                <div className="flex h-14 w-14 items-center justify-center bg-primary mb-4">
                  <Icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">{module.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {module.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Postep</span>
                    <span className="font-bold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {module.completedQuestions} z {module.totalQuestions} pytan
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
