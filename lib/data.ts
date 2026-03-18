// Mock data for the educational platform

export interface Module {
  id: string
  title: string
  description: string
  icon: string
  totalQuestions: number
  completedQuestions: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  content: LessonContent[]
  keyPoints: string[]
  completed: boolean
}

export interface LessonContent {
  type: 'heading' | 'paragraph' | 'list' | 'note'
  content: string | string[]
}

export interface Question {
  id: string
  moduleId: string
  lessonId: string
  question: string
  answers: string[]
  correctAnswer: number
  difficulty: 'easy' | 'medium' | 'hard'
  explanation?: string
}

export interface UserProgress {
  totalQuestions: number
  completedQuestions: number
  reviewQuestions: number
  correctPercentage: number
  strongAreas: string[]
  weakAreas: string[]
  recentModules: { moduleId: string; lastAccessed: Date }[]
}

export interface UserAnswer {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
  attemptDate: Date
  needsReview: boolean
}

export const modules: Module[] = [
  {
    id: 'documents',
    title: 'Dokumenty transportowe',
    description: 'Rodzaje i zastosowanie dokumentów w transporcie międzynarodowym',
    icon: 'FileText',
    totalQuestions: 25,
    completedQuestions: 18,
    lessons: [
      {
        id: 'doc-1',
        moduleId: 'documents',
        title: 'List przewozowy CMR',
        content: [
          { type: 'heading', content: 'Czym jest list przewozowy CMR?' },
          { type: 'paragraph', content: 'List przewozowy CMR (Convention relative au contrat de transport international de Marchandises par Route) jest podstawowym dokumentem w międzynarodowym transporcie drogowym. Stanowi dowód zawarcia umowy przewozu i określa warunki realizacji transportu.' },
          { type: 'heading', content: 'Elementy listu CMR' },
          { type: 'list', content: ['Dane nadawcy i odbiorcy', 'Miejsce i data załadunku', 'Opis towaru i jego waga', 'Instrukcje celne', 'Podpisy stron'] },
          { type: 'note', content: 'List CMR wystawiany jest w 3 egzemplarzach: dla nadawcy, przewoźnika i odbiorcy.' }
        ],
        keyPoints: [
          'CMR to międzynarodowy list przewozowy dla transportu drogowego',
          'Wystawiany w 3 egzemplarzach',
          'Potwierdza zawarcie umowy przewozu',
          'Zawiera szczegółowe dane o ładunku i trasie'
        ],
        completed: true
      },
      {
        id: 'doc-2',
        moduleId: 'documents',
        title: 'Dokumenty celne',
        content: [
          { type: 'heading', content: 'Wprowadzenie do dokumentów celnych' },
          { type: 'paragraph', content: 'Dokumenty celne są niezbędne przy przewozach międzynarodowych przekraczających granice Unii Europejskiej. Prawidłowe przygotowanie dokumentacji celnej zapewnia sprawny przebieg odprawy i uniknięcie opóźnień.' },
          { type: 'heading', content: 'Najważniejsze dokumenty celne' },
          { type: 'list', content: ['SAD (Jednolity Dokument Administracyjny)', 'Faktura handlowa', 'Lista pakowa', 'Świadectwo pochodzenia', 'Karnet TIR'] }
        ],
        keyPoints: [
          'SAD jest podstawowym dokumentem odprawy celnej',
          'Faktura handlowa określa wartość celną towaru',
          'Karnet TIR ułatwia tranzyt przez wiele krajów'
        ],
        completed: true
      }
    ]
  },
  {
    id: 'incoterms',
    title: 'Incoterms 2020',
    description: 'Międzynarodowe reguły handlu i podział odpowiedzialności',
    icon: 'Globe',
    totalQuestions: 20,
    completedQuestions: 12,
    lessons: [
      {
        id: 'inc-1',
        moduleId: 'incoterms',
        title: 'Wprowadzenie do Incoterms',
        content: [
          { type: 'heading', content: 'Czym są Incoterms?' },
          { type: 'paragraph', content: 'Incoterms (International Commercial Terms) to zbiór międzynarodowych reguł handlowych publikowanych przez Międzynarodową Izbę Handlową (ICC). Określają one podział kosztów i ryzyka między sprzedającym a kupującym.' },
          { type: 'heading', content: 'Grupy Incoterms 2020' },
          { type: 'list', content: ['Grupa E - EXW (Ex Works)', 'Grupa F - FCA, FAS, FOB', 'Grupa C - CFR, CIF, CPT, CIP', 'Grupa D - DAP, DPU, DDP'] }
        ],
        keyPoints: [
          'Incoterms określają podział kosztów i ryzyka',
          '11 reguł w wersji Incoterms 2020',
          'Każda reguła ma określone obowiązki stron'
        ],
        completed: true
      }
    ]
  },
  {
    id: 'transport-law',
    title: 'Prawo transportowe',
    description: 'Przepisy krajowe i międzynarodowe regulujące transport',
    icon: 'Scale',
    totalQuestions: 30,
    completedQuestions: 8,
    lessons: [
      {
        id: 'law-1',
        moduleId: 'transport-law',
        title: 'Konwencja CMR',
        content: [
          { type: 'heading', content: 'Podstawy Konwencji CMR' },
          { type: 'paragraph', content: 'Konwencja CMR reguluje międzynarodowy zarobkowy przewóz drogowy towarów. Określa odpowiedzialność przewoźnika, zasady reklamacji oraz limity odszkodowań.' }
        ],
        keyPoints: [
          'Konwencja CMR obowiązuje w transporcie międzynarodowym',
          'Określa odpowiedzialność przewoźnika za towar',
          'Limit odszkodowania: 8,33 SDR za kg wagi brutto'
        ],
        completed: false
      }
    ]
  },
  {
    id: 'transport-org',
    title: 'Organizacja przewozu',
    description: 'Planowanie tras, optymalizacja i zarządzanie flotą',
    icon: 'Truck',
    totalQuestions: 22,
    completedQuestions: 5,
    lessons: []
  },
  {
    id: 'costs',
    title: 'Koszty i kalkulacja',
    description: 'Kalkulacja stawek przewozowych i analiza kosztów',
    icon: 'Calculator',
    totalQuestions: 18,
    completedQuestions: 0,
    lessons: []
  },
  {
    id: 'safety',
    title: 'Bezpieczeństwo i compliance',
    description: 'Przepisy BHP, ADR i zgodność z regulacjami',
    icon: 'Shield',
    totalQuestions: 20,
    completedQuestions: 0,
    lessons: []
  }
]

