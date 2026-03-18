-- ============================================================
-- ETAP 6: Treści edukacyjne BCU – 8 modułów tematycznych
-- Branżowe Centrum Umiejętności w Andrychowie
-- Uruchom w: Supabase Dashboard → SQL Editor
-- ============================================================

-- 0. Dodaj kolumnę educational_content do modules (jeśli nie istnieje)
alter table public.modules
  add column if not exists educational_content text;

-- ============================================================
-- MODUŁY I PYTANIA
-- ============================================================

DO $$
DECLARE
  m1  uuid := gen_random_uuid();
  m2  uuid := gen_random_uuid();
  m3  uuid := gen_random_uuid();
  m4  uuid := gen_random_uuid();
  m5  uuid := gen_random_uuid();
  m6  uuid := gen_random_uuid();
  m7  uuid := gen_random_uuid();
  m8  uuid := gen_random_uuid();
BEGIN

-- ============================================================
-- INSERT MODULES
-- ============================================================

INSERT INTO public.modules (id, title, description, educational_content, order_index, status, is_active, icon)
VALUES
(
  m1,
  'Akty prawne i dokumentacja – spedycja międzynarodowa',
  'Przepisy prawa regulujące działalność przewoźnika i spedytora w transporcie międzynarodowym. Konwencje CMR, COTIF, ADR, dokumenty celne i spedycyjne.',
  'Transport międzynarodowy regulowany jest przez szereg konwencji i aktów prawnych. Konwencja CMR normuje umowę o przewóz drogowy towarów. List przewozowy CMR jest podstawowym dokumentem potwierdzającym zawarcie umowy. Konwencja COTIF i CIM dotyczą transportu kolejowego. ADR reguluje przewóz towarów niebezpiecznych drogą lądową. Incoterms 2020 to zbiór reguł handlowych określających podział kosztów i ryzyka. Do dokumentów celnych należą: deklaracja celna SAD, karnety TIR, ATA, świadectwa EUR.1.',
  1, 'published', true, 'scale'
),
(
  m2,
  'Gospodarka magazynowa – opakowania i ślad węglowy',
  'Nowoczesne systemy opakowań w logistyce, zarządzanie opakowaniami zwrotnymi, obliczanie śladu węglowego w łańcuchu dostaw.',
  'Opakowanie w logistyce pełni funkcję ochronną, manipulacyjną, informacyjną i marketingową. Rozróżniamy opakowania jednostkowe, zbiorcze i transportowe. Ślad węglowy to całkowita emisja gazów cieplarnianych wyrażona w ekwiwalencie CO₂. Metody redukcji: konsolidacja ładunków, eco-driving, pojazdy elektryczne. Dyrektywa opakowaniowa UE nakłada obowiązki recyklingu i odzysku.',
  2, 'published', true, 'leaf'
),
(
  m3,
  'Programy transportowe – optymalizacja załadunku',
  'Zastosowanie oprogramowania do planowania i optymalizacji załadunku pojazdów. Algorytmy rozmieszczenia ładunku, 3D load planning, wymogi wagowo-gabarytowe.',
  'Optymalizacja załadunku to proces rozmieszczenia ładunków w przestrzeni ładowni maksymalizujący wykorzystanie kubatury przy zachowaniu wymogów bezpieczeństwa. Programy generują plany rozmieszczenia w 2D i 3D. Kluczowe parametry: masa ładunku, rozkład nacisku na osie, wymiary i kształt ładunków, klasy piętrzenia. Środki mocowania ładunku są obowiązkowe zgodnie z normami EN 12195.',
  3, 'published', true, 'package'
),
(
  m4,
  'Programy transportowe – dokumentacja transportowa',
  'Elektroniczne systemy generowania i zarządzania dokumentacją transportową. eCMR, e-dokumenty celne, systemy TMS, integracje EDI.',
  'Elektroniczny list przewozowy eCMR jest cyfrowym odpowiednikiem papierowego CMR. Systemy TMS umożliwiają tworzenie i wymianę dokumentów transportowych. EDI to standardowy format wymiany danych między partnerami logistycznymi. System NCTS obsługuje tranzyt celny w UE. Podpis elektroniczny zapewnia ważność prawną dokumentów cyfrowych.',
  4, 'published', true, 'file-text'
),
(
  m5,
  'Gospodarka magazynowa – oprogramowanie WMS',
  'Systemy zarządzania magazynem (WMS). Funkcje, moduły, wdrożenie i obsługa. Integracje z ERP i TMS. Automatyczna identyfikacja towarów.',
  'WMS to oprogramowanie do zarządzania operacjami magazynowymi: przyjęciem towaru, lokalizacją, kompletacją, wysyłką i inwentaryzacją. Strategie składowania: FIFO, FEFO, LIFO, ABC. WMS integruje się z ERP przez API lub EDI. Urządzenia mobilne i systemy Pick-by-Voice zwiększają wydajność kompletacji.',
  5, 'published', true, 'database'
),
(
  m6,
  'Programy transportowe – optymalizacja tras',
  'Algorytmy planowania i optymalizacji tras. Systemy routingu, TSP, VRP, dynamiczna nawigacja, telematyka floty.',
  'Optymalizacja tras pozwala minimalizować koszty, czas przejazdu i emisję CO₂. Problem komiwojażera TSP polega na znalezieniu najkrótszej trasy łączącej wszystkie punkty. VRP uwzględnia wiele pojazdów i ograniczenia. Telematyka floty monitoruje lokalizację pojazdów GPS, styl jazdy i zużycie paliwa. Tachograf cyfrowy rejestruje czas jazdy i odpoczynku wg rozporządzenia UE 561/2006.',
  6, 'published', true, 'map'
),
(
  m7,
  'Akty prawne i dokumentacja – spedycja krajowa',
  'Polskie przepisy prawa transportowego i spedycyjnego. Prawo przewozowe, Kodeks cywilny, dokumenty transportowe w obrocie krajowym.',
  'Transport krajowy regulowany jest przez Ustawę – Prawo przewozowe z 1984 r. List przewozowy jest podstawowym dokumentem umowy o przewóz. Spedytor krajowy działa na podstawie Kodeksu cywilnego art. 794–804. Ustawa o transporcie drogowym reguluje działalność zarobkową. Licencja transportowa i zezwolenia są obowiązkowe dla przewoźników.',
  7, 'published', true, 'landmark'
),
(
  m8,
  'Technologie identyfikacyjne – RFID, kody kreskowe, etykiety logistyczne',
  'Automatyczna identyfikacja w magazynowaniu i transporcie. Kody kreskowe 1D i 2D, technologia RFID, standardy GS1, etykiety logistyczne GS1-128.',
  'Automatyczna identyfikacja obejmuje: kody kreskowe, QR kody, RFID, NFC. Kod kreskowy 1D (EAN-13, Code 128) przechowuje dane w kreszkach. Kod 2D (QR Code) pozwala zakodować znacznie więcej danych. Standard GS1 definiuje globalne numery: GTIN, GLN, SSCC. RFID umożliwia odczyt bez kontaktu wzrokowego i jednoczesny odczyt wielu tagów.',
  8, 'published', true, 'scan-barcode'
);

