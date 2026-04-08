import type { Filters } from '../types'

export const ActiveFilterChips = ({
  filters,
  onRemove,
}: {
  filters: Filters
  onRemove: (key: Exclude<keyof Filters, 'search'>, value: string) => void
}) => {
  const entries: { key: Exclude<keyof Filters, 'search'>; value: string }[] = []
  ;(['categories', 'customizations', 'layers', 'targets', 'accessibilities', 'persistences'] as const).forEach((key) => {
    filters[key].forEach((value) => entries.push({ key, value }))
  })

  if (entries.length === 0 && !filters.search) return null

  return (
    <div className="mb-3 flex flex-wrap gap-2" aria-label="Active filters">
      {filters.search && <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-700">Search: {filters.search}</span>}
      {entries.map(({ key, value }) => (
        <button key={`${key}-${value}`} onClick={() => onRemove(key, value)} className="rounded-full bg-slate-200 px-3 py-1 text-xs hover:bg-slate-300">
          {value} x
        </button>
      ))}
    </div>
  )
}
