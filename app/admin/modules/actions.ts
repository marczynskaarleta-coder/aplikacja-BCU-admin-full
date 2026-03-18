'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ─── Module CRUD ──────────────────────────────────────────────────────────────

export async function createModule(formData: FormData) {
  const { user } = await requireAdmin()
  const supabase = await createClient()

  const title       = formData.get('title') as string
  const description = formData.get('description') as string
  const category    = formData.get('category') as string
  const difficulty  = formData.get('difficulty') as string
  const status      = formData.get('status') as string

  if (!title?.trim()) throw new Error('Tytuł jest wymagany')

  const { data, error } = await supabase
    .from('modules')
    .insert({
      title:       title.trim(),
      description: description?.trim() || null,
      category:    category?.trim()    || null,
      difficulty:  difficulty || 'beginner',
      status:      status === 'published' ? 'published' : 'draft',
      created_by:  user.id,
      order_index: 999,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/admin/modules')
  redirect(`/admin/modules/${data.id}/edit`)
}

export async function updateModule(moduleId: string, formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()

  const title             = formData.get('title') as string
  const description       = formData.get('description') as string
  const category          = formData.get('category') as string
  const difficulty        = formData.get('difficulty') as string
  const status            = formData.get('status') as string
  const educational_content = formData.get('educational_content') as string

  if (!title?.trim()) throw new Error('Tytuł jest wymagany')

  const { error } = await supabase
    .from('modules')
    .update({
      title:               title.trim(),
      description:         description?.trim() || null,
      category:            category?.trim()    || null,
      difficulty:          difficulty || 'beginner',
      status:              status === 'published' ? 'published' : 'draft',
      educational_content: educational_content?.trim() || null,
      updated_at:          new Date().toISOString(),
    })
    .eq('id', moduleId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/modules')
  revalidatePath(`/admin/modules/${moduleId}/edit`)
}

export async function deleteModule(moduleId: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('modules')
    .delete()
    .eq('id', moduleId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/modules')
  redirect('/admin/modules')
}

export async function toggleModuleStatus(moduleId: string, current: string) {
  await requireAdmin()
  const supabase = await createClient()

  const newStatus = current === 'published' ? 'draft' : 'published'

  const { error } = await supabase
    .from('modules')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', moduleId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/modules')
}

// ─── Module Links ─────────────────────────────────────────────────────────────

export async function addModuleLink(moduleId: string, formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()

  const title = formData.get('title') as string
  const url   = formData.get('url') as string
  const type  = formData.get('type') as string

  if (!title?.trim() || !url?.trim()) throw new Error('Tytuł i URL są wymagane')

  const { error } = await supabase
    .from('module_links')
    .insert({
      module_id: moduleId,
      title:     title.trim(),
      url:       url.trim(),
      type:      ['video', 'article', 'download', 'link'].includes(type) ? type : 'link',
    })

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/modules/${moduleId}/edit`)
}

export async function deleteModuleLink(linkId: string, moduleId: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('module_links')
    .delete()
    .eq('id', linkId)

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/modules/${moduleId}/edit`)
}

// ─── Module Files ─────────────────────────────────────────────────────────────

export async function addModuleFile(moduleId: string, formData: FormData) {
  const { user } = await requireAdmin()
  const supabase = await createClient()

  const file = formData.get('file') as File
  const name = formData.get('name') as string

  if (!file || file.size === 0) throw new Error('Plik jest wymagany')

  const ext      = file.name.split('.').pop()
  const filePath = `${moduleId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('module-files')
    .upload(filePath, file)

  if (uploadError) throw new Error(uploadError.message)

  const { data: { publicUrl } } = supabase.storage
    .from('module-files')
    .getPublicUrl(filePath)

  const { error: dbError } = await supabase
    .from('module_files')
    .insert({
      module_id:  moduleId,
      name:       (name?.trim() || file.name),
      file_url:   publicUrl,
      file_type:  file.type,
      file_size:  file.size,
      created_by: user.id,
    })

  if (dbError) throw new Error(dbError.message)
  revalidatePath(`/admin/modules/${moduleId}/edit`)
}

export async function deleteModuleFile(fileId: string, fileUrl: string, moduleId: string) {
  await requireAdmin()
  const supabase = await createClient()

  // Extract path from URL to delete from storage
  const url = new URL(fileUrl)
  const pathParts = url.pathname.split('/module-files/')
  if (pathParts[1]) {
    await supabase.storage.from('module-files').remove([decodeURIComponent(pathParts[1])])
  }

  const { error } = await supabase
    .from('module_files')
    .delete()
    .eq('id', fileId)

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/modules/${moduleId}/edit`)
}
