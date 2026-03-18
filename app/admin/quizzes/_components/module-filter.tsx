'use client'

interface Props {
  modules: { id: string; title: string }[]
  selected: string
}

export function ModuleFilter({ modules, selected }: Props) {
  return (
    <form method="get">
      <select
        name="module"
        defaultValue={selected}
        onChange={(e) => (e.target.form as HTMLFormElement).submit()}
        className="h-10 px-3 border-2 border-foreground bg-background text-sm font-medium"
      >
        <option value="">Wszystkie moduły</option>
        {modules.map(m => (
          <option key={m.id} value={m.id}>{m.title}</option>
        ))}
      </select>
    </form>
  )
}
