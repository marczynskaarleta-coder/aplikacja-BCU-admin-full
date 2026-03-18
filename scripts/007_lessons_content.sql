-- ============================================================
-- ETAP 7: Lekcje do 8 modułów BCU
-- Uruchom PO skrypcie 006_bcu_content.sql
-- Uruchom w: Supabase Dashboard → SQL Editor
-- ============================================================

DO $$
DECLARE
  m1  uuid;
  m2  uuid;
  m3  uuid;
  m4  uuid;
  m5  uuid;
  m6  uuid;
  m7  uuid;
  m8  uuid;
BEGIN

-- Pobierz ID modułów po order_index
SELECT id INTO m1 FROM public.modules WHERE order_index = 1 AND status = 'published' LIMIT 1;
SELECT id INTO m2 FROM public.modules WHERE order_index = 2 AND status = 'published' LIMIT 1;
SELECT id INTO m3 FROM public.modules WHERE order_index = 3 AND status = 'published' LIMIT 1;
SELECT id INTO m4 FROM public.modules WHERE order_index = 4 AND status = 'published' LIMIT 1;
SELECT id INTO m5 FROM public.modules WHERE order_index = 5 AND status = 'published' LIMIT 1;
SELECT id INTO m6 FROM public.modules WHERE order_index = 6 AND status = 'published' LIMIT 1;
SELECT id INTO m7 FROM public.modules WHERE order_index = 7 AND status = 'published' LIMIT 1;
SELECT id INTO m8 FROM public.modules WHERE order_index = 8 AND status = 'published' LIMIT 1;

IF m1 IS NULL THEN RAISE EXCEPTION 'Nie znaleziono modułu o order_index=1. Uruchom najpierw 006_bcu_content.sql'; END IF;

-- ============================================================
-- MODUŁ 1 – Dokumentacja międzynarodowa
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, key_points, order_index, is_active)
VALUES
(
  m1,
  'Konwencja CMR i list przewozowy',
  'Konwencja CMR reguluje drogowy przewóz towarów między krajami, które ją ratyfikowały. Określa prawa i obowiązki nadawcy, przewoźnika i odbiorcy. List przewozowy CMR jest podstawowym dowodem zawarcia umowy o przewóz.

Przewoźnik odpowiada za towar od momentu załadunku do chwili wydania odbiorcy. Odpowiedzialność jest jednak limitowana – maksymalnie 8,33 SDR za kilogram brutto przesyłki.

Przykład z praktyki: Firma z Polski wysyła towar do Niemiec. Kierowca otrzymuje swój egzemplarz CMR, który podpisuje przy odbiorze. Odbiorca potwierdza dostawę na swoim egzemplarzu. Spedytor widzi potwierdzenie w systemie.',
  ARRAY[
    'CMR obowiązuje w ruchu międzynarodowym między krajami-stronami konwencji',
    'List przewozowy CMR wystawiany jest w 3 egzemplarzach: nadawca, odbiorca, przewoźnik',
    'Przewoźnik odpowiada za towar od załadunku do wydania odbiorcy',
    'Odpowiedzialność przewoźnika jest limitowana – max. 8,33 SDR za kg brutto'
  ],
  1,
  true
),
(
  m1,
  'Incoterms 2020',
  'Incoterms to zbiór 11 reguł handlowych określających, kto ponosi koszty transportu i ubezpieczenia oraz gdzie przechodzi ryzyko utraty towaru. Są opracowywane przez Międzynarodową Izbę Handlową.

Reguły dzielą się na grupy: E (minimum obowiązków sprzedającego), F i C (transport główny po stronie kupującego lub sprzedającego), D (maksymalne obowiązki sprzedającego).

Ważne: Incoterms nie regulują przeniesienia własności towaru – tylko koszty i ryzyko.

Przykład z praktyki: Spedytor uzgadnia z klientem warunek FCA – ładunek jest odbierany z magazynu dostawcy przez przewoźnika kupującego. Spedytor musi dokładnie wiedzieć, gdzie kończy się jego odpowiedzialność, żeby odpowiednio ubezpieczyć transport.',
  ARRAY[
    'Incoterms 2020 zawiera 11 reguł handlowych',
    'EXW: minimum obowiązków sprzedającego – tylko udostępnia towar',
    'DDP: maksimum obowiązków sprzedającego – dostawa z odprawą celną u odbiorcy',
    'Incoterms nie regulują własności towaru – tylko koszty i ryzyko'
  ],
  2,
  true
),
(
  m1,
  'Procedury celne i dokumenty tranzytowe',
  'Przewóz towarów poza obszar UE wymaga odprawy celnej. Dokumenty tranzytowe umożliwiają przemieszczanie towarów przez wiele krajów bez szczegółowej kontroli na każdej granicy.

Deklaracja celna SAD (Single Administrative Document) to podstawowy dokument odprawy celnej. Karnet TIR umożliwia tranzyt przez państwa spoza UE na uproszczonych zasadach.

System NCTS (New Computerised Transit System) obsługuje elektroniczny tranzyt w UE. Świadectwo EUR.1 potwierdza preferencyjne pochodzenie towaru – pozwala na niższe stawki celne.

Przykład z praktyki: Ciężarówka jedzie z Polski przez Ukrainę do Gruzji. Dzięki karnetowi TIR nie musi być szczegółowo kontrolowana na każdej granicy – wystarczy pieczęć urzędu celnego w każdym kraju tranzytowym.',
  ARRAY[
    'SAD (Single Administrative Document) – podstawowy dokument odprawy celnej',
    'Karnet TIR – uproszczony tranzyt drogowy przez wiele krajów',
    'NCTS – elektroniczny system tranzytu celnego w UE',
    'Świadectwo EUR.1 – potwierdza preferencyjne pochodzenie towaru'
  ],
  3,
  true
),
(
  m1,
  'ADR – towary niebezpieczne',
  'ADR to europejska umowa regulująca drogowy przewóz towarów niebezpiecznych. Klasyfikuje towary na 9 klas zagrożeń i określa wymagania dla pojazdów, opakowań i kierowców.

Każdy przewoźnik, spedytor i nadawca towarów niebezpiecznych musi znać podstawowe zasady ADR. Kierowca musi posiadać ważne zaświadczenie ADR – uzyskuje się je po szkoleniu i egzaminie.

Pojazd musi być oznakowany pomarańczowymi tablicami z numerami rozpoznawczymi. Kierowca musi mieć przy sobie instrukcję pisemną w języku zrozumiałym dla krajów tranzytowych.

Przykład z praktyki: Spedytor zleca transport farb rozpuszczalnikowych. To klasa 3 ADR – materiały ciekłe zapalne. Konieczny pojazd z gaśnicą proszkową, kierowca z certyfikatem ADR i właściwe opakowania z nalepkami ostrzegawczymi.',
  ARRAY[
    'ADR dzieli towary niebezpieczne na 9 klas zagrożeń',
    'Kierowca musi posiadać zaświadczenie ADR – uzyskiwane po szkoleniu i egzaminie',
    'Pojazd musi być oznakowany pomarańczowymi tablicami z numerami',
    'Dokumenty ADR: deklaracja nadawcy, instrukcja pisemna dla kierowcy'
  ],
  4,
  true
);