-- ============================================================
-- MODUŁ 1: Akty prawne – spedycja MIĘDZYNARODOWA
-- ============================================================

INSERT INTO public.questions (module_id, question_text, options, correct_answer, explanation, difficulty, difficulty_text, is_active)
VALUES
(m1, 'Jaką konwencję stosuje się do umów o drogowy przewóz towarów w transporcie międzynarodowym?',
 '["Konwencja CIM","Konwencja CMR","Konwencja ADR","Konwencja IATA"]'::jsonb,
 1, 'Konwencja CMR reguluje umowy o drogowy przewóz towarów w transporcie międzynarodowym między krajami, które ją ratyfikowały.',
 2, 'medium', true),

(m1, 'Które z poniższych jest podstawowym dokumentem potwierdzającym zawarcie umowy przewozu w transporcie drogowym międzynarodowym?',
 '["Konosament","Deklaracja celna SAD","List przewozowy CMR","Karta TIR"]'::jsonb,
 2, 'List przewozowy CMR jest podstawowym dokumentem potwierdzającym zawarcie umowy o przewóz i warunki jej realizacji w transporcie drogowym międzynarodowym.',
 1, 'easy', true),

(m1, 'Czym regulowany jest przewóz towarów niebezpiecznych drogą lądową w transporcie międzynarodowym?',
 '["Konwencja SOLAS","Przepisy ADR","Konwencja CMR","Przepisy IMDG"]'::jsonb,
 1, 'ADR to europejska umowa regulująca przewóz towarów niebezpiecznych w transporcie drogowym.',
 1, 'easy', true),

(m1, 'Jakie jest zadanie spedytora w transporcie międzynarodowym?',
 '["Wyłącznie kierowanie pojazdem","Organizacja przewozu w imieniu zleceniodawcy i dobór środka transportu","Produkcja dokumentów celnych","Kontrola graniczna towarów"]'::jsonb,
 1, 'Spedytor organizuje przewóz towaru w imieniu i na rachunek zleceniodawcy, dobiera odpowiedni środek transportu, zawiera umowy z przewoźnikami i kompletuje dokumenty.',
 2, 'medium', true),

(m1, 'Co oznacza skrót Incoterms?',
 '["Integrated Commercial Terms","International Commercial Terms","International Container Terms","Internal Commerce Transactions"]'::jsonb,
 1, 'Incoterms (International Commercial Terms) to zbiór reguł handlowych Międzynarodowej Izby Handlowej definiujących podział kosztów, ryzyka i obowiązków między sprzedającym a kupującym.',
 2, 'medium', true),

(m1, 'Która reguła Incoterms 2020 oznacza, że sprzedający dostarcza towar do portu przeznaczenia, pokrywając transport i ubezpieczenie?',
 '["EXW","FOB","CIF","DDP"]'::jsonb,
 2, 'CIF (Cost, Insurance and Freight) – sprzedający ponosi koszty transportu i ubezpieczenia do portu przeznaczenia. Ryzyko przechodzi na kupującego w momencie załadunku na statek.',
 3, 'hard', true),

(m1, 'Karnet TIR w transporcie drogowym służy do:',
 '["Rejestracji pojazdów ciężarowych","Procedury tranzytowej przez kraje spoza UE","Ubezpieczenia ładunku","Certyfikacji kierowcy"]'::jsonb,
 1, 'Karnet TIR to dokument celny umożliwiający tranzyt drogowy przez wiele krajów bez szczegółowej kontroli celnej na każdej granicy.',
 2, 'medium', true),

(m1, 'Jakie świadectwo potwierdza preferencyjne pochodzenie towarów wywożonych z UE do krajów śródziemnomorskich?',
 '["Formularz SAD","Świadectwo EUR.1","Konosament B/L","Karta TIR"]'::jsonb,
 1, 'Świadectwo EUR.1 potwierdza preferencyjne pochodzenie towarów i uprawnia do obniżonych stawek celnych w handlu UE z krajami objętymi umowami stowarzyszeniowymi.',
 3, 'hard', true),

(m1, 'Przez ile egzemplarzy wystawia się list przewozowy CMR?',
 '["2 egzemplarze","3 egzemplarze","4 egzemplarze","5 egzemplarzy"]'::jsonb,
 1, 'List CMR wystawia się w co najmniej 3 egzemplarzach: dla nadawcy (czerwony), dla odbiorcy (niebieski) i dla przewoźnika (zielony).',
 2, 'medium', true),

(m1, 'Która konwencja reguluje kolejowy przewóz towarów w transporcie międzynarodowym?',
 '["Konwencja CIM (COTIF)","Konwencja CMR","Konwencja ADR","Konwencja IATA"]'::jsonb,
 0, 'CIM stanowi aneks do konwencji COTIF i reguluje umowy o międzynarodowy kolejowy przewóz towarów.',
 2, 'medium', true);

-- ============================================================
-- MODUŁ 2: Gospodarka magazynowa – opakowania i ślad węglowy
-- ============================================================

INSERT INTO public.questions (module_id, question_text, options, correct_answer, explanation, difficulty, difficulty_text, is_active)
VALUES
(m2, 'Jaką funkcję NIE pełni opakowanie w logistyce?',
 '["Ochronną","Manipulacyjną","Produkcyjną","Informacyjną"]'::jsonb,
 2, 'Opakowanie pełni funkcje: ochronną, manipulacyjną, informacyjną i marketingową. Funkcja produkcyjna nie jest przypisywana opakowaniu.',
 1, 'easy', true),

