import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  role: string
  status: string
  created_at: string
  updated_at: string
}

export interface AuthUser {
  user: User
  profile: Profile | null
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL

/**
 * Sprawdza czy użytkownik jest adminem.
 * Najpierw sprawdza rolę w bazie (docelowe rozwiązanie),
 * potem fallback na ADMIN_EMAIL z .env (bootstrap).
 */
export function isAdmin(user: User | null, profile: Profile | null): boolean {
  if (!user) return false
  if (profile?.role === 'admin') return true
  if (ADMIN_EMAIL && user.email === ADMIN_EMAIL) return true
  return false
}

/**
 * Pobiera aktualnego użytkownika i jego profil.
 * Zwraca null jeśli niezalogowany.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}

/**
 * Wymaga zalogowania. Przekierowuje na /auth/login jeśli brak sesji.
 */
export async function requireAuth(): Promise<AuthUser> {
  const auth = await getCurrentUser()
  if (!auth) redirect('/auth/login')
  return auth
}

/**
 * Wymaga roli admina. Przekierowuje na /auth/login lub /dashboard jeśli brak uprawnień.
 */
export async function requireAdmin(): Promise<AuthUser> {
  const auth = await getCurrentUser()
  if (!auth) redirect('/auth/login')
  if (!isAdmin(auth.user, auth.profile)) redirect('/dashboard')
  return auth
}