-- ============================================================
-- MODUŁ 2 – Opakowania i ślad węglowy
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, key_points, order_index, is_active)
VALUES
(
  m2,
  'Rodzaje opakowań w logistyce',
  'Opakowania w logistyce pełnią funkcję ochronną, manipulacyjną i informacyjną. Dzielą się na trzy poziomy, z których każdy odgrywa inną rolę w łańcuchu dostaw.

Opakowanie jednostkowe bezpośrednio otacza produkt (butelka, pudełko). Opakowanie zbiorcze grupuje kilka jednostek (karton zbiorczy). Opakowanie transportowe zabezpiecza towar podczas transportu i magazynowania (paleta, skrzynia).

Każde opakowanie musi być odporne na warunki, jakim będzie poddane: wibracje, wilgoć, zmienne temperatury, naciski w stosie.

Przykład z praktyki: Słoiki z dżemem są pakowane w kartony po 12 sztuk (opakowanie zbiorcze), a kartony układane na palecie i owijane folią stretch (opakowanie transportowe). Każdy poziom pełni inną funkcję ochronną.',
  ARRAY[
    'Trzy poziomy opakowań: jednostkowe, zbiorcze, transportowe',
    'Każde opakowanie pełni funkcję ochronną, manipulacyjną i informacyjną',
    'Opakowanie musi być dostosowane do warunków transportu i magazynowania',
    'Paleta EUR (800×1200 mm) to standard transportowy w Europie'
  ],
  1,
  true
),
(
  m2,
  'Opakowania zwrotne i Pool System',
  'Opakowania zwrotne krążą wielokrotnie w łańcuchu dostaw, co obniża koszty i redukuje odpady. Pool System to model zarządzania nimi przez zewnętrznego operatora.

W Pool System firma nie kupuje palet ani pojemników – dzierżawi je od operatora (np. CHEP, LPR). Operator zarządza całą pulą, naprawia uszkodzone egzemplarze i dostarcza sprawne do dowolnego punktu sieci.

Wymiana palet 1:1 to standard przy rozliczeniach: przy każdej dostawie z paletą odbiorca oddaje tę samą liczbę pustych palet tego samego typu.

Przykład z praktyki: Firma logistyczna korzysta z CHEP – płaci abonament za każdą paletę w obiegu i może wymienić zniszczone na sprawne w tysiącach punktów w całej Europie. Zero inwestycji w zakup własnych palet.',
  ARRAY[
    'Pool System – dzierżawa opakowań zwrotnych od zewnętrznego operatora',
    'Paleta EUR: standard 800×1200 mm, zarządzana przez EPAL',
    'Wymiana palet 1:1 – za każdą wydaną paletę zwracana jest jedna pusta',
    'Opakowania zwrotne redukują koszty i ilość odpadów opakowaniowych'
  ],
  2,
  true
),
(
  m2,
  'Ślad węglowy w transporcie',
  'Ślad węglowy to całkowita emisja gazów cieplarnianych związana z danym procesem, wyrażona w ekwiwalencie CO₂. Transport drogowy odpowiada za znaczną część emisji w logistyce.

Główne czynniki wpływające na ślad węglowy transportu to: typ pojazdu, rodzaj paliwa, odległość i – co kluczowe – stopień załadowania pojazdu. Pojazd jadący w 40% załadowania generuje prawie tyle samo CO₂ co jadący w 100%.

Konsolidacja ładunków, backloading i optymalizacja tras to najskuteczniejsze metody redukcji emisji. Firmy muszą też raportować emisje w ramach wymagań ESG.

Przykład z praktyki: Dwie firmy wysyłają towar na tej samej trasie. Zamiast dwóch half-full tirów, spedytor konsoliduje ładunki w jeden pełny. Ślad węglowy obu firm spada o połowę – bez dodatkowych kosztów.',
  ARRAY[
    'Ślad węglowy mierzony jest w kg lub tonach ekwiwalentu CO₂',
    'Stopień załadowania pojazdu ma kluczowy wpływ na emisję CO₂ na tonę towaru',
    'Konsolidacja ładunków to najskuteczniejsza metoda redukcji emisji',
    'Firmy raportują emisje CO₂ w ramach wymogów ESG'
  ],
  3,
  true
),
(
  m2,
  'Przepisy i obowiązki opakowaniowe',
  'Przepisy UE nakładają na producentów i importerów obowiązki w zakresie odzysku i recyklingu opakowań. Kto wprowadza opakowania na rynek – odpowiada za to, co się z nimi dzieje po zużyciu.

Dyrektywa opakowaniowa UE 94/62/WE określa minimalne poziomy recyklingu. W Polsce realizuje się to przez organizacje odzysku – firmy mogą przystąpić do takiej organizacji i przekazać jej obowiązki za opłatą.

Certyfikat FSC potwierdza, że opakowanie papierowe pochodzi z odpowiedzialnie zarządzanych lasów. ISO 14001 to system zarządzania środowiskowego dla całej organizacji.

Przykład z praktyki: Importer sprzętu elektronicznego pakuje produkty w kartony. Musi zapewnić odzysk tych opakowań. Wykupuje udział w organizacji odzysku (np. Rekopol), która organizuje zbiórkę i recykling w jego imieniu.',
  ARRAY[
    'Dyrektywa UE 94/62/WE określa minimalne poziomy recyklingu opakowań',
    'Organizacje odzysku przejmują obowiązki firm za opłatą',
    'FSC – certyfikat zrównoważonego pochodzenia materiałów opakowaniowych',
    'Producent lub importer odpowiada za opakowania, które wprowadza na rynek'
  ],
  4,
  true
);

