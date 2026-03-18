"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { modules, userProgress } from "@/lib/data"
import {
  BookOpen,
  CheckCircle2,
  RefreshCcw,
  TrendingUp,
  ArrowRight,
  LogOut,
  Settings,
  Zap,
  Target,
} from "lucide-react"

export function DashboardScreen() {
  const { setScreen, logout, login, selectModule } = useAppStore()

  const recentModules = userProgress.recentModules
    .map((rm) => {
      const module = modules.find((m) => m.id === rm.moduleId)
      return { ...rm, module }
    })
    .filter((rm) => rm.module)

  const progressPercentage = Math.round(
    (userProgress.completedQuestions / userProgress.totalQuestions) * 100
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-foreground bg-background sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-primary">
              <span className="text-xl font-black text-primary-foreground">B</span>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight">BCU</span>
              <span className="text-lg font-light ml-1">Spedycja</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => login({ 
              id: "admin-user",
              email: "admin@bcu.pl",
              firstName: "Admin",
              lastName: "BCU",
              isAdmin: true,
            })}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 pb-24 md:pb-8">
        {/* Welcome Banner */}
        <div className="bg-foreground text-background p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-background/60 text-sm font-medium mb-1">Witaj ponownie</p>
              <h2 className="text-3xl sm:text-4xl font-black">Kontynuuj nauke!</h2>
            </div>
            <Button 
              onClick={() => setScreen("modules")} 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2"
            >
              <Zap className="h-4 w-4" />
              Szybki quiz
            </Button>
          </div>
        </div>

        {/* Progress Card */}
        <div className="mb-8 border-2 border-foreground bg-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-primary">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-black">Twój postep</h3>
            </div>
            <span className="text-4xl font-black">{progressPercentage}%</span>
          </div>
          
          <Progress value={progressPercentage} className="h-4 mb-6" />
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary p-4 text-center">
              <div className="text-3xl sm:text-4xl font-black text-primary-foreground">
                {userProgress.completedQuestions}
              </div>
              <div className="text-xs sm:text-sm text-primary-foreground/80 font-semibold mt-1">Zaliczone</div>
            </div>
            <div className="bg-foreground p-4 text-center">
              <div className="text-3xl sm:text-4xl font-black text-background">
                {userProgress.reviewQuestions}
              </div>
              <div className="text-xs sm:text-sm text-background/80 font-semibold mt-1">Do powtórki</div>
            </div>
            <div className="border-2 border-foreground p-4 text-center">
              <div className="text-3xl sm:text-4xl font-black text-foreground">
                {userProgress.totalQuestions}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-semibold mt-1">Wszystkie</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            className="border-2 border-foreground p-6 text-left hover:bg-primary transition-all group"
            onClick={() => setScreen("modules")}
          >
            <div className="flex h-14 w-14 items-center justify-center bg-foreground group-hover:bg-primary-foreground mb-4">
              <BookOpen className="h-7 w-7 text-background group-hover:text-foreground" />
            </div>
            <h4 className="font-black text-xl mb-1 group-hover:text-primary-foreground">Moduly</h4>
            <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/70">Przegladaj materialy</p>
          </button>
          <button
            className="border-2 border-foreground p-6 text-left hover:bg-foreground hover:text-background transition-all group"
            onClick={() => setScreen("review")}
          >
            <div className="flex h-14 w-14 items-center justify-center bg-primary group-hover:bg-background mb-4">
              <RefreshCcw className="h-7 w-7 text-primary-foreground group-hover:text-foreground" />
            </div>
            <h4 className="font-black text-xl mb-1">Powtórki</h4>
            <p className="text-sm text-muted-foreground group-hover:text-background/70">{userProgress.reviewQuestions} pytan</p>
          </button>
        </div>

        {/* Recent Modules */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black">Ostatnio przerabiane</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setScreen("modules")}
              className="font-semibold gap-1"
            >
              Wszystkie <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentModules.map(({ module }, index) => (
              <button
                key={module!.id}
                className="w-full flex items-center justify-between p-4 border-2 border-foreground hover:bg-primary transition-colors text-left group"
                onClick={() => selectModule(module!.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center bg-foreground text-background font-black group-hover:bg-primary-foreground group-hover:text-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="font-bold text-lg group-hover:text-primary-foreground">{module!.title}</div>
                    <div className="text-sm text-muted-foreground group-hover:text-primary-foreground/70">
                      {module!.completedQuestions}/{module!.totalQuestions} pytan
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Strong & Weak Areas */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border-2 border-foreground p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center bg-success">
                <CheckCircle2 className="h-5 w-5 text-success-foreground" />
              </div>
              <h4 className="font-black text-lg">Mocne strony</h4>
            </div>
            <ul className="space-y-3">
              {userProgress.strongAreas.map((area, index) => (
                <li key={index} className="text-sm flex items-center gap-3 font-medium">
                  <div className="w-2 h-2 bg-success" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-2 border-foreground p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center bg-primary">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <h4 className="font-black text-lg">Do poprawy</h4>
            </div>
            <ul className="space-y-3">
              {userProgress.weakAreas.map((area, index) => (
                <li key={index} className="text-sm flex items-center gap-3 font-medium">
                  <div className="w-2 h-2 bg-primary" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-foreground text-background border-t-2 border-foreground">
        <div className="flex items-center justify-around py-3">
          <button
            className="flex flex-col items-center gap-1 p-2"
            onClick={() => setScreen("dashboard")}
          >
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold text-primary">Dashboard</span>
          </button>
          <button
            className="flex flex-col items-center gap-1 p-2 text-background/60"
            onClick={() => setScreen("modules")}
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">Moduly</span>
          </button>
          <button
            className="flex flex-col items-center gap-1 p-2 text-background/60"
            onClick={() => setScreen("review")}
          >
            <RefreshCcw className="h-5 w-5" />
            <span className="text-xs">Powtórki</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
