"use client"

import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Award, 
  BarChart3, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Play,
  TrendingUp,
  Target,
  Clock
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"

export function LandingScreen() {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => prev < 95 ? prev + 1 : prev)
    }, 20)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <PWAInstallPrompt />
      {/* Announcement Banner */}
      <div className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-3 text-center text-sm font-medium">
          Nowa sesja egzaminacyjna startuje za 14 dni.{" "}
          <Link href="/auth/sign-up" className="underline underline-offset-4 hover:text-primary">
            Zacznij przygotowania
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b-2 border-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/bcu-logo.png"
                alt="BCU Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <div>
                <span className="text-lg font-black tracking-tight">BCU</span>
                <span className="text-lg font-light ml-1">Spedycja</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="font-medium">
                  Zaloguj się
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm" className="font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                  Zarejestruj się
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Big Impact */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 text-sm font-bold text-foreground mb-6">
                <Zap className="h-4 w-4" />
                Platforma nr 1 w Polsce
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.9]">
                Zdaj egzamin
                <br />
                <span className="text-primary">za pierwszym</span>
                <br />
                razem.
              </h1>
              <p className="mt-8 text-xl text-muted-foreground max-w-lg leading-relaxed">
                Interaktywna platforma do nauki spedycji i transportu. Quizy, powtórki, sledzenie postepu - wszystko w jednym miejscu.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/auth/sign-up">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg font-bold gap-3 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                  >
                    Zarejestruj się za darmo
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg font-semibold gap-3 border-2 border-foreground hover:bg-foreground hover:text-background w-full sm:w-auto"
                  >
                    <Play className="h-5 w-5" />
                    Zaloguj się
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-foreground" />
                  Bez karty kredytowej
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-foreground" />
                  500+ pytan
                </div>
              </div>
            </div>
            
            {/* Hero Visual - Stats Card */}
            <div className="relative">
              <div className="bg-foreground text-background p-8 sm:p-12">
                <div className="text-center">
                  <div className="text-8xl sm:text-9xl font-black leading-none">
                    {counter}<span className="text-primary">%</span>
                  </div>
                  <p className="mt-4 text-xl font-medium text-background/80">
                    zdawalnosci egzaminów
                  </p>
                  <div className="mt-8 grid grid-cols-3 gap-4 pt-8 border-t border-background/20">
                    <div>
                      <div className="text-3xl font-black">2K+</div>
                      <div className="text-xs text-background/60 mt-1">Uzytkowników</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black">500+</div>
                      <div className="text-xs text-background/60 mt-1">Pytan</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black">6</div>
                      <div className="text-xs text-background/60 mt-1">Modulów</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-primary -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-primary-foreground">
            <span className="text-sm font-bold uppercase tracking-wider">Zaufali nam:</span>
            {["DHL", "DB Schenker", "Raben", "PEKAES", "Geis"].map((company) => (
              <span key={company} className="text-lg font-black opacity-80">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              Jak to dziala?
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Trzy proste kroki do sukcesu
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                icon: BookOpen,
                title: "Ucz sie",
                description: "Przegladaj materialy edukacyjne podzielone na 6 tematycznych modulów. Od dokumentacji po prawo transportowe.",
              },
              {
                step: "02",
                icon: Target,
                title: "Cwicz",
                description: "Rozwiazuj interaktywne quizy z natychmiastowym feedbackiem. System powtórek pomoze Ci zapamietac trudne pytania.",
              },
              {
                step: "03",
                icon: Award,
                title: "Zdaj",
                description: "Sledz swoje postepy i sprawdz gotowsci. Kiedy osiagniesz 90% - jestes gotowy na egzamin!",
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-background border-2 border-foreground p-8 h-full group-hover:bg-primary/5 transition-colors">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex h-14 w-14 items-center justify-center bg-primary">
                      <item.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <span className="text-5xl font-black text-muted-foreground/30">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-black mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                Wszystko, czego
                <br />
                potrzebujesz do
                <br />
                <span className="text-primary">sukcesu.</span>
              </h2>
              <p className="mt-6 text-xl text-background/70 leading-relaxed">
                Nasza platforma zostala zaprojektowana przez ekspertów branzy TSL, którzy wiedzą, czego wymaga egzamin.
              </p>
              <Link href="/auth/sign-up">
                <Button 
                  size="lg" 
                  className="mt-8 h-14 px-8 text-lg font-bold gap-3 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Zacznij teraz
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, title: "6 modulów", desc: "Kompletny program" },
                { icon: BarChart3, title: "Statystyki", desc: "Sledz postepy" },
                { icon: Clock, title: "24/7", desc: "Dostep non-stop" },
                { icon: TrendingUp, title: "Powtórki", desc: "Inteligentny system" },
              ].map((item, i) => (
                <div key={i} className="bg-background/10 p-6 hover:bg-background/20 transition-colors">
                  <item.icon className="h-8 w-8 text-primary mb-4" />
                  <div className="text-xl font-bold">{item.title}</div>
                  <div className="text-sm text-background/60">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modules Preview */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                6 modulów tematycznych
              </h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Kompleksowe przygotowanie do egzaminu
              </p>
            </div>
            <Link href="/auth/sign-up">
              <Button 
                variant="outline" 
                className="gap-2 font-bold border-2 border-foreground hover:bg-foreground hover:text-background w-fit"
              >
                Zobacz wszystkie
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Dokumentacja transportowa", questions: 85 },
              { name: "Incoterms 2020", questions: 65 },
              { name: "Prawo transportowe", questions: 95 },
              { name: "Organizacja transportu", questions: 78 },
              { name: "Kalkulacja kosztów", questions: 72 },
              { name: "Bezpieczenstwo ladunków", questions: 68 },
            ].map((module, i) => (
              <div
                key={i}
                className="group flex items-center gap-4 border-2 border-foreground bg-background p-5 hover:bg-primary transition-all text-left"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-foreground text-background font-black text-lg group-hover:bg-primary-foreground group-hover:text-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-lg truncate group-hover:text-primary-foreground">{module.name}</div>
                  <div className="text-sm text-muted-foreground group-hover:text-primary-foreground/70">{module.questions} pytan</div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary-foreground">
              Gotowy na sukces?
            </h2>
            <p className="mt-6 text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Dolacz do ponad 2000 osób, które zdaly egzamin dzieki BCU Spedycja.
              Nastepny mozesz byc Ty.
            </p>
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="mt-10 h-16 px-12 text-xl font-black gap-3 bg-foreground text-background hover:bg-foreground/90"
              >
                Zacznij za darmo
                <ArrowRight className="h-6 w-6" />
              </Button>
            </Link>
            <p className="mt-6 text-sm text-primary-foreground/60">
              Bez zobowiazan. Bez karty kredytowej. Po prostu zacznij.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4">
                <Image
                  src="/images/bcu-logo.png"
                  alt="BCU Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
                <div>
                  <span className="text-lg font-black">BCU</span>
                  <span className="text-lg font-light ml-1">Spedycja</span>
                </div>
              </Link>
              <p className="text-sm text-background/60">
                Branżowe Centrum Umiejętności w Spedycji. Platforma edukacyjna dla profesjonalistów TSL.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Platforma</h3>
              <ul className="space-y-2 text-sm text-background/60">
                <li><Link href="/auth/sign-up" className="hover:text-primary">Rejestracja</Link></li>
                <li><Link href="/auth/login" className="hover:text-primary">Logowanie</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Informacje</h3>
              <ul className="space-y-2 text-sm text-background/60">
                <li><Link href="/polityka-prywatnosci" className="hover:text-primary">Polityka prywatności</Link></li>
                <li><Link href="/regulamin" className="hover:text-primary">Regulamin</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Kontakt</h3>
              <ul className="space-y-2 text-sm text-background/60">
                <li>kontakt@bcu-spedycja.pl</li>
                <li>Andrychów, Polska</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/60">
              &copy; {new Date().getFullYear()} Branżowe Centrum Umiejętności w Spedycji. Wszelkie prawa zastrzeżone.
            </p>
            <div className="flex gap-4 text-sm text-background/60">
              <Link href="/polityka-prywatnosci" className="hover:text-primary">Prywatność</Link>
              <Link href="/regulamin" className="hover:text-primary">Regulamin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
