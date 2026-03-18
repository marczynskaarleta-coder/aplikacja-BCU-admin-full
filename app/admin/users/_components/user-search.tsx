'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useTransition } from 'react'

export function UserSearch({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        defaultValue={defaultValue}
        placeholder="Szukaj po emailu lub nazwie..."
        className="pl-10 border-2 border-foreground"
        onChange={(e) => {
          const q = e.target.value
          startTransition(() => {
            if (q) {
              router.push(`${pathname}?q=${encodeURIComponent(q)}`)
            } else {
              router.push(pathname)
            }
          })
        }}
      />
    </div>
  )
}
