import { useMemo, useState } from 'react'
import { toolsPerCategory } from '../../lib/aggregations'
import type { Group, Tool } from '../../types'

export const ComparePage = ({ tools, groups }: { tools: Tool[]; groups: Group[] }) => {
  const [left, setLeft] = useState(groups[0]?.id ?? '')
  const [right, setRight] = useState(groups[1]?.id ?? '')

  const leftTools = useMemo(() => {
    const g = groups.find((x) => x.id === left)
    return g ? tools.filter((t) => g.toolIds.includes(t.id)) : []
  }, [groups, left, tools])

  const rightTools = useMemo(() => {
    const g = groups.find((x) => x.id === right)
    return g ? tools.filter((t) => g.toolIds.includes(t.id)) : []
  }, [groups, right, tools])

  const leftCats = toolsPerCategory(leftTools)
  const rightCats = toolsPerCategory(rightTools)

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Compare Groups</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <select value={left} onChange={(e) => setLeft(e.target.value)} className="rounded border border-slate-300 px-3 py-2">
          <option value="">Select left group</option>
          {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select value={right} onChange={(e) => setRight(e.target.value)} className="rounded border border-slate-300 px-3 py-2">
          <option value="">Select right group</option>
          {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Left set" total={leftTools.length} rows={leftCats.map((r) => `${r.category}: ${r.value}`)} />
        <Panel title="Right set" total={rightTools.length} rows={rightCats.map((r) => `${r.category}: ${r.value}`)} />
      </div>
    </section>
  )
}

const Panel = ({ title, total, rows }: { title: string; total: number; rows: string[] }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-sm text-slate-600">Total: {total}</p>
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
      {rows.length === 0 ? <li>No data yet.</li> : rows.map((row) => <li key={row}>{row}</li>)}
    </ul>
  </article>
)
