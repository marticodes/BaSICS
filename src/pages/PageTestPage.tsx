import { useCallback, useMemo, useState } from 'react'
import { SelectionPie } from '../components/charts/Charts'
import { ToolDetailModal } from '../components/ToolDetailModal'
import { tallyByField } from '../lib/aggregations'
import type { Tool } from '../types'

const columnColors = [
  'bg-indigo-50 border-indigo-200',
  'bg-emerald-50 border-emerald-200',
  'bg-amber-50 border-amber-200',
  'bg-rose-50 border-rose-200',
] as const

type LayerGroup = {
  layer: string
  toolsCount: number
  categories: [string, Tool[]][]
}

export const PageTestPage = ({ tools, allTools }: { tools: Tool[]; allTools: Tool[] }) => {
  const [openTool, setOpenTool] = useState<Tool | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

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
    () => tools.filter((tool) => selectedIds.has(tool.id)),
    [tools, selectedIds],
  )

  const layers = useMemo<LayerGroup[]>(() => {
    const layerMap = tools.reduce<Record<string, Tool[]>>((acc, tool) => {
      acc[tool.layer] = [...(acc[tool.layer] ?? []), tool]
      return acc
    }, {})

    return Object.entries(layerMap)
      .map(([layer, layerTools]) => {
        const categoryMap = layerTools.reduce<Record<string, Tool[]>>((acc, tool) => {
          acc[tool.category] = [...(acc[tool.category] ?? []), tool]
          return acc
        }, {})

        const categories = Object.entries(categoryMap)
          .map(([category, categoryTools]) => {
            const sorted = [...categoryTools].sort((a, b) => a.name.localeCompare(b.name))
            return [category, sorted] as [string, Tool[]]
          })
          .sort((a, b) => a[0].localeCompare(b[0]))

        return { layer, toolsCount: layerTools.length, categories }
      })
      .sort((a, b) => b.toolsCount - a.toolsCount)
  }, [tools])

  const categoryPie = useMemo(() => tallyByField(selectedTools, 'category'), [selectedTools])
  const targetPie = useMemo(() => tallyByField(selectedTools, 'target'), [selectedTools])
  const accessibilityPie = useMemo(
    () => tallyByField(selectedTools, 'accessibility'),
    [selectedTools],
  )

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Page Test</h1>
        <p className="text-sm text-slate-600">
          Combined view: grouped category explorer with selectable tools and live charts.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
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

          <div className="grid gap-3 md:grid-cols-2">
            {layers.map((layer, index) => (
              <article
                key={layer.layer}
                className={`rounded-xl border p-3 shadow-sm ${columnColors[index % columnColors.length]}`}
              >
                <h2 className="text-lg font-semibold">
                  {layer.layer} ({layer.toolsCount})
                </h2>

                <div className="mt-3 space-y-3">
                  {layer.categories.map(([category, categoryTools]) => (
                    <details
                      key={`${layer.layer}-${category}`}
                      className="rounded-lg bg-white/85 p-2"
                      open={categoryTools.length <= 4}
                    >
                      <summary className="cursor-pointer text-sm font-medium text-slate-800">
                        {category} ({categoryTools.length})
                      </summary>
                      <ul className="mt-2 space-y-2">
                        {categoryTools.map((tool) => {
                          const isSelected = selectedIds.has(tool.id)
                          return (
                            <li
                              key={tool.id}
                              className={`rounded border bg-white p-2 transition ${
                                isSelected
                                  ? 'border-indigo-300 ring-1 ring-indigo-500/40'
                                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => toggleSelect(tool.id)}
                                className="w-full text-left"
                                aria-pressed={isSelected}
                                aria-label={`${isSelected ? 'Deselect' : 'Select'} ${tool.name}`}
                              >
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    setOpenTool(tool)
                                  }}
                                  className="text-left"
                                >
                                  <p className="font-medium text-slate-900 hover:underline">{tool.name}</p>
                                </button>
                                <p className="mt-1 text-xs text-slate-700">{tool.description}</p>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </details>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside
          className="h-fit rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm xl:sticky xl:top-24"
          aria-label="Selection statistics"
        >
          {selectedTools.length === 0 ? (
            <p className="text-sm text-slate-500">
              Select one or more tools from the grouped explorer to see distribution charts.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-800">
                Statistics for {selectedTools.length} tool{selectedTools.length === 1 ? '' : 's'}
              </p>
              <SelectionPie data={categoryPie} title="Cluster distribution" compact />
              <SelectionPie data={targetPie} title="Target distribution" compact />
              <SelectionPie data={accessibilityPie} title="Tool accessibility" compact />
            </div>
          )}
        </aside>
      </div>

      {openTool && (
        <ToolDetailModal
          tool={openTool}
          tools={allTools}
          onClose={() => setOpenTool(null)}
          onOpenTool={(tool) => setOpenTool(tool)}
        />
      )}
    </section>
  )
}
