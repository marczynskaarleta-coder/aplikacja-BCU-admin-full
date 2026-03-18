import { requireAdmin } from '@/lib/auth/helpers'
import { AdminSidebar } from './_components/admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await requireAdmin()

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b-2 border-foreground flex items-center justify-between px-6 bg-background shrink-0">
          <span className="text-sm font-bold text-muted-foreground">
            Panel Administratora
          </span>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-7 h-7 bg-primary flex items-center justify-center font-black text-primary-foreground text-xs">
              {(profile?.first_name?.[0] ?? user.email?.[0] ?? 'A').toUpperCase()}
            </div>
            <span className="font-medium hidden sm:block">
              {profile?.first_name
                ? `${profile.first_name} ${profile.last_name ?? ''}`
                : user.email}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