(m2, 'Czym jest ślad węglowy (carbon footprint)?',
 '["Masa CO₂ emitowana wyłącznie przez transport lotniczy","Całkowita emisja gazów cieplarnianych wyrażona w ekwiwalencie CO₂","Wskaźnik zużycia paliwa przez pojazd","Masa odpadów opakowaniowych"]'::jsonb,
 1, 'Ślad węglowy to suma emisji wszystkich gazów cieplarnianych wyrażona w ekwiwalencie CO₂, związana z produktem, procesem lub organizacją w całym cyklu życia.',
 1, 'easy', true),

(m2, 'Które działanie najbardziej redukuje ślad węglowy w transporcie?',
 '["Zwiększenie częstotliwości dostaw","Konsolidacja ładunków i pełne załadowanie pojazdów","Stosowanie wyłącznie transportu lotniczego","Zwiększenie liczby magazynów"]'::jsonb,
 1, 'Konsolidacja ładunków i maksymalne wykorzystanie ładowności pojazdów znacząco obniża emisję CO₂ na jednostkę ładunku.',
 2, 'medium', true),

(m2, 'Co oznacza pojęcie Pool System w zarządzaniu opakowaniami?',
 '["System magazynowania towarów w basenach chłodniczych","System wymiany i zarządzania opakowaniami zwrotnymi (paletami)","Cyfrowa platforma zamówień","Rodzaj ubezpieczenia ładunku"]'::jsonb,
 1, 'Pool System to system dzierżawy i wymiany opakowań zwrotnych (palet EUR, pojemników) pomiędzy uczestnikami łańcucha dostaw. Operator systemu (np. CHEP) zarządza pulą opakowań.',
 2, 'medium', true),

(m2, 'Jaki certyfikat potwierdza zrównoważoną gospodarkę leśną dla opakowań papierowych?',
 '["ISO 9001","FSC (Forest Stewardship Council)","ISO 14001","CE"]'::jsonb,
 1, 'Certyfikat FSC potwierdza, że drewno lub papier użyty do produkcji opakowania pochodzi z odpowiedzialnie zarządzanych lasów.',
 2, 'medium', true),

(m2, 'Które z niżej wymienionych opakowań jest opakowaniem transportowym?',
 '["Butelka szklana 0,5l","Karton jednostkowy na 1 produkt","Paleta z towarem owiniętym folią stretch","Saszetka foliowa"]'::jsonb,
 2, 'Opakowanie transportowe służy do zabezpieczenia towaru podczas transportu i magazynowania. Paleta z zafoliowanym towarem jest klasycznym opakowaniem transportowym.',
 1, 'easy', true),

(m2, 'Jaka dyrektywa UE określa wymagania dotyczące opakowań i odpadów opakowaniowych?',
 '["Dyrektywa REACH","Dyrektywa 94/62/WE o opakowaniach","Dyrektywa WEEE","Dyrektywa RoHS"]'::jsonb,
 1, 'Dyrektywa 94/62/WE harmonizuje wymagania dotyczące opakowań i odpadów opakowaniowych w UE, w tym poziomy odzysku i recyklingu.',
 3, 'hard', true),

(m2, 'Jak oblicza się emisję CO₂ dla drogowego transportu towarów?',
 '["Waga ładunku × stawka celna","Liczba km × współczynnik emisji pojazdu (kg CO₂/km)","Czas dostawy × zużycie paliwa","Cena paliwa × liczba pojazdów"]'::jsonb,
 1, 'Emisję CO₂ oblicza się jako iloczyn przebytych kilometrów i współczynnika emisji danego pojazdu (kg CO₂/km), który zależy od typu pojazdu i paliwa.',
 2, 'medium', true),

(m2, 'Co to jest gospodarka o obiegu zamkniętym (circular economy) w kontekście opakowań?',
 '["System jednorazowego użycia opakowań","Model zakładający ponowne użycie, naprawę i recykling opakowań zamiast ich utylizacji","Automatyczne sortowanie odpadów w magazynie","Produkcja opakowań metalowych"]'::jsonb,
 1, 'Gospodarka o obiegu zamkniętym dąży do eliminacji odpadów przez utrzymywanie materiałów i produktów w obiegu poprzez wielokrotne użycie, naprawę, regenerację i recykling.',
 2, 'medium', true),

(m2, 'Które opakowanie stosuje się jako jednostkę ładunkową w transporcie i magazynowaniu?',
 '["Butelka PET","Paleta EUR (EURO pallet) o wymiarach 800×1200 mm","Koperta bąbelkowa","Tubka aluminiowa"]'::jsonb,
 1, 'Paleta EUR (europejska) o wymiarach 800×1200 mm jest standardową jednostką ładunkową w europejskim transporcie i magazynowaniu, zarządzaną przez system EUR-EPAL.',
 1, 'easy', true);

-- ============================================================
-- MODUŁ 3: Programy transportowe – optymalizacja załadunku
-- ============================================================

INSERT INTO public.questions (module_id, question_text, options, correct_answer, explanation, difficulty, difficulty_text, is_active)
VALUES
(m3, 'Co to jest ULR (Unit Load Ratio)?',
 '["Czas załadunku pojazdu","Współczynnik wykorzystania przestrzeni ładowni","Jednostka masy ładunku","Numer rejestracyjny jednostki ładunkowej"]'::jsonb,
 1, 'ULR to stosunek objętości rzeczywistej ładunku do całkowitej objętości przestrzeni ładowni. Wyższy wskaźnik oznacza lepsze wykorzystanie pojazdu.',
 2, 'medium', true),

(m3, 'Gdzie powinny być umieszczone ciężkie ładunki w przestrzeni ładowni pojazdu ciężarowego?',
 '["Na górze i na końcu naczepy","Na dole i jak najbliżej kabiny kierowcy (z przodu)","W środku naczepy na wysokości 1,5 m","Rozmieszczenie nie ma znaczenia"]'::jsonb,
 1, 'Ciężkie ładunki umieszcza się jak najniżej (obniżenie środka ciężkości) i jak najbliżej osi pojazdu, co zapewnia stabilność i prawidłowy rozkład nacisku na osie.',
 1, 'easy', true),

(m3, 'Która norma europejska reguluje mocowanie ładunków w transporcie drogowym?',
 '["EN 12195","ISO 9001","EN 13000","ADR klasa 3"]'::jsonb,
 0, 'Norma EN 12195 określa wymagania dotyczące środków mocowania ładunków na pojazdach drogowych, w tym obliczeń sił i doboru pasów, łańcuchów oraz klinów.',
 2, 'medium', true),

