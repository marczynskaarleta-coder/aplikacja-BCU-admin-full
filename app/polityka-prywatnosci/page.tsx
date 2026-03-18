import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Polityka Prywatności - BCU Spedycja',
  description: 'Polityka prywatności platformy edukacyjnej BCU Spedycja',
}

export default function PrivacyPolicyPage() {
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
            Polityka Prywatności
          </h1>

          <div className="space-y-8 text-foreground/90">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Administrator danych</h2>
              <p className="leading-relaxed">
                Administratorem danych osobowych jest Branżowe Centrum Umiejętności w Spedycji 
                z siedzibą w Andrychowie (dalej: &ldquo;BCU&rdquo; lub &ldquo;Administrator&rdquo;).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Zakres zbieranych danych</h2>
              <p className="leading-relaxed mb-4">
                W ramach korzystania z platformy edukacyjnej BCU Spedycja zbieramy następujące dane:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Imię i nazwisko</li>
                <li>Adres e-mail</li>
                <li>Dane dotyczące postępów w nauce (wyniki quizów, ukończone lekcje)</li>
                <li>Dane techniczne (adres IP, typ przeglądarki, czas logowania)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Cel przetwarzania danych</h2>
              <p className="leading-relaxed mb-4">Przetwarzamy dane osobowe w celu:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Świadczenia usług edukacyjnych na platformie</li>
                <li>Personalizacji procesu nauki i śledzenia postępów</li>
                <li>Komunikacji z użytkownikami</li>
                <li>Zapewnienia bezpieczeństwa usług</li>
                <li>Realizacji obowiązków prawnych</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Podstawa prawna</h2>
              <p className="leading-relaxed">
                Dane osobowe przetwarzamy na podstawie art. 6 ust. 1 lit. a) RODO (zgoda), 
                art. 6 ust. 1 lit. b) RODO (wykonanie umowy) oraz art. 6 ust. 1 lit. f) RODO 
                (prawnie uzasadniony interes administratora).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Okres przechowywania danych</h2>
              <p className="leading-relaxed">
                Dane osobowe przechowujemy przez okres korzystania z platformy oraz przez 
                okres niezbędny do realizacji celów, dla których zostały zebrane, a następnie 
                przez okres wymagany przepisami prawa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Prawa użytkownika</h2>
              <p className="leading-relaxed mb-4">Użytkownik ma prawo do:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dostępu do swoich danych osobowych</li>
                <li>Sprostowania danych</li>
                <li>Usunięcia danych (&ldquo;prawo do bycia zapomnianym&rdquo;)</li>
                <li>Ograniczenia przetwarzania</li>
                <li>Przenoszenia danych</li>
                <li>Wniesienia sprzeciwu wobec przetwarzania</li>
                <li>Cofnięcia zgody w dowolnym momencie</li>
                <li>Wniesienia skargi do organu nadzorczego (PUODO)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Pliki cookies</h2>
              <p className="leading-relaxed">
                Platforma wykorzystuje pliki cookies niezbędne do prawidłowego funkcjonowania 
                serwisu, w tym do utrzymania sesji użytkownika po zalogowaniu. Użytkownik może 
                zarządzać plikami cookies poprzez ustawienia swojej przeglądarki.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Bezpieczeństwo danych</h2>
              <p className="leading-relaxed">
                Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony danych 
                osobowych przed nieuprawnionym dostępem, utratą lub zniszczeniem. Dane są 
                przechowywane na zabezpieczonych serwerach z szyfrowaniem SSL/TLS.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Kontakt</h2>
              <p className="leading-relaxed">
                W sprawach związanych z ochroną danych osobowych można kontaktować się 
                z Administratorem pod adresem e-mail: kontakt@bcu-spedycja.pl
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
