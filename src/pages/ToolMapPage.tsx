import { useCallback, useMemo, useState } from 'react'
import { SelectionPie } from '../components/charts/Charts'
import { ToolDetailModal } from '../components/ToolDetailModal'
import { tallyByField } from '../lib/aggregations'
import type { Tool } from '../types'

/** Same category palette as Category Explorer (indigo → emerald → amber → rose). */
const layerCardColors = [
  'bg-indigo-50 border-indigo-200',
  'bg-emerald-50 border-emerald-200',
  'bg-amber-50 border-amber-200',
  'bg-rose-50 border-rose-200',
] as const

function useLayerColorMap(tools: Tool[]) {
  return useMemo(() => {
    const distinct = [...new Set(tools.map((t) => t.layer))].sort((a, b) => a.localeCompare(b))
    const map = new Map<string, string>()
    distinct.forEach((layer, i) => {
      map.set(layer, layerCardColors[i % layerCardColors.length])
    })
    return map
  }, [tools])
}

export const ToolMapPage = ({ tools, allTools }: { tools: Tool[]; allTools: Tool[] }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [detailTool, setDetailTool] = useState<Tool | null>(null)
  const layerColors = useLayerColorMap(tools)

  const layerLegend = useMemo(
    () => [...layerColors.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    [layerColors],
  )

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const clearSelection = useCallback(() => setSelectedIds(new Set()), [])

  const selectedTools = useMemo(
    () => tools.filter((t) => selectedIds.has(t.id)),
    [tools, selectedIds],
  )

  const customizationPie = useMemo(
    () => tallyByField(selectedTools, 'customization'),
    [selectedTools],
  )
  const accessibilityPie = useMemo(
    () => tallyByField(selectedTools, 'accessibility'),
    [selectedTools],
  )

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Interactive Tool Map</h1>
        <p className="text-sm text-slate-600">
          Click a card to select or deselect tools. Use <span className="font-medium">Details</span> to open full
          info. Selected tools show distribution charts on the right.
        </p>
      </div>

      <div
        className="rounded-xl border border-indigo-100 bg-indigo-50/80 p-4 text-sm text-slate-800"
        role="note"
        aria-label="Why tool cards are colored"
      >
        <p className="font-semibold text-indigo-950">Why these colors?</p>
        <p className="mt-1 text-slate-700">
          Card colors show each tool&apos;s <span className="font-medium">Category</span> in BaSICS (where and how the
          tool sits in the moderation stack). Tools that share the same category use the same color family, matching the
          Categories page. Distinct categories are assigned one of four repeating tints (indigo, emerald, amber, rose) in
          alphabetical order, so you can scan by category at a glance.
        </p>
        {layerLegend.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2" aria-label="Category color legend">
            {layerLegend.map(([layer, colorClass]) => (
              <li key={layer} className="flex items-center gap-2 text-xs text-slate-700">
                <span
                  className={`h-4 w-8 shrink-0 rounded border ${colorClass}`}
                  aria-hidden
                />
                <span className="max-w-[14rem] truncate" title={layer}>
                  {layer}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-600" aria-live="polite">
              {selectedIds.size} selected
            </span>
            {selectedIds.size > 0 && (
              <button
                type="button"
                onClick={clearSelection}
                className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Clear selection
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => {
              const isSelected = selectedIds.has(tool.id)
              const layerClass = layerColors.get(tool.layer) ?? 'bg-slate-50 border-slate-200'
              return (
                <div
                  key={tool.id}
                  className={`relative rounded-xl border p-3 text-left transition hover:shadow-md ${layerClass} ${
                    isSelected ? 'ring-2 ring-indigo-600 ring-offset-2' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSelect(tool.id)}
                    className="w-full text-left"
                    aria-pressed={isSelected}
                    aria-label={`${isSelected ? 'Deselect' : 'Select'} ${tool.name}`}
                  >
                    <h3 className="font-semibold text-slate-900">{tool.name}</h3>
                    <p className="mt-1 line-clamp-3 text-sm text-slate-700">{tool.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1 text-xs">
                      <span className="rounded bg-white/80 px-2 py-0.5 font-medium text-slate-800">{tool.category}</span>
                      <span className="rounded bg-white/80 px-2 py-0.5 text-slate-700">{tool.accessibility}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDetailTool(tool)
                    }}
                    className="mt-2 w-full rounded bg-white/90 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-white"
                  >
                    Details
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <aside
          className="w-full shrink-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:w-[320px]"
          aria-label="Selection statistics"
        >
          {selectedTools.length === 0 ? (
            <p className="text-sm text-slate-500">Select one or more tools to see customization and accessibility distributions.</p>
          ) : (
            <div className="space-y-6">
              <p className="text-sm font-medium text-slate-800">
                Statistics for {selectedTools.length} tool{selectedTools.length === 1 ? '' : 's'}
              </p>
              <SelectionPie data={customizationPie} title="Customization (tool type)" />
              <SelectionPie data={accessibilityPie} title="Tool accessibility" />
            </div>
          )}
        </aside>
      </div>

      {detailTool && (
        <ToolDetailModal tool={detailTool} tools={allTools} onClose={() => setDetailTool(null)} />
      )}
    </section>
  )
}