(m3, 'Jaką informację MUSI zawierać plan załadunku generowany przez program do optymalizacji?',
 '["Kolor opakowań","Rozmieszczenie ładunków w przestrzeni ładowni z uwzględnieniem masy i wymiarów","Dane osobowe kierowcy","Cenę frachtu"]'::jsonb,
 1, 'Plan załadunku powinien zawierać wizualizację rozmieszczenia ładunków (2D/3D) z danymi o masie, wymiarach, kolejności załadunku i środkach mocowania.',
 1, 'easy', true),

(m3, 'Co to jest klasa piętrzenia (stacking class) opakowania?',
 '["Kategoria celna towaru","Maksymalne obciążenie, które może przyjąć opakowanie od góry bez uszkodzenia","Rodzaj materiału opakowania","Wysokość składowania towaru"]'::jsonb,
 1, 'Klasa piętrzenia określa maksymalną siłę nacisku od góry, jaką może wytrzymać opakowanie podczas układania w stos. Jest kluczowa przy planowaniu wielopoziomowego załadunku.',
 2, 'medium', true),

(m3, 'Dopuszczalna masa całkowita pojazdu ciężarowego z naczepą (zespół pojazdów) w Polsce wynosi standardowo:',
 '["36 ton","40 ton","44 tony","50 ton"]'::jsonb,
 1, 'Standardowa DMC dla zestawu ciągnik + naczepa na drogach publicznych w Polsce i UE wynosi 40 ton, a w specjalnych przypadkach do 44 ton.',
 2, 'medium', true),

(m3, 'Czym charakteryzuje się ładunek ADR klasy 3?',
 '["Materiały wybuchowe","Gazy","Materiały ciekłe zapalne","Materiały utleniające"]'::jsonb,
 2, 'Klasa 3 ADR obejmuje materiały ciekłe zapalne (np. benzyna, alkohol, farby rozpuszczalnikowe). Każda klasa wymaga specjalnych zasad przewozu i oznakowania pojazdu.',
 3, 'hard', true),

(m3, 'Który wskaźnik mierzy efektywność załadunku pod względem wagowym?',
 '["Współczynnik objętości","Współczynnik wykorzystania ładowności wagowej (payload utilization)","Wskaźnik rotacji","Czas załadunku"]'::jsonb,
 1, 'Payload utilization to stosunek rzeczywistej masy załadunku do maksymalnej dopuszczalnej ładowności pojazdu, wyrażony w procentach.',
 2, 'medium', true),

(m3, 'W jakim celu stosuje się maty antypoślizgowe przy załadunku?',
 '["Dekoracja przestrzeni ładunkowej","Zapobieganie przesuwaniu się ładunku podczas jazdy i zwiększenie sił mocowania","Izolacja termiczna towaru","Zmniejszenie masy ładunku"]'::jsonb,
 1, 'Maty antypoślizgowe umieszczane między ładunkami a podłogą lub między warstwami zwiększają tarcie, redukując ryzyko przemieszczenia towaru.',
 1, 'easy', true),

(m3, 'Jaki jest cel generowania 3D planu załadunku?',
 '["Wyłącznie do celów graficznych","Wizualizacja optymalnego rozmieszczenia ładunków w 3 wymiarach dla bezpiecznego i efektywnego załadunku","Obliczenie ceny frachtu","Dokumentacja powypadkowa"]'::jsonb,
 1, 'Plan 3D pozwala dokładnie zwizualizować rozmieszczenie wszystkich ładunków, zidentyfikować kolizje wymiarowe i sprawdzić rozkład masy przed fizycznym załadunkiem.',
 1, 'easy', true);

-- ============================================================
-- MODUŁ 4: Programy transportowe – dokumentacja transportowa
-- ============================================================

INSERT INTO public.questions (module_id, question_text, options, correct_answer, explanation, difficulty, difficulty_text, is_active)
VALUES
(m4, 'Co to jest eCMR?',
 '["Elektroniczny system kontroli czasu pracy","Elektroniczny list przewozowy w transporcie drogowym","Program do zarządzania magazynem","Cyfrowe ubezpieczenie ładunku"]'::jsonb,
 1, 'eCMR to elektroniczny list przewozowy, cyfrowy odpowiednik papierowego CMR. Podstawą prawną jest protokół dodatkowy do Konwencji CMR przyjęty w 2008 r.',
 1, 'easy', true),

(m4, 'Czym jest TMS w kontekście zarządzania transportem?',
 '["Transport Management System – system do zarządzania operacjami transportowymi","Truck Monitoring Service","Terminal Message System","Time Management Software"]'::jsonb,
 0, 'TMS (Transport Management System) to oprogramowanie wspierające planowanie, wykonywanie i optymalizację operacji transportowych, w tym generowanie dokumentów i śledzenie przesyłek.',
 1, 'easy', true),

(m4, 'Jaki standard EDI jest najczęściej stosowany w europejskiej logistyce?',
 '["ANSI X12","EDIFACT (UN/EDIFACT)","JSON-LD","FIX Protocol"]'::jsonb,
 1, 'UN/EDIFACT to standard ONZ powszechnie stosowany w europejskiej logistyce do elektronicznej wymiany danych.',
 2, 'medium', true),

(m4, 'Co to jest POD w transporcie?',
 '["Point of Departure – punkt nadania","Proof of Delivery – potwierdzenie dostarczenia","Port of Discharge – port wyładunku","Payment on Demand"]'::jsonb,
 1, 'POD (Proof of Delivery) to dokument lub elektroniczne potwierdzenie, że towar został dostarczony do odbiorcy. Może zawierać podpis odbiorcy i datę dostawy.',
 1, 'easy', true),

(m4, 'Który system obsługuje tranzyt celny w Unii Europejskiej?',
 '["NCTS (New Computerised Transit System)","TRACES","TARIC","REX"]'::jsonb,
 0, 'NCTS to elektroniczny system celny UE i EFTA obsługujący zgłoszenia tranzytowe T1, T2 i TIR w czasie rzeczywistym.',
 3, 'hard', true),

(m4, 'Jaką funkcję pełni podpis elektroniczny na dokumentach transportowych?',
 '["Zmniejsza rozmiar pliku","Zapewnia integralność i autentyczność dokumentu oraz jego ważność prawną","Szyfruje dane ładunku","Przyspiesza odprawę celną"]'::jsonb,
 1, 'Podpis elektroniczny kwalifikowany zapewnia identyfikację podpisującego, integralność dokumentu i nadaje mu moc prawną równą podpisowi własnoręcznemu.',
 2, 'medium', true),