export const questions: Question[] = [
  // Documents module questions
  {
    id: 'q1',
    moduleId: 'documents',
    lessonId: 'doc-1',
    question: 'Ile egzemplarzy listu przewozowego CMR wystawia się standardowo?',
    answers: ['2 egzemplarze', '3 egzemplarze', '4 egzemplarze', '5 egzemplarzy'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'List CMR wystawiany jest w 3 egzemplarzach: jeden dla nadawcy, jeden dla przewoźnika i jeden dla odbiorcy.'
  },
  {
    id: 'q2',
    moduleId: 'documents',
    lessonId: 'doc-1',
    question: 'Która konwencja reguluje międzynarodowy transport drogowy towarów?',
    answers: ['Konwencja CIM', 'Konwencja CMR', 'Konwencja COTIF', 'Konwencja ATP'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Konwencja CMR (Convention relative au contrat de transport international de Marchandises par Route) reguluje międzynarodowy drogowy transport towarów.'
  },
  {
    id: 'q3',
    moduleId: 'documents',
    lessonId: 'doc-2',
    question: 'Który dokument jest podstawowym dokumentem odprawy celnej?',
    answers: ['Faktura proforma', 'SAD', 'CMR', 'Packing list'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'SAD (Jednolity Dokument Administracyjny) jest podstawowym dokumentem wykorzystywanym podczas odprawy celnej.'
  },
  {
    id: 'q4',
    moduleId: 'documents',
    lessonId: 'doc-2',
    question: 'Co oznacza skrót TIR?',
    answers: ['Transport International Routier', 'Trade International Registry', 'Transport Insurance Regulation', 'Transit Import Rules'],
    correctAnswer: 0,
    difficulty: 'medium',
    explanation: 'TIR oznacza Transport International Routier - międzynarodowy system tranzytu celnego.'
  },
  // Incoterms questions
  {
    id: 'q5',
    moduleId: 'incoterms',
    lessonId: 'inc-1',
    question: 'Ile reguł zawiera Incoterms 2020?',
    answers: ['9 reguł', '10 reguł', '11 reguł', '13 reguł'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'Incoterms 2020 zawiera 11 międzynarodowych reguł handlowych.'
  },
  {
    id: 'q6',
    moduleId: 'incoterms',
    lessonId: 'inc-1',
    question: 'Która reguła Incoterms oznacza, że sprzedający ponosi wszystkie koszty i ryzyka do miejsca przeznaczenia?',
    answers: ['EXW', 'FCA', 'DDP', 'FOB'],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: 'DDP (Delivered Duty Paid) oznacza, że sprzedający ponosi wszystkie koszty i ryzyka do miejsca przeznaczenia, włącznie z odprawą celną importową.'
  },
  {
    id: 'q7',
    moduleId: 'incoterms',
    lessonId: 'inc-1',
    question: 'Która reguła Incoterms nakłada minimalne obowiązki na sprzedającego?',
    answers: ['DDP', 'CIF', 'EXW', 'DAP'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'EXW (Ex Works) nakłada minimalne obowiązki na sprzedającego - towar jest udostępniany w zakładzie sprzedającego.'
  },
  // Transport law questions
  {
    id: 'q8',
    moduleId: 'transport-law',
    lessonId: 'law-1',
    question: 'Jaki jest limit odszkodowania według Konwencji CMR za utratę towaru?',
    answers: ['10 SDR/kg', '8,33 SDR/kg', '17 SDR/kg', '5 SDR/kg'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Zgodnie z Konwencją CMR, limit odszkodowania wynosi 8,33 SDR (Specjalnych Praw Ciągnienia) za kilogram wagi brutto utraconego lub uszkodzonego towaru.'
  },
  {
    id: 'q9',
    moduleId: 'transport-law',
    lessonId: 'law-1',
    question: 'W jakim terminie należy zgłosić widoczne uszkodzenie towaru według CMR?',
    answers: ['Natychmiast przy odbiorze', 'W ciągu 7 dni', 'W ciągu 14 dni', 'W ciągu 30 dni'],
    correctAnswer: 0,
    difficulty: 'medium',
    explanation: 'Widoczne uszkodzenia należy zgłosić natychmiast przy odbiorze towaru. Uszkodzenia niewidoczne można zgłosić w ciągu 7 dni.'
  },
  {
    id: 'q10',
    moduleId: 'transport-law',
    lessonId: 'law-1',
    question: 'Jaki jest termin przedawnienia roszczeń według Konwencji CMR?',
    answers: ['6 miesięcy', '1 rok', '2 lata', '3 lata'],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Termin przedawnienia roszczeń z tytułu umowy przewozu według Konwencji CMR wynosi 1 rok, a w przypadku umyślnego działania - 3 lata.'
  }
]

export const userProgress: UserProgress = {
  totalQuestions: 135,
  completedQuestions: 43,
  reviewQuestions: 12,
  correctPercentage: 78,
  strongAreas: ['Dokumenty transportowe', 'Incoterms 2020'],
  weakAreas: ['Prawo transportowe', 'Koszty i kalkulacja'],
  recentModules: [
    { moduleId: 'documents', lastAccessed: new Date('2024-01-15') },
    { moduleId: 'incoterms', lastAccessed: new Date('2024-01-14') },
    { moduleId: 'transport-law', lastAccessed: new Date('2024-01-12') }
  ]
}

export const userAnswers: UserAnswer[] = [
  { questionId: 'q1', selectedAnswer: 1, isCorrect: true, attemptDate: new Date('2024-01-15'), needsReview: false },
  { questionId: 'q2', selectedAnswer: 1, isCorrect: true, attemptDate: new Date('2024-01-15'), needsReview: false },
  { questionId: 'q3', selectedAnswer: 0, isCorrect: false, attemptDate: new Date('2024-01-14'), needsReview: true },
  { questionId: 'q4', selectedAnswer: 0, isCorrect: true, attemptDate: new Date('2024-01-14'), needsReview: false },
  { questionId: 'q5', selectedAnswer: 2, isCorrect: true, attemptDate: new Date('2024-01-13'), needsReview: false },
  { questionId: 'q8', selectedAnswer: 0, isCorrect: false, attemptDate: new Date('2024-01-12'), needsReview: true },
  { questionId: 'q9', selectedAnswer: 1, isCorrect: false, attemptDate: new Date('2024-01-12'), needsReview: true },
  { questionId: 'q10', selectedAnswer: 2, isCorrect: false, attemptDate: new Date('2024-01-11'), needsReview: true }
]

// Admin data for question management
export interface AdminQuestion extends Question {
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'draft' | 'archived'
}

export const adminQuestions: AdminQuestion[] = questions.map(q => ({
  ...q,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-10'),
  status: 'active' as const
}))

// User data for admin panel
export interface User {
  id: string
  name: string
  email: string
  progress: number
  questionsCompleted: number
  lastActive: Date
}

export const users: User[] = [
  { id: 'u1', name: 'Jan Kowalski', email: 'jan.kowalski@email.pl', progress: 78, questionsCompleted: 43, lastActive: new Date('2024-01-15') },
  { id: 'u2', name: 'Anna Nowak', email: 'anna.nowak@email.pl', progress: 45, questionsCompleted: 28, lastActive: new Date('2024-01-14') },
  { id: 'u3', name: 'Piotr Wiśniewski', email: 'piotr.w@email.pl', progress: 92, questionsCompleted: 67, lastActive: new Date('2024-01-15') },
  { id: 'u4', name: 'Maria Dąbrowska', email: 'maria.d@email.pl', progress: 15, questionsCompleted: 12, lastActive: new Date('2024-01-10') },
  { id: 'u5', name: 'Tomasz Lewandowski', email: 'tomasz.l@email.pl', progress: 60, questionsCompleted: 35, lastActive: new Date('2024-01-13') }
]
