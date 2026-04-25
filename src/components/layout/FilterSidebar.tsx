import type { Filters } from '../../types'

interface Props {
  filters: Filters
  options: {
    categories: string[]
    targets: string[]
    accessibilities: string[]
  }
  toggle: (key: Exclude<keyof Filters, 'search'>, value: string) => void
  setSearch: (value: string) => void
  reset: () => void
  showSearch?: boolean
  className?: string
}

const Multi = ({
  title,
  values,
  selected,
  onToggle,
}: {
  title: string
  values: string[]
  selected: string[]
  onToggle: (value: string) => void
}) => (
  <fieldset className="space-y-1.5">
    <legend className="text-xs font-semibold uppercase tracking-wide text-slate-700">{title}</legend>
    <div className="grid grid-cols-1 gap-0.5">
      {values.map((value) => (
        <label key={value} className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs text-slate-700 hover:bg-slate-100">
          <input
            aria-label={`${title} ${value}`}
            type="checkbox"
            checked={selected.includes(value)}
            onChange={() => onToggle(value)}
          />
          {value}
        </label>
      ))}
    </div>
  </fieldset>
)

export const FilterSidebar = ({
  filters,
  options,
  toggle,
  setSearch,
  reset,
  showSearch = true,
  className = '',
}: Props) => {
  return (
    <aside className={`h-fit space-y-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm ${className}`}>
      {showSearch && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-700" htmlFor="search">Search tools</label>
          <input
            id="search"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or description"
            className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm"
          />
        </div>
      )}
      <button className="w-full rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white" onClick={reset}>Reset filters</button>
      <Multi title="Cluster" values={options.categories} selected={filters.categories} onToggle={(v) => toggle('categories', v)} />
      <Multi title="Target" values={options.targets} selected={filters.targets} onToggle={(v) => toggle('targets', v)} />
      <Multi title="Accessibility" values={options.accessibilities} selected={filters.accessibilities} onToggle={(v) => toggle('accessibilities', v)} />
    </aside>
  )
}