(m4, 'Co to jest EDI w logistyce?',
 '["Electronic Distance Indicator","Electronic Data Interchange – elektroniczna wymiana danych między systemami","Enhanced Delivery Interface","European Dispatch Initiative"]'::jsonb,
 1, 'EDI to elektroniczna wymiana dokumentów handlowych i logistycznych (zamówień, faktur, listów przewozowych) między systemami informatycznymi partnerów biznesowych.',
 1, 'easy', true),

(m4, 'Który dokument wystawia spedytor jako potwierdzenie przyjęcia przesyłki do przewozu morskiego?',
 '["CMR","Konosament (Bill of Lading)","Karta TIR","Deklaracja SAD"]'::jsonb,
 1, 'Konosament (Bill of Lading, B/L) wystawiany przez armatora lub spedytora morskiego potwierdza przyjęcie towaru do przewozu. Ma charakter papieru wartościowego.',
 2, 'medium', true),

(m4, 'Jaką zaletę ma eCMR w porównaniu z papierowym CMR?',
 '["Jest jedynym dokumentem wymaganym przez prawo","Przyspiesza przepływ informacji, zmniejsza koszty i umożliwia śledzenie przesyłki w czasie rzeczywistym","Eliminuje konieczność ubezpieczenia ładunku","Jest zawsze tańszy"]'::jsonb,
 1, 'eCMR pozwala na natychmiastowe przekazywanie informacji między stronami, redukuje koszty administracyjne i eliminuje ryzyko zagubienia dokumentu papierowego.',
 2, 'medium', true),

(m4, 'Co to jest lista załadowcza (loading list)?',
 '["Umowa z przewoźnikiem","Dokument wyszczególniający wszystkie pozycje załadowane na pojazd z ich wagami i wymiarami","Certyfikat pochodzenia towaru","Plan tras pojazdu"]'::jsonb,
 1, 'Lista załadowcza to szczegółowe zestawienie wszystkich pozycji ładunku na pojeździe. Zawiera numery referencyjne, opisy, masy i wymiary. Uzupełnia list przewozowy CMR.',
 2, 'medium', true);

-- ============================================================
-- MODUŁ 5: Gospodarka magazynowa – oprogramowanie WMS
-- ============================================================

INSERT INTO public.questions (module_id, question_text, options, correct_answer, explanation, difficulty, difficulty_text, is_active)
VALUES
(m5, 'Co oznacza skrót WMS?',
 '["Warehouse Management System","Web Mobile Service","Warehouse Measurement Scale","Work Management Software"]'::jsonb,
 0, 'WMS (Warehouse Management System) to system informatyczny służący do zarządzania operacjami magazynowymi: przyjęciem, składowaniem, kompletacją i wysyłką towarów.',
 1, 'easy', true),

(m5, 'Jaka strategia wydania towaru stosuje zasadę "pierwsze przyszło – pierwsze wyszło"?',
 '["LIFO","FEFO","FIFO","ABC"]'::jsonb,
 2, 'FIFO (First In, First Out) to strategia, w której towar najdłużej przechowywany wydawany jest jako pierwszy. Zapobiega "starzeniu się" zapasów.',
 1, 'easy', true),

(m5, 'Jakie urządzenia są najczęściej używane przez pracowników magazynu współpracujących z WMS?',
 '["Komputery stacjonarne przy biurku","Skanery RF (radiowe), tablety lub zestawy głosowe Pick-by-Voice","Smartwatche","Drukarki 3D"]'::jsonb,
 1, 'Pracownicy korzystają ze skanerów radiowych (RF), terminali mobilnych i zestawów głosowych, które w czasie rzeczywistym komunikują się z WMS i wskazują zadania do wykonania.',
 1, 'easy', true),

(m5, 'Co to jest strategia ABC w zarządzaniu magazynem?',
 '["System nazewnictwa lokalizacji","Klasyfikacja towarów według rotacji: A (najwyższa), B (średnia), C (najniższa)","Rodzaj programu WMS","Metoda załadunku tirów"]'::jsonb,
 1, 'Analiza ABC dzieli towary według rotacji lub wartości: A – najczęściej rotujące (ok. 20% asortymentu, 80% wartości), B – średnie, C – najrzadziej pobierane.',
 2, 'medium', true),

(m5, 'Jaki wskaźnik mierzy odsetek zamówień skompletowanych bez błędów?',
 '["Wskaźnik rotacji zapasów","Dokładność kompletacji (order picking accuracy)","Poziom wykorzystania powierzchni","Czas przyjęcia dostawy"]'::jsonb,
 1, 'Dokładność kompletacji to stosunek liczby zamówień skompletowanych bezbłędnie do całkowitej liczby zamówień. Standard w nowoczesnych magazynach to >99,5%.',
 2, 'medium', true),

(m5, 'W jaki sposób WMS integruje się z systemem ERP przedsiębiorstwa?',
 '["Przez wymianę papierowych raportów","Przez interfejsy API lub EDI, wymieniając dane o zamówieniach, zapasach i dostawach w czasie rzeczywistym","WMS i ERP nie mogą być zintegrowane","Wyłącznie przez e-mail"]'::jsonb,
 1, 'Integracja WMS-ERP odbywa się przez API (REST, SOAP) lub komunikaty EDI. Zapewnia spójność danych o stanach magazynowych, zamówieniach i fakturach.',
 2, 'medium', true),

(m5, 'Co to jest FEFO i kiedy jest stosowane?',
 '["First Entry First Out – dla towarów biurowych","First Expired First Out – dla towarów z datą ważności (żywność, leki, kosmetyki)","Fast Efficient Freight Operation","Free Exchange For Others"]'::jsonb,
 1, 'FEFO (First Expired First Out) to strategia wydawania towarów według najwcześniejszej daty ważności. Jest obowiązkowa w branży spożywczej, farmaceutycznej i kosmetycznej.',
 2, 'medium', true),

(m5, 'Jaką rolę pełni inwentaryzacja cykliczna (cycle counting) w WMS?',
 '["Zastępuje całkowicie roczną inwentaryzację","Polega na systematycznym liczeniu wybranych lokalizacji przez cały rok, utrzymując dokładność stanów bez zamykania magazynu","Służy do zamawiania nowych towarów","Mierzy prędkość pracy magazynierów"]'::jsonb,
 1, 'Inwentaryzacja cykliczna pozwala na ciągłe weryfikowanie stanów magazynowych (rotacyjnie przez cały rok) bez potrzeby zamykania magazynu na pełną inwentaryzację.',
 3, 'hard', true),

