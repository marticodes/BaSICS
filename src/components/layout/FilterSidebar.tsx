import type { Filters } from '../../types'

interface Props {
  filters: Filters
  options: {
    categories: string[]
    customizations: string[]
    layers: string[]
    targets: string[]
    accessibilities: string[]
    persistences: string[]
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
  <fieldset className="space-y-2">
    <legend className="text-sm font-semibold text-slate-800">{title}</legend>
    <div className="grid grid-cols-1 gap-1">
      {values.map((value) => (
        <label key={value} className="flex cursor-pointer items-center gap-2 rounded p-1 text-sm hover:bg-slate-100">
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
    <aside className={`h-fit space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
      {showSearch && (
        <div>
          <label className="text-sm font-semibold text-slate-800" htmlFor="search">Search tools</label>
          <input
            id="search"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or description"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
      )}
      <button className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white" onClick={reset}>Reset all filters</button>
      <Multi title="Cluster" values={options.categories} selected={filters.categories} onToggle={(v) => toggle('categories', v)} />
      <Multi title="Customization" values={options.customizations} selected={filters.customizations} onToggle={(v) => toggle('customizations', v)} />
      <Multi title="Category" values={options.layers} selected={filters.layers} onToggle={(v) => toggle('layers', v)} />
      <Multi title="Target" values={options.targets} selected={filters.targets} onToggle={(v) => toggle('targets', v)} />
      <Multi title="Accessibility" values={options.accessibilities} selected={filters.accessibilities} onToggle={(v) => toggle('accessibilities', v)} />
      <Multi title="Persistence" values={options.persistences} selected={filters.persistences} onToggle={(v) => toggle('persistences', v)} />
    </aside>
  )
}
