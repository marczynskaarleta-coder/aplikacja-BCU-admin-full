import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserRow } from './_components/user-row'
import { UserSearch } from './_components/user-search'

export const metadata = { title: 'Użytkownicy - Admin BCU' }

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function UsersPage({ searchParams }: Props) {
  await requireAdmin()
  const { q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (q) {
    query = query.or(`email.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%`)
  }

  const { data: users, error } = await query

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Użytkownicy</h1>
          <p className="text-muted-foreground mt-1">
            {users?.length ?? 0} kont w systemie
          </p>
        </div>
        <UserSearch defaultValue={q} />
      </div>

      <Card className="border-2 border-foreground">
        <CardHeader className="border-b-2 border-foreground pb-4">
          <div className="grid grid-cols-12 text-xs font-black uppercase text-muted-foreground">
            <span className="col-span-4">Użytkownik</span>
            <span className="col-span-2">Rola</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-2">Dołączył</span>
            <span className="col-span-2 text-right">Akcje</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error && (
            <p className="p-6 text-sm text-destructive">
              Błąd: {error.message}. Upewnij się że uruchomiłeś scripts/002_profiles_roles.sql
            </p>
          )}
          {!error && (!users || users.length === 0) && (
            <p className="p-6 text-sm text-muted-foreground text-center">
              {q ? 'Brak użytkowników pasujących do wyszukiwania.' : 'Brak użytkowników.'}
            </p>
          )}
          {users?.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