(m5, 'Który z poniższych jest przykładem systemu wspomagania kompletacji?',
 '["CAD/CAM","Pick-by-Light – system świetlny wskazujący lokalizację i ilość do pobrania","CRM","BIM"]'::jsonb,
 1, 'Pick-by-Light to system, w którym wyświetlacze LED na regałach wskazują pracownikowi dokładną lokalizację i ilość towaru do pobrania, minimalizując błędy kompletacji.',
 2, 'medium', true),

(m5, 'Co to jest KPI magazynu "wskaźnik rotacji zapasów"?',
 '["Liczba pracowników zmienionych w ciągu roku","Stosunek wartości wydanego towaru do średniej wartości zapasów w danym okresie","Prędkość poruszania się wózków widłowych","Temperatura w magazynie"]'::jsonb,
 1, 'Wskaźnik rotacji zapasów = wartość wydanych towarów / średnia wartość zapasów. Wyższy wskaźnik oznacza szybszy obrót kapitałem i efektywniejsze zarządzanie zapasami.',
 3, 'hard', true);

-- ============================================================
-- MODUŁ 6: Programy transportowe – optymalizacja tras
-- ============================================================

INSERT INTO public.questions (module_id, question_text, options, correct_answer, explanation, difficulty, difficulty_text, is_active)
VALUES
(m6, 'Co to jest problem komiwojażera (TSP)?',
 '["Optymalizacja kosztów celnych","Znalezienie najkrótszej trasy przebiegającej przez wszystkie punkty dokładnie raz i powracającej do punktu startowego","Dobór najlepszego kierowcy do trasy","Obliczanie czasu załadunku"]'::jsonb,
 1, 'TSP (Travelling Salesman Problem) to klasyczny problem optymalizacyjny polegający na znalezieniu najkrótszej trasy łączącej zbiór punktów, odwiedzając każdy dokładnie raz.',
 2, 'medium', true),

(m6, 'Co oznacza skrót VRP w logistyce?',
 '["Vehicle Registration Protocol","Vehicle Routing Problem – problem wyznaczania tras pojazdów z ograniczeniami","Very Rapid Processing","Vendor Relations Platform"]'::jsonb,
 1, 'VRP to rozszerzenie TSP uwzględniające flotę pojazdów, ograniczenia pojemności, okna czasowe dostaw i inne ograniczenia operacyjne w planowaniu tras.',
 2, 'medium', true),

(m6, 'Jakie informacje dostarcza telematyka floty?',
 '["Wyłącznie lokalizację GPS pojazdu","Lokalizację GPS, prędkość, styl jazdy, zużycie paliwa, czas pracy kierowcy i dane diagnostyczne pojazdu","Cenę paliwa na stacjach","Rozkład jazdy autobusów"]'::jsonb,
 1, 'Systemy telematyczne integrują GPS z danymi z pojazdu, dostarczając informacji o lokalizacji, prędkości, stylu jazdy, zużyciu paliwa i stanie technicznym.',
 1, 'easy', true),

(m6, 'Jaka jest maksymalna dzienna norma czasu jazdy kierowcy wg rozporządzenia UE 561/2006?',
 '["9 godzin (z możliwością wydłużenia do 10 godzin 2x w tygodniu)","10 godzin bez ograniczeń","6 godzin z obowiązkową przerwą","12 godzin nieprzerwanie"]'::jsonb,
 0, 'Zgodnie z rozporządzeniem 561/2006 dzienny czas jazdy wynosi max. 9 h (z możliwością wydłużenia do 10 h max. 2 razy w tygodniu). Po 4,5 h jazdy obowiązkowa przerwa 45 min.',
 2, 'medium', true),

(m6, 'Co to jest okno czasowe (time window) w planowaniu tras?',
 '["Czas otwarcia okna aplikacji TMS","Przedział czasu, w którym musi nastąpić dostawa lub odbiór u danego klienta","Czas postoju na granicy","Okres konserwacji pojazdu"]'::jsonb,
 1, 'Okno czasowe to określony przez klienta przedział godzinowy, w którym pojazd musi dotrzeć do punktu dostawy. Planowanie tras z oknami czasowymi (VRPTW) jest złożone obliczeniowo.',
 2, 'medium', true),

(m6, 'Co mierzy wskaźnik pustych przebiegów (empty mileage)?',
 '["Odległość od magazynu do centrum miasta","Odsetek przejechanych kilometrów bez ładunku w stosunku do całkowitego przebiegu","Czas postoju pojazdu na parkingu","Zużycie paliwa pojazdu bez ładunku"]'::jsonb,
 1, 'Wskaźnik pustych przebiegów = km bez ładunku / km ogółem × 100%. Minimalizacja przez giełdy frachtowe i planowanie powrotne (backloading) obniża koszty i emisję CO₂.',
 2, 'medium', true),

(m6, 'Czym jest system dynamicznej nawigacji w transporcie drogowym?',
 '["System nakazujący kierowcy wybraną trasę bez możliwości zmiany","System aktualizujący trasę w czasie rzeczywistym na podstawie korków, wypadków i zamknięć dróg","Autopilot dla pojazdów ciężarowych","Program do nauki przepisów drogowych"]'::jsonb,
 1, 'Dynamiczna nawigacja pobiera dane o sytuacji drogowej w czasie rzeczywistym i przelicza optymalną trasę, gdy warunki na drodze się zmienią.',
 2, 'medium', true),

(m6, 'Jaki jest główny cel tachografu cyfrowego w pojeździe ciężarowym?',
 '["Nawigacja GPS","Rejestracja i kontrola czasu jazdy i odpoczynku kierowcy zgodnie z przepisami UE","Monitorowanie temperatury ładunku","Sterowanie skrzynią biegów"]'::jsonb,
 1, 'Tachograf cyfrowy rejestruje automatycznie czas jazdy, odpoczynku i pracy kierowcy. Dane przechowywane są na karcie kierowcy i w urządzeniu – kontrola przez ITD.',
 1, 'easy', true),

(m6, 'Które narzędzie najlepiej sprawdza się do planowania tras wielopojazdowych z oknami czasowymi?',
 '["Zwykła mapa papierowa","Arkusz kalkulacyjny Excel","System routingu VRP (np. OptimoRoute, Routific, PTV Route Optimiser)","System GPS w jednym pojeździe"]'::jsonb,
 2, 'Systemy routingu oparte na algorytmach VRP automatycznie wyznaczają optymalne trasy dla floty pojazdów uwzględniając wszystkie ograniczenia.',
 2, 'medium', true),

