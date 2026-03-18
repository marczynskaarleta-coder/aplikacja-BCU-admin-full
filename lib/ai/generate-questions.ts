import Anthropic from '@anthropic-ai/sdk'

export interface GeneratedQuestion {
  question_text: string
  options: [string, string, string, string]
  correct_answer: number   // 0–3
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const SYSTEM_PROMPT = `Jesteś ekspertem od spedycji i transportu drogowego.
Twoje zadanie to tworzenie pytań testowych (w stylu egzaminu na prawo jazdy) na podstawie dostarczonych materiałów edukacyjnych z dziedziny spedycji.

ZASADY:
- Pytania muszą być jasne i jednoznaczne
- Każde pytanie ma dokładnie 4 odpowiedzi (A, B, C, D)
- Tylko jedna odpowiedź jest poprawna
- Odpowiedzi nie mogą być zbyt oczywiste — unikaj pułapek, ale też zbyt łatwych pytań
- Pytania muszą wynikać TYLKO z dostarczonego tekstu — nie wymyślaj faktów
- Wyjaśnienie musi wskazywać dlaczego dana odpowiedź jest poprawna
- Język: polski

FORMATO ODPOWIEDZI — zwróć WYŁĄCZNIE tablicę JSON, bez żadnego dodatkowego tekstu:
[
  {
    "question_text": "treść pytania",
    "options": ["opcja A", "opcja B", "opcja C", "opcja D"],
    "correct_answer": 0,
    "explanation": "wyjaśnienie",
    "difficulty": "easy"
  }
]

difficulty: "easy" | "medium" | "hard"`

export async function generateQuestionsFromText(
  text: string,
  count: number = 5,
  difficulty: 'mixed' | 'easy' | 'medium' | 'hard' = 'mixed'
): Promise<GeneratedQuestion[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Brak klucza ANTHROPIC_API_KEY w .env.local')

  const client = new Anthropic({ apiKey })

  const difficultyInstruction = difficulty === 'mixed'
    ? `Wygeneruj pytania różnego poziomu: część łatwych (easy), część średnich (medium), część trudnych (hard).`
    : `Wszystkie pytania mają być poziom: ${difficulty === 'easy' ? 'łatwy' : difficulty === 'medium' ? 'średni' : 'trudny'}.`

  const userPrompt = `Na podstawie poniższego tekstu wygeneruj dokładnie ${count} pytań testowych.
${difficultyInstruction}

TEKST:
---
${text.slice(0, 12000)}
---

Zwróć WYŁĄCZNIE tablicę JSON z ${count} pytaniami.`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Nieoczekiwany format odpowiedzi AI')

  // Extract JSON array from response
  const text_response = content.text.trim()
  const jsonMatch = text_response.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('AI nie zwróciło poprawnego JSON. Spróbuj ponownie.')

  let questions: GeneratedQuestion[]
  try {
    questions = JSON.parse(jsonMatch[0])
  } catch {
    throw new Error('Błąd parsowania odpowiedzi AI. Spróbuj ponownie.')
  }

  // Validate structure
  if (!Array.isArray(questions)) throw new Error('Odpowiedź AI nie jest tablicą pytań')

  return questions.map((q, i) => {
    if (!q.question_text || !Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Pytanie ${i + 1} ma niepoprawny format`)
    }
    const ca = typeof q.correct_answer === 'number' ? q.correct_answer : 0
    return {
      question_text: String(q.question_text),
      options:       q.options.map(String) as [string, string, string, string],
      correct_answer: Math.max(0, Math.min(3, ca)),
      explanation:   String(q.explanation ?? ''),
      difficulty:    ['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'medium',
    }
  })
}