-- ============================================================
-- MODUŁ 3 – Optymalizacja załadunku
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, key_points, order_index, is_active)
VALUES
(
  m3,
  'Zasady prawidłowego załadunku',
  'Prawidłowy załadunek to nie tylko efektywność – to przede wszystkim bezpieczeństwo. Źle załadowany pojazd grozi wypadkiem, uszkodzeniem towaru i mandatem podczas kontroli drogowej.

Ciężkie ładunki muszą leżeć na dole i jak najbliżej przodu pojazdu. Obniżenie środka ciężkości zapewnia stabilność podczas jazdy i hamowania. Naciski na osie muszą mieścić się w normach – standardowo max. 11,5 tony na oś.

Ładunek nie może przekraczać DMC (Dopuszczalnej Masy Całkowitej) pojazdu. Dla standardowego zestawu ciągnik + naczepa wynosi ona 40 ton.

Przykład z praktyki: Kierowca ładuje palety z ceramiką i kartonami. Ciężkie pudła ceramiczne idą na spód i do przodu, lekkie kartony – na górę i tył. Środek ciężkości jest niski i stabilny.',
  ARRAY[
    'Ciężkie ładunki układaj na dole i jak najbliżej przodu pojazdu',
    'DMC zestawu ciągnik + naczepa to standardowo 40 ton',
    'Nacisk na oś: max. 11,5 tony na oś napędową',
    'Nieprawidłowy załadunek grozi mandatem, wypadkiem i uszkodzeniem towaru'
  ],
  1,
  true
),
(
  m3,
  'Mocowanie ładunku',
  'Mocowanie ładunku jest prawnym obowiązkiem kierowcy i reguluje je norma EN 12195. Nieumocowany ładunek może przesunąć się podczas hamowania lub skrętu, co grozi wypadkiem.

Dostępne metody mocowania to: pasy, łańcuchy, kliny, maty antypoślizgowe i siatki. Siłę mocowania należy dobrać do masy ładunku i sił działających podczas jazdy.

Kierowca jest zobowiązany sprawdzić mocowanie przed wyjazdem i w trakcie trasy – szczególnie po pierwszych 50 km i po każdej przerwie.

Przykład z praktyki: Maszyna budowlana 2 tony mocowana jest 4 łańcuchami do haków w podłodze naczepy, z klinami pod kołami. Kierowca dokumentuje mocowanie zdjęciem przed wyjazdem i sprawdza ponownie po 50 km.',
  ARRAY[
    'Norma EN 12195 reguluje obowiązek i metody mocowania ładunków',
    'Metody: pasy, łańcuchy, kliny, maty antypoślizgowe, siatki',
    'Siłę mocowania oblicza się w zależności od masy ładunku i sił jazdy',
    'Kierowca sprawdza mocowanie przed wyjazdem i po pierwszych 50 km'
  ],
  2,
  true
),
(
  m3,
  'Programy do optymalizacji załadunku',
  'Oprogramowanie do planowania załadunku automatycznie generuje plan rozmieszczenia towarów w przestrzeni ładowni. Uwzględnia wymiary, masy, klasy piętrzenia i ograniczenia pojazdu.

Dyspozytor wprowadza do programu dane o ładunkach (wymiary, masa, klasa piętrzenia) i pojeździe. System generuje wizualizację 3D z kolejnością załadunku i raportem rozkładu mas.

Wskaźnik ULR (Unit Load Ratio) informuje, w jakim procencie wykorzystana jest kubatura pojazdu. Im wyższy – tym efektywniejszy załadunek.

Przykład z praktyki: Dyspozytor wpisuje 14 palet o różnych wymiarach. Program generuje plan 3D, pokazuje kolejność załadunku i potwierdza, że DMC nie jest przekroczone. Bez programu taka kalkulacja zajęłaby 30 minut ręcznie.',
  ARRAY[
    'Programy load planning generują wizualizację 3D rozmieszczenia ładunków',
    'Dane wejściowe: wymiary i masa ładunków, wymiary pojazdu, klasy piętrzenia',
    'ULR – współczynnik wykorzystania przestrzeni ładowni',
    'Program sprawdza DMC i rozkład nacisku na osie automatycznie'
  ],
  3,
  true
),
(
  m3,
  'Ładunki specjalne i ponadgabarytowe',
  'Ładunki ponadgabarytowe przekraczają dopuszczalne normy wymiarów lub masy i wymagają specjalnych zezwoleń. Spedytor musi znać kategorie zezwoleń i procedurę ich uzyskiwania.

Ładunek jest ponadgabarytowy gdy przekracza: szerokość 2,55 m, wysokość 4 m, długość 18,75 m lub masę 40 ton. Zezwolenia wydaje GDDKiA. Im większy ładunek, tym wyższa kategoria zezwolenia (I–VII).

Ładunki ponadgabarytowe mogą być przewożone tylko w określonych godzinach i na wyznaczonych trasach. Powyżej pewnych rozmiarów wymagana jest eskorta policyjna.

Przykład z praktyki: Transformator o masie 80 ton wymaga zezwolenia kat. VII, eskorty policji i wcześniejszego uzgodnienia trasy z zarządcami dróg. Transport jest planowany na tygodnie do przodu.',
  ARRAY[
    'Ponadgabarytowy: szerokość >2,55 m, wysokość >4 m lub masa >40 ton',
    'Zezwolenia kategorii I–VII wydaje GDDKiA',
    'Transport ponadnormatywny dozwolony tylko w określonych godzinach',
    'Powyżej pewnych rozmiarów wymagana eskorta policyjna'
  ],
  4,
  true
);

