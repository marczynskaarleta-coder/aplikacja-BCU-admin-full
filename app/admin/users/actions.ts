'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { revalidatePath } from 'next/cache'

export async function changeUserRole(userId: string, role: string) {
  await requireAdmin()

  const validRoles = ['admin', 'user', 'editor', 'trainer']
  if (!validRoles.includes(role)) throw new Error('Nieprawidłowa rola')

  const supabase = await createClient()

  // Nie pozwól zdegradować ostatniego admina
  if (role !== 'admin') {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin')

    const { data: target } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (target?.role === 'admin' && (count ?? 0) <= 1) {
      throw new Error('Nie można zdegradować jedynego administratora')
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/users')
}

export async function changeUserStatus(userId: string, status: string) {
  await requireAdmin()

  const validStatuses = ['active', 'inactive', 'blocked']
  if (!validStatuses.includes(status)) throw new Error('Nieprawidłowy status')

  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/users')
}

export async function resetUserPassword(email: string) {
  await requireAdmin()

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback?next=/auth/reset-password`,
  })

  if (error) throw new Error(error.message)
}
