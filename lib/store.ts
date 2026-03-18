'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserAnswer } from './data'

export type Screen = 
  | 'landing'
  | 'dashboard'
  | 'modules'
  | 'lesson'
  | 'quiz'
  | 'review'
  | 'results'
  | 'admin'

interface AppState {
  currentScreen: Screen
  isLoggedIn: boolean
  isAdmin: boolean
  currentModuleId: string | null
  currentLessonId: string | null
  currentQuestionIndex: number
  quizQuestions: string[]
  userAnswers: UserAnswer[]
  quizResults: { correct: number; total: number } | null
  
  // Actions
  setScreen: (screen: Screen) => void
  login: (asAdmin?: boolean) => void
  logout: () => void
  selectModule: (moduleId: string) => void
  selectLesson: (lessonId: string) => void
  startQuiz: (questionIds: string[]) => void
  answerQuestion: (answer: UserAnswer) => void
  nextQuestion: () => void
  finishQuiz: () => void
  resetQuiz: () => void
  goBack: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentScreen: 'landing',
      isLoggedIn: false,
      isAdmin: false,
      currentModuleId: null,
      currentLessonId: null,
      currentQuestionIndex: 0,
      quizQuestions: [],
      userAnswers: [],
      quizResults: null,

      setScreen: (screen) => set({ currentScreen: screen }),

      login: (asAdmin = false) => set({ 
        isLoggedIn: true, 
        isAdmin: asAdmin,
        currentScreen: asAdmin ? 'admin' : 'dashboard' 
      }),

      logout: () => set({ 
        isLoggedIn: false, 
        isAdmin: false,
        currentScreen: 'landing',
        currentModuleId: null,
        currentLessonId: null
      }),

      selectModule: (moduleId) => set({ 
        currentModuleId: moduleId,
        currentScreen: 'lesson'
      }),

      selectLesson: (lessonId) => set({
        currentLessonId: lessonId
      }),

      startQuiz: (questionIds) => set({
        quizQuestions: questionIds,
        currentQuestionIndex: 0,
        currentScreen: 'quiz',
        quizResults: null
      }),

      answerQuestion: (answer) => set((state) => ({
        userAnswers: [...state.userAnswers.filter(a => a.questionId !== answer.questionId), answer]
      })),

      nextQuestion: () => set((state) => {
        const nextIndex = state.currentQuestionIndex + 1
        if (nextIndex >= state.quizQuestions.length) {
          const quizAnswers = state.userAnswers.filter(a => 
            state.quizQuestions.includes(a.questionId)
          )
          const correct = quizAnswers.filter(a => a.isCorrect).length
          return {
            quizResults: { correct, total: state.quizQuestions.length },
            currentScreen: 'results'
          }
        }
        return { currentQuestionIndex: nextIndex }
      }),

      finishQuiz: () => {
        const state = get()
        const quizAnswers = state.userAnswers.filter(a => 
          state.quizQuestions.includes(a.questionId)
        )
        const correct = quizAnswers.filter(a => a.isCorrect).length
        set({
          quizResults: { correct, total: state.quizQuestions.length },
          currentScreen: 'results'
        })
      },

      resetQuiz: () => set({
        currentQuestionIndex: 0,
        quizQuestions: [],
        quizResults: null
      }),

      goBack: () => set((state) => {
        switch (state.currentScreen) {
          case 'lesson':
            return { currentScreen: 'modules', currentLessonId: null }
          case 'quiz':
            return { currentScreen: 'lesson', currentQuestionIndex: 0, quizQuestions: [] }
          case 'results':
            return { currentScreen: 'dashboard', quizResults: null }
          case 'review':
            return { currentScreen: 'dashboard' }
          case 'modules':
            return { currentScreen: 'dashboard' }
          case 'admin':
            return { currentScreen: 'dashboard', isAdmin: false }
          default:
            return { currentScreen: 'dashboard' }
        }
      })
    }),
    {
      name: 'bcu-app-storage',
      partialize: (state) => ({ 
        userAnswers: state.userAnswers,
        isLoggedIn: state.isLoggedIn,
        isAdmin: state.isAdmin
      })
    }
  )
)