-- ============================================================
-- MODUŁ 4 – Dokumentacja transportowa – TMS
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, key_points, order_index, is_active)
VALUES
(
  m4,
  'Czym jest TMS',
  'TMS (Transport Management System) to oprogramowanie zarządzające procesami transportowymi – od przyjęcia zlecenia przez planowanie, realizację i śledzenie, aż po dokumentację i rozliczenie.

TMS zastępuje papierową dokumentację i arkusze Excel. Dyspozytor w jednym systemie przyjmuje zlecenia, przypisuje pojazdy, generuje dokumenty i monitoruje dostawy na mapie.

Klienci mogą przez portal śledzenia widzieć status przesyłki w czasie rzeczywistym. TMS integruje się z WMS magazynu i ERP firmy.

Przykład z praktyki: Dyspozytor przyjmuje zlecenie w TMS, przypisuje pojazd, generuje CMR i zlecenie dla kierowcy. Klient dostaje link do śledzenia. Przy dostawie kierowca potwierdza w aplikacji mobilnej – POD pojawia się w systemie natychmiast.',
  ARRAY[
    'TMS zarządza całym procesem transportu: od zlecenia do dokumentacji',
    'Zastępuje papierową dokumentację i arkusze Excel',
    'Integruje się z WMS magazynu i ERP firmy',
    'Klienci śledzą status przesyłki przez portal w czasie rzeczywistym'
  ],
  1,
  true
),
(
  m4,
  'eCMR – elektroniczny list przewozowy',
  'eCMR to cyfrowy odpowiednik papierowego listu CMR. Ma taką samą moc prawną jak papierowy dokument, ale przyspiesza obieg informacji i eliminuje ryzyko zagubienia.

Podstawą prawną eCMR jest protokół dodatkowy do konwencji CMR z 2008 r., ratyfikowany przez wiele państw europejskich. Dokument jest podpisywany elektronicznie przez nadawcę, przewoźnika i odbiorcę.

Główna zaleta: po wydaniu towaru odbiorca podpisuje eCMR na tablecie lub smartfonie, a spedytor widzi POD (Proof of Delivery) w systemie natychmiast – nie czeka dni na papier.

Przykład z praktyki: Kierowca przy załadunku podpisuje eCMR na tablecie, odbiorca przy rozładunku robi to samo. Spedytor w Polsce widzi potwierdzenie dostawy do Niemiec w ciągu sekund po rozładunku.',
  ARRAY[
    'eCMR ma taką samą moc prawną jak papierowy CMR',
    'Podstawa prawna: protokół dodatkowy do konwencji CMR z 2008 r.',
    'Podpisywany elektronicznie przez wszystkie strony umowy',
    'POD widoczny w systemie natychmiast po dostawie'
  ],
  2,
  true
),
(
  m4,
  'EDI – elektroniczna wymiana danych',
  'EDI (Electronic Data Interchange) to standard wymiany dokumentów między systemami informatycznymi partnerów handlowych – bez ręcznego przepisywania danych.

Zamiast wysyłać PDF-em fakturę, firma wysyła ustandaryzowany komunikat EDI, który drugi system automatycznie przetwarza. Eliminuje to błędy ludzkie i przyspiesza procesy.

Najpopularniejszy standard w europejskiej logistyce to UN/EDIFACT. Kluczowe komunikaty: ORDERS (zamówienie), DESADV (awizo wysyłki), INVOIC (faktura).

Przykład z praktyki: Sieć handlowa przesyła zamówienie EDI do dostawcy. Dostawca automatycznie tworzy zlecenie produkcyjne, a po wysyłce odsyła DESADV z listą palet i ich SSCC. Zero telefonów, zero przepisywania.',
  ARRAY[
    'EDI umożliwia automatyczną wymianę dokumentów między systemami IT',
    'UN/EDIFACT – najpopularniejszy standard EDI w europejskiej logistyce',
    'DESADV – awizo wysyłki informujące odbiorcę przed przybyciem towaru',
    'EDI eliminuje błędy ręcznego wprowadzania danych'
  ],
  3,
  true
),
(
  m4,
  'Dokumenty celne w systemach elektronicznych',
  'Obsługa celna towarów w Polsce odbywa się przez systemy elektroniczne. Spedytor lub agencja celna składa zgłoszenia przez platformę PUESC – bez wizyty w urzędzie.

System NCTS obsługuje elektroniczny tranzyt w UE (procedury T1 i T2). AES obsługuje zgłoszenia wywozowe. Wszystkie dokumenty są archiwizowane elektronicznie i dostępne do kontroli.

Agencja celna to firma wyspecjalizowana w przygotowaniu zgłoszeń celnych w imieniu klienta. Spedytor często współpracuje ze stałą agencją celną.

Przykład z praktyki: Firma eksportuje maszyny do Japonii. Agencja celna przez PUESC składa zgłoszenie wywozowe. System weryfikuje dane, generuje EAD (Export Accompanying Document) i dopiero z tym dokumentem kierowca może wyjechać za granicę.',
  ARRAY[
    'PUESC – polska platforma elektronicznych zgłoszeń celnych',
    'NCTS – system elektronicznego tranzytu celnego w UE (T1, T2)',
    'EAD (Export Accompanying Document) – elektroniczny dokument wywozowy',
    'Agencja celna przygotowuje zgłoszenia celne w imieniu klienta'
  ],
  4,
  true
);

