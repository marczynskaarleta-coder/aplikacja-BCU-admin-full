import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Regulamin - BCU Spedycja',
  description: 'Regulamin korzystania z platformy edukacyjnej BCU Spedycja',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/bcu-logo.png"
              alt="BCU Logo"
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <span className="font-black text-xl">BCU Spedycja</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-black mb-8 border-b-4 border-primary pb-4">
            Regulamin
          </h1>

          <div className="space-y-8 text-foreground/90">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Postanowienia ogólne</h2>
              <p className="leading-relaxed mb-4">
                Niniejszy regulamin określa zasady korzystania z platformy edukacyjnej 
                BCU Spedycja, prowadzonej przez Branżowe Centrum Umiejętności w Spedycji 
                z siedzibą w Andrychowie.
              </p>
              <p className="leading-relaxed">
                Platforma służy do nauki i przygotowania do egzaminów branżowych w zakresie 
                spedycji i transportu drogowego.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Definicje</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Platforma</strong> - serwis internetowy BCU Spedycja dostępny pod adresem bcu-spedycja.pl</li>
                <li><strong>Użytkownik</strong> - osoba fizyczna korzystająca z Platformy</li>
                <li><strong>Konto</strong> - indywidualne konto Użytkownika na Platformie</li>
                <li><strong>Administrator</strong> - Branżowe Centrum Umiejętności w Spedycji</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Rejestracja i konto</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Korzystanie z Platformy wymaga założenia Konta</li>
                <li>Użytkownik zobowiązany jest podać prawdziwe dane podczas rejestracji</li>
                <li>Użytkownik odpowiada za bezpieczeństwo swojego hasła</li>
                <li>Jedno Konto może być używane tylko przez jedną osobę</li>
                <li>Administrator może usunąć Konto w przypadku naruszenia Regulaminu</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Zasady korzystania</h2>
              <p className="leading-relaxed mb-4">Użytkownik zobowiązuje się do:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Korzystania z Platformy zgodnie z jej przeznaczeniem</li>
                <li>Nieudostępniania swojego Konta osobom trzecim</li>
                <li>Niekopiowania i nierozpowszechniania materiałów edukacyjnych</li>
                <li>Niezakłócania działania Platformy</li>
                <li>Przestrzegania przepisów prawa</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Własność intelektualna</h2>
              <p className="leading-relaxed">
                Wszystkie materiały dostępne na Platformie (teksty, grafiki, pytania, testy) 
                stanowią własność intelektualną Administratora i są chronione prawem autorskim. 
                Kopiowanie, rozpowszechnianie lub wykorzystywanie materiałów bez zgody 
                Administratora jest zabronione.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Odpowiedzialność</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Administrator dokłada starań, aby Platforma działała prawidłowo</li>
                <li>Administrator nie gwarantuje, że materiały są wolne od błędów</li>
                <li>Platforma służy jako pomoc w nauce, ale nie zastępuje oficjalnych materiałów egzaminacyjnych</li>
                <li>Administrator nie ponosi odpowiedzialności za wyniki egzaminów</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Dostępność usługi</h2>
              <p className="leading-relaxed">
                Administrator zastrzega sobie prawo do czasowego wyłączenia Platformy w celu 
                przeprowadzenia prac konserwacyjnych lub aktualizacji. O planowanych przerwach 
                Użytkownicy będą informowani z wyprzedzeniem.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Zmiany regulaminu</h2>
              <p className="leading-relaxed">
                Administrator zastrzega sobie prawo do zmiany Regulaminu. O zmianach Użytkownicy 
                będą informowani poprzez Platformę. Dalsze korzystanie z Platformy po wprowadzeniu 
                zmian oznacza akceptację nowego Regulaminu.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Reklamacje</h2>
              <p className="leading-relaxed">
                Reklamacje dotyczące działania Platformy można składać na adres e-mail: 
                kontakt@bcu-spedycja.pl. Reklamacje będą rozpatrywane w terminie 14 dni roboczych.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Postanowienia końcowe</h2>
              <p className="leading-relaxed">
                W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy 
                prawa polskiego. Wszelkie spory będą rozstrzygane przez sąd właściwy dla 
                siedziby Administratora.
              </p>
            </section>

            <section className="border-t-2 border-border pt-6">
              <p className="text-sm text-muted-foreground">
                Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-foreground py-6 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Branżowe Centrum Umiejętności w Spedycji. Wszelkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  )
}
