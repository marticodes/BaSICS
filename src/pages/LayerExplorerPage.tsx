import { useMemo, useState } from 'react'
import { ToolDetailModal } from '../components/ToolDetailModal'
import type { Tool } from '../types'

const columnColors = [
  'bg-indigo-50 border-indigo-200',
  'bg-emerald-50 border-emerald-200',
  'bg-amber-50 border-amber-200',
  'bg-rose-50 border-rose-200',
]

export const LayerExplorerPage = ({ tools, allTools }: { tools: Tool[]; allTools: Tool[] }) => {
  const [open, setOpen] = useState<Tool | null>(null)

  const layers = useMemo(() => {
    const layerMap = tools.reduce<Record<string, Tool[]>>((acc, tool) => {
      acc[tool.layer] = [...(acc[tool.layer] ?? []), tool]
      return acc
    }, {})

    return Object.entries(layerMap)
      .map(([layer, layerTools]) => {
        const categories = layerTools.reduce<Record<string, Tool[]>>((acc, tool) => {
          acc[tool.category] = [...(acc[tool.category] ?? []), tool]
          return acc
        }, {})

        const sortedCategories = Object.entries(categories).sort((a, b) =>
          a[0].localeCompare(b[0]),
        )

        return { layer, toolsCount: layerTools.length, categories: sortedCategories }
      })
      .sort((a, b) => b.toolsCount - a.toolsCount)
  }, [tools])

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Category Explorer</h1>
        <p className="text-sm text-slate-600">
          Four-color columns by category, with clusters and tools inside each column.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
                <details key={`${layer.layer}-${category}`} className="rounded-lg bg-white/80 p-2">
                  <summary className="cursor-pointer text-sm font-medium text-slate-800">
                    {category} ({categoryTools.length})
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {categoryTools.map((tool) => (
                      <li key={tool.id}>
                        <button
                          onClick={() => setOpen(tool)}
                          className="w-full rounded px-2 py-1 text-left text-sm text-slate-700 hover:bg-slate-100"
                        >
                          {tool.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </article>
        ))}
      </div>

      {open && <ToolDetailModal tool={open} tools={allTools} onClose={() => setOpen(null)} />}
    </section>
  )
}