-- ============================================================
-- MODUŁ 5 – System WMS
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, key_points, order_index, is_active)
VALUES
(
  m5,
  'Jak działa WMS',
  'WMS (Warehouse Management System) zarządza każdym ruchem towaru w magazynie. Od przyjęcia dostawy, przez składowanie i kompletację, aż po wysyłkę i inwentaryzację – wszystko rejestrowane w czasie rzeczywistym.

Przy przyjęciu towaru WMS przypisuje paletę do konkretnej lokalizacji i prowadzi magazyniera do miejsca odłożenia. Przy kompletacji prowadzi pracownika najkrótszą ścieżką przez magazyn.

WMS integruje się z systemem ERP przez API lub EDI – stany magazynowe, zamówienia i faktury są synchronizowane automatycznie.

Przykład z praktyki: Pracownik skanuje kod przy przyjęciu towaru. WMS wskazuje mu na ekranie skanera: "Odłóż do lokalizacji B-07-2". Przy kompletacji system prowadzi go przez magazyn tak, by zebrał wszystkie pozycje najkrótszą trasą.',
  ARRAY[
    'WMS zarządza każdym ruchem towaru w czasie rzeczywistym',
    'Automatycznie przypisuje lokalizacje magazynowe według strategii składowania',
    'Integruje się z ERP przez API lub EDI',
    'Obsługiwany przez skanery RF, tablety lub zestawy głosowe'
  ],
  1,
  true
),
(
  m5,
  'Strategie składowania',
  'Strategia składowania decyduje, jak towary rozmieszczone są w magazynie. Właściwy dobór skraca czas kompletacji i zwiększa efektywność całego magazynu.

FIFO (First In, First Out) – pierwsze przyjęte, pierwsze wydawane. Standard dla większości towarów, zapobiega "starzeniu się" zapasów.

FEFO (First Expired, First Out) – najkrótsza data ważności wydawana pierwsza. Obowiązkowe w branży spożywczej, farmaceutycznej i kosmetycznej.

Analiza ABC: towary A (najczęściej pobierane) lokowane blisko strefy wysyłki, C (najrzadziej) – dalej. Zmniejsza dystans pokonywanego przy kompletacji.

Przykład z praktyki: Magazyn farmaceutyczny stosuje FEFO. Przy każdym zamówieniu WMS wskazuje zawsze tę partię leku, której data ważności upływa najwcześniej.',
  ARRAY[
    'FIFO: pierwsze przyjęte = pierwsze wydane; standard dla większości towarów',
    'FEFO: najkrótsza data ważności = wydawane pierwsze; obowiązkowe dla żywności i leków',
    'Analiza ABC: A – szybkorotujące blisko wysyłki, C – wolnorotujące dalej',
    'WMS automatycznie dobiera strategię i wskazuje właściwą lokalizację'
  ],
  2,
  true
),
(
  m5,
  'Kompletacja zamówień',
  'Kompletacja (picking) to zbieranie towarów z lokalizacji magazynowych do przygotowania zamówienia. To jeden z najbardziej czasochłonnych i kosztownych procesów w magazynie.

Pick-by-scan: pracownik skanuje kod na lokalizacji i potwierdzeniu każdej pozycji. Pick-by-Voice: system podaje instrukcje głosem przez słuchawki, pracownik ma wolne ręce. Pick-by-Light: diody LED na regałach wskazują lokalizację i ilość do pobrania.

Dokładność kompletacji to kluczowy wskaźnik jakości. Standard w nowoczesnych magazynach to powyżej 99,5% zamówień bez błędu.

Przykład z praktyki: Pracownik z zestawem głosowym słyszy: "Idź do B-12-3, weź 4 sztuki". Potwierdza głosowo "cztery". Błędów prawie nie ma – nie przepisuje nic ręcznie, nic nie czyta z ekranu.',
  ARRAY[
    'Pick-by-scan, Pick-by-Voice, Pick-by-Light – metody wspomagania kompletacji',
    'Dokładność kompletacji >99,5% to standard nowoczesnego magazynu',
    'Pick-by-Voice: wolne ręce, mniej błędów, większa prędkość',
    'Kompletacja to jeden z najbardziej kosztownych procesów w magazynie'
  ],
  3,
  true
),
(
  m5,
  'KPI magazynu i inwentaryzacja',
  'Efektywność magazynu mierzy się zestawem wskaźników KPI. Regularne śledzenie KPI pozwala wykryć problemy i porównywać się z benchmarkami branżowymi.

Dokładność kompletacji – % zamówień bez błędu. Rotacja zapasów – wartość wydanego towaru / średnia wartość zapasów. Wykorzystanie powierzchni – % zajętej przestrzeni.

Inwentaryzacja cykliczna to ciągłe liczenie wybranych lokalizacji przez cały rok. W przeciwieństwie do tradycyjnej rocznej inwentaryzacji nie wymaga zamykania magazynu.

Przykład z praktyki: Magazyn co tydzień liczy 5% lokalizacji rotacyjnie. W ciągu 20 tygodni przeliczony jest cały magazyn. Stany w WMS zawsze aktualne – bez jednodniowego przestoju na roczną inwentaryzację.',
  ARRAY[
    'Dokładność kompletacji, rotacja zapasów i wykorzystanie powierzchni to kluczowe KPI',
    'Rotacja zapasów = wartość wydanego towaru / średnia wartość zapasów',
    'Inwentaryzacja cykliczna: ciągłe liczenie fragmentów magazynu przez cały rok',
    'Wysokie KPI = efektywny magazyn = niższe koszty operacyjne'
  ],
  4,
  true
);