(m6, 'Jaki system wymiany ładunków pomaga w redukcji pustych przebiegów?',
 '["System ERP","Giełda transportowa (np. TimoCom, Transplace)","System WMS","Portal e-commerce"]'::jsonb,
 1, 'Giełdy transportowe łączą zleceniodawców z dostępnymi pojazdami, umożliwiając przewoźnikom znalezienie ładunku na trasę powrotną (backload) i eliminację pustych przebiegów.',
 2, 'medium', true);

-- ============================================================
-- MODUŁ 7: Akty prawne – spedycja KRAJOWA
-- ============================================================

INSERT INTO public.questions (module_id, question_text, options, correct_answer, explanation, difficulty, difficulty_text, is_active)
VALUES
(m7, 'Jaki akt prawny reguluje transport drogowy towarów w Polsce?',
 '["Kodeks cywilny","Ustawa – Prawo przewozowe z dnia 15 listopada 1984 r.","Ustawa o rachunkowości","Kodeks pracy"]'::jsonb,
 1, 'Ustawa – Prawo przewozowe z 15 listopada 1984 r. jest podstawowym aktem regulującym zarobkowy przewóz osób i rzeczy w Polsce.',
 1, 'easy', true),

(m7, 'Na podstawie jakich przepisów Kodeksu cywilnego działa spedytor krajowy?',
 '["Art. 627–646 k.c. (umowa o dzieło)","Art. 794–804 k.c. (umowa spedycji)","Art. 734–750 k.c. (zlecenie)","Art. 535–555 k.c. (sprzedaż)"]'::jsonb,
 1, 'Umowa spedycji w prawie polskim regulowana jest przez art. 794–804 Kodeksu cywilnego. Spedytor zobowiązuje się do wysyłania lub odbioru przesyłki i dokonania innych usług związanych z przewozem.',
 2, 'medium', true),

(m7, 'Jaki dokument jest odpowiednikiem listu CMR w krajowym transporcie drogowym?',
 '["Faktura VAT","List przewozowy (krajowy) lub dokument własny","Zlecenie transportowe","Konosament"]'::jsonb,
 1, 'W transporcie krajowym stosuje się krajowy list przewozowy lub dokument własny. Musi zawierać dane nadawcy, odbiorcy, opis przesyłki i trasę przewozu.',
 2, 'medium', true),

(m7, 'Jaki dokument potwierdzający wydanie towaru z magazynu jest wymagany w krajowym obrocie?',
 '["CMR","WZ – dokument wydania zewnętrznego","Karta TIR","Karnet ATA"]'::jsonb,
 1, 'WZ (Wydanie Zewnętrzne) to wewnętrzny dokument magazynowy potwierdzający wydanie towaru na zewnątrz firmy. Jest dowodem rozchodu magazynowego i podstawą do wystawienia faktury.',
 1, 'easy', true),

(m7, 'Jakie zezwolenie jest wymagane do zarobkowego przewozu rzeczy w transporcie krajowym?',
 '["Prawo jazdy kat. B","Licencja na krajowy transport drogowy rzeczy lub odpowiednie zezwolenie","Koncesja na handel","Zezwolenie celne"]'::jsonb,
 1, 'Zgodnie z Ustawą o transporcie drogowym przedsiębiorca wykonujący zarobkowy przewóz rzeczy musi posiadać odpowiednią licencję wydawaną przez GITD.',
 2, 'medium', true),

(m7, 'Który organ w Polsce kontroluje przestrzeganie przepisów transportu drogowego?',
 '["Urząd Skarbowy","Inspekcja Transportu Drogowego (ITD)","Policja Drogowa wyłącznie","Sanepid"]'::jsonb,
 1, 'Inspekcja Transportu Drogowego (ITD) sprawdza przestrzeganie przepisów transportu drogowego, w tym czasu pracy kierowców, stanu technicznego pojazdów i dokumentów.',
 1, 'easy', true),

(m7, 'Jak przewoźnik krajowy może zwolnić się z odpowiedzialności za opóźnienie dostawy?',
 '["Nie można się zwolnić z tej odpowiedzialności","Udowadniając, że opóźnienie wynikło z przyczyn od niego niezależnych (siła wyższa, wina nadawcy)","Przez wykupienie polisy ubezpieczeniowej","Przez wpisanie zastrzeżenia na liście przewozowym"]'::jsonb,
 1, 'Prawo przewozowe przewiduje możliwość zwolnienia się z odpowiedzialności za opóźnienie, jeśli przewoźnik udowodni, że wynikło ono z przyczyn od niego niezależnych.',
 3, 'hard', true),

(m7, 'Jaki akt reguluje czas pracy kierowców w krajowym transporcie drogowym?',
 '["Wyłącznie Kodeks pracy","Ustawa z dnia 16 kwietnia 2004 r. o czasie pracy kierowców oraz rozporządzenie UE 561/2006","Ustawa o ubezpieczeniach społecznych","Przepisy ADR"]'::jsonb,
 1, 'Czas pracy kierowców reguluje Ustawa z 16 kwietnia 2004 r. o czasie pracy kierowców, uzupełniona rozporządzeniem (WE) 561/2006 dotyczącym norm czasu jazdy i odpoczynku.',
 2, 'medium', true),

(m7, 'Co to jest konosament w prawie polskim?',
 '["Dokument stosowany wyłącznie w bankowości","Papier wartościowy inkorporujący prawo do dysponowania towarem, stosowany głównie w transporcie morskim","Polskie określenie listu CMR","Umowa o pracę kierowcy"]'::jsonb,
 1, 'Konosament to papier wartościowy wydawany przez przewoźnika morskiego, inkorporujący prawo własności do przewożonego towaru. W Polsce regulowany jest przez Kodeks morski.',
 3, 'hard', true),

(m7, 'Jaka jest zasada odpowiedzialności przewoźnika za utratę przesyłki w transporcie krajowym?',
 '["Pełna wartość rynkowa towaru zawsze","Odpowiedzialność jest limitowana – do zwykłej wartości przesyłki lub wartości deklarowanej","Brak odpowiedzialności przewoźnika","Wyłącznie koszt transportu"]'::jsonb,
 1, 'Prawo przewozowe limituje odpowiedzialność przewoźnika za utratę przesyłki do jej zwykłej wartości. Można ubezpieczyć przesyłkę na wyższą wartość deklarując ją i opłacając dodatkowo.',
 3, 'hard', true);

