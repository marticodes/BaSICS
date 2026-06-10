import { useCallback, useEffect, useMemo, useState } from 'react'
import { SelectionPie } from '../components/charts/Charts'
import { TemporaryToolCreator } from '../components/TemporaryToolCreator'
import { ToolDetailModal } from '../components/ToolDetailModal'
import { useNewToolIdeas } from '../context/NewToolIdeasContext'
import { tallyByField, targetPieSegments } from '../lib/aggregations'
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
  const { ideas: newToolIdeas, addIdea, updateIdea, removeIdea, setSelectedTools } = useNewToolIdeas()

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

  useEffect(() => {
    setSelectedTools(selectedTools)
  }, [selectedTools, setSelectedTools])

  const toolsForStats = useMemo(
    () => [...selectedTools, ...newToolIdeas],
    [selectedTools, newToolIdeas],
  )

  const explorerKey = useMemo(
    () => tools.map((tool) => tool.id).sort().join(','),
    [tools],
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

  const clusterPie = useMemo(() => tallyByField(toolsForStats, 'category'), [toolsForStats])
  const categoryPie = useMemo(() => tallyByField(toolsForStats, 'layer'), [toolsForStats])
  const accessibilityPie = useMemo(
    () => tallyByField(toolsForStats, 'accessibility'),
    [toolsForStats],
  )
  const targetPie = useMemo(() => targetPieSegments(toolsForStats), [toolsForStats])

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Tool Map</h1>
        <p className="text-sm text-slate-600">
        Click a card to select or deselect tools. Use Details to open full info. Selected tools show distribution charts on the right.
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

          <div key={explorerKey} className="grid gap-3 md:grid-cols-2">
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
          className="flex h-fit max-h-[calc(100vh-7rem)] flex-col gap-0 self-start overflow-y-auto overscroll-contain pb-[min(45vh,28rem)] [scroll-behavior:smooth] [scrollbar-gutter:stable] xl:sticky xl:top-24"
          aria-label="Selection statistics"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <TemporaryToolCreator
              allTools={allTools}
              ideas={newToolIdeas}
              onCreate={addIdea}
              onUpdate={updateIdea}
              onRemove={removeIdea}
            />
          </div>

          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            {toolsForStats.length === 0 ? (
              <p className="text-sm text-slate-500">
                Select one or more tools from the grouped explorer to see distribution charts.
              </p>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-medium text-slate-800">
                  Statistics for {toolsForStats.length} tool{toolsForStats.length === 1 ? '' : 's'}
                  {newToolIdeas.length > 0 && selectedTools.length > 0 ? ' (includes new tool ideas)' : null}
                </p>
                <SelectionPie data={clusterPie} title="Cluster distribution" compact />
                <SelectionPie data={categoryPie} title="Category distribution" compact />
                <SelectionPie data={accessibilityPie} title="Tool accessibility" compact />
                <SelectionPie data={targetPie} title="Target distribution" compact />
              </div>
            )}
          </div>
        </aside>
      </div>

      {openTool && (
        <ToolDetailModal
          tool={openTool}
          tools={allTools}
          onClose={() => setOpenTool(null)}
        />
      )}
    </section>
  )
}