-- ============================================================
-- MODUŁ 6 – Optymalizacja tras
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, key_points, order_index, is_active)
VALUES
(
  m6,
  'Planowanie tras i algorytmy routingu',
  'Optymalizacja tras to wyznaczanie najbardziej efektywnej kolejności odwiedzania punktów dostawy dla jednego lub wielu pojazdów. Nowoczesne systemy robią to automatycznie w ciągu sekund.

TSP (Travelling Salesman Problem) – najkrótsza trasa przez wszystkie punkty. VRP (Vehicle Routing Problem) – optymalizacja dla floty pojazdów z uwzględnieniem ograniczeń: pojemność, czas pracy, okna czasowe.

Systemy routingu pobierają dane w czasie rzeczywistym – korki, wypadki, zamknięcia dróg – i dynamicznie przeliczają trasy.

Przykład z praktyki: Firma kurierska ma 80 paczek dla 5 samochodów. System VRP wyznacza optymalne trasy w 10 sekund, uwzględniając okna czasowe wszystkich klientów. Ręczne planowanie zajęłoby godzinę i byłoby gorsze.',
  ARRAY[
    'TSP: najkrótsza trasa przez wszystkie punkty dla jednego pojazdu',
    'VRP: optymalizacja tras dla floty pojazdów z ograniczeniami',
    'Okno czasowe: przedział godzinowy, w którym musi nastąpić dostawa',
    'Systemy routingu aktualizują trasy w czasie rzeczywistym na podstawie ruchu'
  ],
  1,
  true
),
(
  m6,
  'Telematyka floty',
  'Telematyka łączy GPS z danymi z pojazdu i dostarcza dysponentowi pełnego obrazu pracy floty w czasie rzeczywistym – lokalizacja, styl jazdy, zużycie paliwa, stan techniczny.

Dane z CAN bus pojazdu (obroty, ciśnienie oleju, zużycie paliwa) są przesyłane do systemu telematycznego. Dyspozytor widzi każdy pojazd na mapie i może reagować na bieżąco.

Monitoring stylu jazdy (gwałtowne hamowanie, nadmierna prędkość) pozwala obniżyć zużycie paliwa i poprawić bezpieczeństwo. Dane telematyczne służą też do rozliczeń z kierowcami.

Przykład z praktyki: Dyspozytor widzi na mapie, że kierowca stoi w korku na A4. System automatycznie przelicza ETA i wysyła klientowi powiadomienie o opóźnieniu. Dyspozytor nie musi dzwonić ani do kierowcy, ani do klienta.',
  ARRAY[
    'Telematyka dostarcza: GPS, styl jazdy, zużycie paliwa, dane diagnostyczne',
    'CAN bus przekazuje dane techniczne pojazdu do systemu telematycznego',
    'Monitoring stylu jazdy redukuje zużycie paliwa i poprawia bezpieczeństwo',
    'Dane telematyczne są podstawą do rozliczeń i oceny pracy kierowców'
  ],
  2,
  true
),
(
  m6,
  'Czas pracy kierowcy – przepisy',
  'Czas jazdy i odpoczynku kierowcy jest ściśle regulowany rozporządzeniem UE 561/2006. Nieprzestrzeganie przepisów grozi mandatem dla kierowcy i karą finansową dla firmy.

Maksymalny dobowy czas jazdy to 9 godzin (możliwe 10 h, maksymalnie 2 razy w tygodniu). Po 4,5 godzinach jazdy obowiązkowa przerwa 45 minut (lub 15+30 minut w tej kolejności).

Minimalny odpoczynek dobowy wynosi 11 godzin (może być skrócony do 9 h, maksymalnie 3 razy w tygodniu). Tachograf cyfrowy rejestruje wszystkie aktywności automatycznie.

Przykład z praktyki: Kierowca jedzie 4,5 h, robi przerwę 45 min, jedzie kolejne 4 h. Dobowy czas jazdy: 8,5 h – w normie. Tachograf zapisuje wszystko. Inspektor ITD może sprawdzić dane z ostatnich 28 dni.',
  ARRAY[
    'Max. 9 h jazdy dziennie (10 h możliwe max. 2× w tygodniu)',
    'Po 4,5 h jazdy obowiązkowa przerwa 45 minut',
    'Minimalny odpoczynek dobowy: 11 godzin',
    'Tachograf cyfrowy rejestruje automatycznie: jazda, przerwa, odpoczynek, inna praca'
  ],
  3,
  true
),
(
  m6,
  'Redukcja pustych przebiegów',
  'Pusty przebieg to jazda bez ładunku – generuje koszty (paliwo, kierowca, amortyzacja) bez żadnego przychodu i niepotrzebnie zwiększa emisję CO₂. Minimalizacja pustych przebiegów to jeden z celów każdego przewoźnika.

Giełdy transportowe (np. TimoCom, Trans.eu) łączą przewoźników z ładunkami. Dyspozytor, który jedzie po dostawie w Hamburgu do Polski, może znaleźć ładunek powrotny z Hamburga.

Backloading (ładunek powrotny) to najskuteczniejsza metoda redukcji pustych przebiegów. Dobra optymalizacja tras systemem routingu zmniejsza pusty przebieg poniżej 20%.

Przykład z praktyki: Pojazd jedzie z Krakowa do Hamburga z pełnym ładunkiem. Dyspozytor przez giełdę TimoCom znajduje ładunek z Hamburga do Warszawy. Zamiast 1 000 km pustego przebiegu – zero.',
  ARRAY[
    'Wskaźnik pustych przebiegów = km bez ładunku / km ogółem × 100%',
    'Giełdy transportowe umożliwiają znalezienie ładunku na trasę powrotną',
    'Backloading – załadunek na trasę powrotną eliminuje pusty przejazd',
    'Dobra optymalizacja tras obniża pusty przebieg poniżej 20%'
  ],
  4,
  true
);