-- ============================================================
-- MODUŁ 8: Technologie identyfikacyjne – RFID, kody kreskowe
-- ============================================================

INSERT INTO public.questions (module_id, question_text, options, correct_answer, explanation, difficulty, difficulty_text, is_active)
VALUES
(m8, 'Co to jest RFID?',
 '["Radio Frequency Identification – identyfikacja za pomocą fal radiowych bez kontaktu wzrokowego","Real-time Freight Inventory Dashboard","Remote Fleet Integration Device","Rapid Freight Invoice Delivery"]'::jsonb,
 0, 'RFID (Radio Frequency Identification) to technologia bezstykowej automatycznej identyfikacji obiektów za pomocą tagów (transponderów) i czytników komunikujących się przez fale radiowe.',
 1, 'easy', true),

(m8, 'Na jakiej częstotliwości pracują tagi RFID UHF stosowane w logistyce magazynowej?',
 '["13,56 MHz (HF)","125 kHz (LF)","860–960 MHz (UHF)","2,4 GHz (microwave)"]'::jsonb,
 2, 'Tagi UHF (860–960 MHz) są najczęściej stosowane w logistyce ze względu na zasięg odczytu do kilku metrów i możliwość jednoczesnego odczytu wielu tagów.',
 2, 'medium', true),

(m8, 'Jaka jest główna zaleta RFID nad kodem kreskowym w magazynowaniu?',
 '["RFID jest tańszy w produkcji","RFID umożliwia odczyt bez linii wzroku i odczyt wielu tagów jednocześnie","Kody kreskowe działają tylko w temperaturze pokojowej","RFID nie wymaga żadnego sprzętu"]'::jsonb,
 1, 'RFID nie wymaga bezpośredniej widoczności między tagiem a czytnikiem i pozwala na jednoczesny odczyt setek tagów, co przyspiesza inwentaryzację i odbiory towarów.',
 2, 'medium', true),

(m8, 'Co to jest SSCC (Serial Shipping Container Code)?',
 '["Skrót nazwy firmy przewozowej","18-cyfrowy globalny numer identyfikujący jednostkę logistyczną (paletę, pojemnik) wg standardu GS1","Kod pocztowy magazynu","System sortowania paczek"]'::jsonb,
 1, 'SSCC to unikalny 18-cyfrowy numer GS1 przypisywany do każdej jednostki logistycznej (palety, pojemnika). Umożliwia śledzenie przesyłki przez cały łańcuch dostaw.',
 2, 'medium', true),

(m8, 'Jakie dane zawiera etykieta logistyczna GS1-128?',
 '["Tylko cenę towaru","SSCC jednostki logistycznej, GTIN towaru, numer partii, datę ważności i masę","Dane osobowe kierowcy","Logo firmy i adres strony www"]'::jsonb,
 1, 'Etykieta logistyczna GS1-128 zawiera dane zakodowane z identyfikatorami zastosowania (AI): SSCC (AI 00), GTIN (AI 01), datę (AI 11/15/17), numer partii (AI 10), masę (AI 310x).',
 3, 'hard', true),

(m8, 'Co to jest GTIN?',
 '["Global Transport Insurance Number","Global Trade Item Number – globalny numer artykułu handlowego wg GS1","Germany Tracking Identification Number","Generic Terminal Interface Node"]'::jsonb,
 1, 'GTIN (Global Trade Item Number) to unikalny numer identyfikujący produkt w systemie GS1. Widoczny jako kod EAN-13 lub EAN-8 na opakowaniach konsumenckich.',
 2, 'medium', true),

(m8, 'Czym różni się tag RFID pasywny od aktywnego?',
 '["Tag pasywny ma większy zasięg","Tag pasywny nie ma własnego zasilania – czerpie energię z pola czytnika; aktywny ma własną baterię i większy zasięg","Tag aktywny jest tańszy","Nie ma różnicy między nimi"]'::jsonb,
 1, 'Tagi pasywne są tańsze i mniejsze, ale mają ograniczony zasięg (cm–kilka metrów). Tagi aktywne mają zasięg do 100 m, lecz są droższe i wymagają wymiany baterii.',
 2, 'medium', true),

(m8, 'Jaka jest różnica między kodem 1D a 2D?',
 '["Kod 1D to kod kolorowy, 2D to czarno-biały","Kod 1D (np. EAN-13) koduje dane w jednym wymiarze (szerokość kresek), kod 2D (QR, Data Matrix) w dwóch wymiarach – znacznie większa pojemność","Kody 2D są tylko dla lotnictwa","Kody 1D nie są stosowane w logistyce"]'::jsonb,
 1, 'Kody 1D kodują dane przez zmienną szerokość kresek (EAN-13: 13 cyfr). Kody 2D kodują dane w obu wymiarach (QR Code: do 7089 cyfr, Data Matrix: do 3116 cyfr).',
 1, 'easy', true),

(m8, 'Co to jest NFC i do czego służy w logistyce?',
 '["Near Field Communication – komunikacja na bliski dystans (do ~10 cm), stosowana w śledzeniu i weryfikacji autentyczności","Non-Freight Container – typ kontenera","Network Flow Control – protokół sieciowy","Negative Freight Calculation"]'::jsonb,
 0, 'NFC (Near Field Communication) działa na 13,56 MHz na dystansie ~10 cm. W logistyce stosowana do weryfikacji autentyczności produktów i śledzenia ekspresowych przesyłek.',
 2, 'medium', true),

(m8, 'Jaka jest rola standardów GS1 w globalnej logistyce?',
 '["GS1 jest firmą ubezpieczeniową dla transportu","GS1 opracowuje globalne standardy identyfikacji (kody, numery) i wymiany danych, zapewniając jednolity język w łańcuchach dostaw na całym świecie","GS1 zarządza giełdami towarowymi","GS1 to system celny ONZ"]'::jsonb,
 1, 'GS1 to globalna organizacja definiująca standardy: kody kreskowe (EAN, Code 128), numery identyfikacyjne (GTIN, GLN, SSCC) i standardy wymiany danych (EANCOM, GS1 XML).',
 2, 'medium', true);

END;
$$;

-- ============================================================
-- WERYFIKACJA
-- ============================================================
SELECT
  m.title,
  m.order_index,
  COUNT(q.id) AS pytania
FROM public.modules m
LEFT JOIN public.questions q ON q.module_id = m.id AND q.is_active = true
WHERE m.status = 'published'
GROUP BY m.id, m.title, m.order_index
ORDER BY m.order_index;
