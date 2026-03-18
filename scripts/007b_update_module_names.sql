-- ============================================================
-- Aktualizacja nazw modułów – zgodne z kursami BCU
-- Uruchom w: Supabase Dashboard → SQL Editor
-- ============================================================

UPDATE public.modules SET
  title = 'Dokumentacja przewoźnika i spedytora międzynarodowego',
  description = 'Akty prawne i dokumenty w transporcie międzynarodowym. Konwencja CMR, reguły Incoterms, procedury celne (TIR, NCTS) i przepisy ADR.'
WHERE order_index = 1 AND status = 'published';

UPDATE public.modules SET
  title = 'Gospodarka opakowaniowa i ślad węglowy',
  description = 'Rodzaje opakowań logistycznych, zarządzanie opakowaniami zwrotnymi i obliczanie śladu węglowego w łańcuchu dostaw.'
WHERE order_index = 2 AND status = 'published';

UPDATE public.modules SET
  title = 'Programy do optymalizacji załadunku',
  description = 'Obsługa programów do planowania załadunku pojazdów. Zasady rozmieszczenia ładunku, mocowanie wg EN 12195 i efektywność wykorzystania ładowności.'
WHERE order_index = 3 AND status = 'published';

UPDATE public.modules SET
  title = 'Programy do generowania dokumentacji transportowej',
  description = 'Obsługa systemów TMS, eCMR i EDI. Elektroniczny obieg dokumentów transportowych, dokumenty celne i cyfrowe potwierdzenie dostawy.'
WHERE order_index = 4 AND status = 'published';

UPDATE public.modules SET
  title = 'Oprogramowanie WMS',
  description = 'Zasady działania systemów zarządzania magazynem. Przyjęcie towaru, kompletacja, strategie FIFO/FEFO, KPI i integracja z ERP.'
WHERE order_index = 5 AND status = 'published';

UPDATE public.modules SET
  title = 'Programy do optymalizowania tras',
  description = 'Narzędzia do planowania i optymalizacji tras. Algorytmy VRP, telematyka floty, normy czasu pracy kierowcy i redukcja pustych przebiegów.'
WHERE order_index = 6 AND status = 'published';

UPDATE public.modules SET
  title = 'Dokumentacja przewoźnika i spedytora krajowego',
  description = 'Polskie przepisy w transporcie drogowym. Prawo przewozowe, Kodeks cywilny, dokumenty spedycyjne, licencje i organy kontrolne.'
WHERE order_index = 7 AND status = 'published';

UPDATE public.modules SET
  title = 'RFID, kody kreskowe i etykiety logistyczne',
  description = 'Technologie identyfikacyjne w magazynowaniu i transporcie. Kody 1D/2D, RFID, standardy GS1, SSCC i etykieta logistyczna GS1-128.'
WHERE order_index = 8 AND status = 'published';

-- Weryfikacja
SELECT order_index, title FROM public.modules
WHERE status = 'published'
ORDER BY order_index;
