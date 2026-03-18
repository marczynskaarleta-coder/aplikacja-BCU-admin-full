'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { changeUserRole, changeUserStatus, resetUserPassword } from '../actions'
import { KeyRound, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  user: 'Użytkownik',
  editor: 'Edytor',
  trainer: 'Trener',
}

const ROLE_COLORS: Record<string, string> = {
  admin:   'bg-primary text-primary-foreground',
  user:    'bg-muted text-muted-foreground',
  editor:  'bg-blue-100 text-blue-800',
  trainer: 'bg-purple-100 text-purple-800',
}

const STATUS_COLORS: Record<string, string> = {
  active:   'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-600',
  blocked:  'bg-red-100 text-red-800',
}

const STATUS_LABELS: Record<string, string> = {
  active:   'Aktywny',
  inactive: 'Nieaktywny',
  blocked:  'Zablokowany',
}

interface UserProfile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  role: string
  status: string
  created_at: string
}

export function UserRow({ user }: { user: UserProfile }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)

  const handle = (fn: () => Promise<void>) => {
    setError(null)
    startTransition(async () => {
      try { await fn() }
      catch (e: any) { setError(e.message) }
    })
  }

  return (
    <>
      <div className={`grid grid-cols-12 items-center px-6 py-4 border-b border-border text-sm ${isPending ? 'opacity-50' : ''}`}>
        {/* User info */}
        <div className="col-span-4 min-w-0">
          <div className="font-bold truncate">
            {user.first_name || user.last_name
              ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
              : '—'}
          </div>
          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
        </div>

        {/* Role */}
        <div className="col-span-2">
          <div className="relative inline-block">
            <select
              value={user.role}
              disabled={isPending}
              onChange={(e) => handle(() => changeUserRole(user.id, e.target.value))}
              className={`appearance-none pr-6 pl-2 py-1 text-xs font-bold border-0 cursor-pointer ${ROLE_COLORS[user.role] ?? 'bg-muted'}`}
            >
              <option value="admin">Admin</option>
              <option value="user">Użytkownik</option>
              <option value="editor">Edytor</option>
              <option value="trainer">Trener</option>
            </select>
            <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
          </div>
        </div>

        {/* Status */}
        <div className="col-span-2">
          <div className="relative inline-block">
            <select
              value={user.status}
              disabled={isPending}
              onChange={(e) => handle(() => changeUserStatus(user.id, e.target.value))}
              className={`appearance-none pr-6 pl-2 py-1 text-xs font-bold border-0 cursor-pointer ${STATUS_COLORS[user.status] ?? 'bg-muted'}`}
            >
              <option value="active">Aktywny</option>
              <option value="inactive">Nieaktywny</option>
              <option value="blocked">Zablokowany</option>
            </select>
            <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
          </div>
        </div>

        {/* Date */}
        <div className="col-span-2 text-xs text-muted-foreground">
          {format(new Date(user.created_at), 'd MMM yyyy', { locale: pl })}
        </div>

        {/* Actions */}
        <div className="col-span-2 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending || !user.email}
            title="Wyślij link do resetu hasła"
            onClick={() => handle(async () => {
              await resetUserPassword(user.email!)
              setResetSent(true)
              setTimeout(() => setResetSent(false), 3000)
            })}
          >
            <KeyRound className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {(error || resetSent) && (
        <div className={`px-6 py-2 text-xs border-b border-border ${error ? 'text-destructive bg-destructive/5' : 'text-green-700 bg-green-50'}`}>
          {error || 'Link do resetu hasła został wysłany.'}
        </div>
      )}
    </>
  )
}
