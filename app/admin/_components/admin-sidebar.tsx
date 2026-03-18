'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  HelpCircle,
  FolderOpen,
  ArrowLeft,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard',    href: '/admin',         icon: LayoutDashboard },
  { label: 'Użytkownicy',  href: '/admin/users',   icon: Users },
  { label: 'Moduły',       href: '/admin/modules', icon: BookOpen },
  { label: 'Quizy',        href: '/admin/quizzes', icon: HelpCircle },
  { label: 'Pliki',        href: '/admin/files',   icon: FolderOpen },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 shrink-0 min-h-screen bg-foreground text-background flex flex-col border-r-2 border-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b-2 border-background/20">
        <Image
          src="/images/bcu-logo.png"
          alt="BCU"
          width={36}
          height={36}
          className="w-9 h-9"
        />
        <div className="leading-tight">
          <div className="font-black text-sm">BCU Spedycja</div>
          <div className="text-xs text-background/50">Panel admina</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-bold transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-background/70 hover:bg-background/10 hover:text-background'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Back to app */}
      <div className="px-3 py-4 border-t-2 border-background/20">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-background/50 hover:text-background transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Wróć do aplikacji
        </Link>
      </div>
    </aside>
  )
}