-- ============================================================
-- MODUŁ 7 – Dokumentacja krajowa
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, key_points, order_index, is_active)
VALUES
(
  m7,
  'Prawo przewozowe w Polsce',
  'Ustawa – Prawo przewozowe z 15 listopada 1984 r. to główny akt regulujący zarobkowy przewóz towarów i osób w Polsce. Określa prawa i obowiązki wszystkich stron umowy przewozu.

Przewoźnik odpowiada za przesyłkę od chwili jej przyjęcia do chwili wydania odbiorcy. Odpowiedzialność jest limitowana – do wartości przesyłki w dniu nadania.

Reklamacje za uszkodzenia widoczne należy zgłosić przy odbiorze. Za uszkodzenia ukryte – w ciągu 7 dni. Przewoźnik ma 30 dni na odpowiedź; brak odpowiedzi = reklamacja uznana.

Przykład z praktyki: Klient odbiera paletę z wgniecionym kartonem. Zgłasza uszkodzenie na liście przewozowym przy odbiorze, robi zdjęcia i składa reklamację w ciągu 7 dni. Przewoźnik ma obowiązek wypłaty odszkodowania do wysokości wartości towaru.',
  ARRAY[
    'Prawo przewozowe z 1984 r. reguluje zarobkowy przewóz w Polsce',
    'Przewoźnik odpowiada za towar od przyjęcia do wydania odbiorcy',
    'Reklamacje za uszkodzenia ukryte: max. 7 dni od odbioru',
    'Brak odpowiedzi na reklamację w 30 dni = reklamacja uznana'
  ],
  1,
  true
),
(
  m7,
  'Umowa spedycji – Kodeks cywilny',
  'Działalność spedytora w Polsce reguluje Kodeks cywilny, art. 794–804. Spedytor zobowiązuje się za wynagrodzeniem do wysyłania lub odbioru przesyłki i dokonania innych usług związanych z jej przewozem.

Spedytor działa w imieniu zleceniodawcy i na jego rachunek. Odpowiada za właściwy dobór przewoźnika i organizację przewozu. Może jednocześnie być przewoźnikiem (spedytor-przewoźnik).

Wynagrodzenie spedytora to prowizja lub marża na frachcie. Zlecenie transportowe jest podstawowym dokumentem potwierdzającym zawarcie umowy z przewoźnikiem.

Przykład z praktyki: Firma produkcyjna zleca spedytorowi transport z Krakowa do Mediolanu. Spedytor dobiera przewoźnika, negocjuje stawkę, wystawia zlecenie transportowe, organizuje dokumenty i rozlicza fracht – klient dostaje jedną fakturę.',
  ARRAY[
    'Spedytor działa na podstawie art. 794–804 Kodeksu cywilnego',
    'Odpowiada za dobór przewoźnika i organizację całego przewozu',
    'Może jednocześnie być przewoźnikiem (spedytor-przewoźnik)',
    'Wynagrodzenie: prowizja lub marża na frachcie'
  ],
  2,
  true
),
(
  m7,
  'Dokumenty w krajowym transporcie drogowym',
  'Każdy przewóz krajowy musi być udokumentowany. Kierowca musi mieć przy sobie komplet dokumentów – ich brak lub nieprawidłowość to podstawa do mandatu podczas kontroli ITD.

WZ (Wydanie Zewnętrzne) to dokument magazynowy potwierdzający wydanie towaru poza firmę. Jest podstawą do wystawienia faktury i dowodem rozchodu magazynowego.

Licencja na krajowy transport drogowy jest obowiązkowa dla firm wykonujących zarobkowy przewóz. OCP (ubezpieczenie odpowiedzialności cywilnej przewoźnika) chroni przed kosztami szkód.

Przykład z praktyki: Podczas kontroli ITD kierowca okazuje: prawo jazdy, dowód rejestracyjny, kartę kierowcy z tachografu, wydruk tachografu, list przewozowy, licencję firmy i polisę OCP. Wszystko w porządku – kontrola trwa 10 minut.',
  ARRAY[
    'WZ (Wydanie Zewnętrzne) – dokument magazynowy wydania towaru poza firmę',
    'Licencja transportowa obowiązkowa przy zarobkowym przewozie rzeczy',
    'OCP – ubezpieczenie odpowiedzialności cywilnej przewoźnika',
    'Kierowca musi mieć przy sobie komplet dokumentów podczas kontroli'
  ],
  3,
  true
),
(
  m7,
  'Kontrola drogowa i organy nadzoru',
  'Transport drogowy w Polsce kontroluje kilka organów. Każdy ma inne uprawnienia. Przewoźnik i kierowca muszą znać swoje obowiązki podczas kontroli.

ITD (Inspekcja Transportu Drogowego) to główny organ kontrolny – sprawdza tachografy, czas pracy kierowców, dokumenty, stan techniczny pojazdów i przestrzeganie przepisów transportowych.

Policja kontroluje dokumenty i przestrzeganie przepisów ruchu drogowego. Służba celno-skarbowa (KAS) kontroluje przy przekraczaniu granicy i w kwestiach podatkowych.

Przykład z praktyki: Inspektor ITD zatrzymuje ciężarówkę. Sprawdza tachograf (ostatnie 28 dni), licencję firmy, czas pracy kierowcy w bieżącym tygodniu i stan techniczny pojazdu. Za przekroczenie czasu jazdy o 1 godzinę – mandat do 2 000 zł dla kierowcy.',
  ARRAY[
    'ITD – główny organ kontroli transportu drogowego w Polsce',
    'ITD sprawdza tachografy, czas pracy, dokumenty i stan techniczny pojazdu',
    'Policja kontroluje dokumenty i przestrzeganie przepisów ruchu drogowego',
    'Mandat za naruszenie przepisów o czasie jazdy: do 2 000 zł'
  ],
  4,
  true
);

-- ============================================================
-- MODUŁ 8 – RFID i kody kreskowe
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, key_points, order_index, is_active)
VALUES
(
  m8,
  'Kody kreskowe 1D i 2D',
  'Kody kreskowe to najpowszechniejsza technologia automatycznej identyfikacji w logistyce. Odczytywane są przez skanery – laserowe (tylko 1D) lub optyczne/kamerowe (1D i 2D).

Kody 1D (liniowe) kodują dane w jednym wymiarze przez zmienną szerokość kresek. EAN-13 identyfikuje produkty konsumenckie. Code 128 stosowany jest na etykietach logistycznych – może kodować litery i cyfry.

Kody 2D (macierzowe) kodują dane w obu wymiarach. QR Code i Data Matrix pomieszczą znacznie więcej informacji niż kody 1D. Coraz częściej stosowane w logistyce do kodowania szczegółowych danych.

Przykład z praktyki: Magazynier skanuje etykietę Code 128 na kartonie. WMS automatycznie odczytuje numer produktu, numer partii i masę – bez ręcznego wpisywania. Przyjęcie 20 palet zajmuje 5 minut zamiast godziny.',
  ARRAY[
    'EAN-13 – kod identyfikacji produktów konsumenckich (GTIN)',
    'Code 128 – kod logistyczny; koduje litery, cyfry i znaki specjalne',
    'QR Code i Data Matrix – kody 2D o pojemności wielokrotnie większej niż 1D',
    'Skanery laserowe czytają tylko 1D; skanery obrazowe czytają 1D i 2D'
  ],
  1,
  true
),
(
  m8,
  'Technologia RFID',
  'RFID (Radio Frequency Identification) umożliwia odczyt danych bez kontaktu wzrokowego i – co najważniejsze – jednoczesny odczyt setek tagów naraz. To niemożliwe przy kodach kreskowych.

Tag RFID (transponder) zawiera chip z danymi i antenę. Pasywny tag czerpie energię z pola elektromagnetycznego czytnika – nie potrzebuje baterii. Aktywny tag ma własną baterię i zasięg do 100 m.

W logistyce dominuje RFID UHF (860–960 MHz) ze względu na zasięg do kilku metrów i możliwość bulk reading (jednoczesny odczyt wielu tagów).

Przykład z praktyki: Na bramce wjazdowej do magazynu zainstalowane są anteny RFID UHF. Ciężarówka wjeżdża z 40 paletami z tagami. Bramka odczytuje wszystkie 40 tagów w 2 sekundy i rejestruje przyjęcie w WMS. Zero skanowania ręcznego.',
  ARRAY[
    'RFID umożliwia odczyt bez linii wzroku i jednoczesny odczyt wielu tagów',
    'Tag pasywny: bez baterii, zasięg do kilku metrów',
    'Tag aktywny: własna bateria, zasięg do 100 m, droższy',
    'RFID UHF (860–960 MHz) – standard w logistyce magazynowej'
  ],
  2,
  true
),
(
  m8,
  'Standardy GS1',
  'GS1 to globalna organizacja definiująca standardy identyfikacji i wymiany danych w logistyce. Bez GS1 każda firma używałaby własnych numerów – globalny łańcuch dostaw byłby niemożliwy.

GTIN (Global Trade Item Number) to unikalny numer produktu – widoczny jako EAN-13 lub EAN-8 na każdym opakowaniu konsumenckim. GLN (Global Location Number) identyfikuje firmy i lokalizacje.

SSCC (Serial Shipping Container Code) to 18-cyfrowy numer przypisywany każdej jednostce logistycznej (palecie, pojemnikowi). Unikalny globalnie – żadne dwie palety na świecie nie mają tego samego SSCC.

Przykład z praktyki: Producent nadaje każdej palecie unikalny SSCC. Sieć handlowa skanuje SSCC przy przyjęciu towaru – system natychmiast wie, co jest na palecie, z jakiej partii, z jaką datą ważności. Bez otwierania ani jednego kartonu.',
  ARRAY[
    'GTIN – globalny numer produktu (EAN-13 na opakowaniu konsumenckim)',
    'GLN – globalny numer lokalizacyjny (firmy, magazyny, punkty dostaw)',
    'SSCC – 18-cyfrowy unikalny numer jednostki logistycznej (palety)',
    'GS1 zapewnia globalną kompatybilność numerów w łańcuchu dostaw'
  ],
  3,
  true
),
(
  m8,
  'Etykieta logistyczna i NFC',
  'Etykieta logistyczna GS1-128 to standard oznaczania palet i jednostek wysyłkowych. Zawiera dane zakodowane w kodzie kreskowym Code 128 z identyfikatorami zastosowania (AI).

Typowe dane na etykiecie: SSCC (AI 00), GTIN (AI 01), numer partii (AI 10), data ważności (AI 17), masa (AI 310x). Każde pole zaczyna się od kodu AI, by systemy wiedziały, jak interpretować dane.

NFC (Near Field Communication) to technologia bliskiego zasięgu (do ~10 cm), podzbiór RFID HF. Stosowana w logistyce do weryfikacji autentyczności produktów i śledzenia ekspresowych przesyłek.

Przykład z praktyki: Na palecie z lekami przyklejona jest etykieta GS1-128 z SSCC, GTIN, numerem partii i datą ważności. Farmaceuta przy przyjęciu skanuje etykietę – system automatycznie sprawdza, czy partia nie jest wycofana z rynku.',
  ARRAY[
    'Etykieta GS1-128 zawiera SSCC, GTIN, numer partii, datę ważności i masę',
    'AI (Application Identifier) – kod identyfikujący typ danych na etykiecie',
    'NFC działa do ~10 cm; stosowane w autentykacji i płatnościach',
    'Smart labels łączą kod kreskowy z chipem RFID na jednej etykiecie'
  ],
  4,
  true
);

END;
$$;

-- ============================================================
-- WERYFIKACJA
-- ============================================================
SELECT
  m.title AS modul,
  COUNT(l.id) AS lekcje,
  COUNT(q.id) AS pytania
FROM public.modules m
LEFT JOIN public.lessons  l ON l.module_id = m.id AND l.is_active = true
LEFT JOIN public.questions q ON q.module_id = m.id AND q.is_active = true
WHERE m.status = 'published'
GROUP BY m.id, m.title, m.order_index
ORDER BY m.order_index;
