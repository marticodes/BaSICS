import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { summarizeGroup } from '../../lib/aggregations'
import type { Group, Tool } from '../../types'

interface Props {
  groups: Group[]
  tools: Tool[]
  createGroup: (name: string, description?: string) => void
  deleteGroup: (groupId: string) => void
  removeToolFromGroup: (groupId: string, toolId: string) => void
  createSubgroup: (groupId: string, name: string) => void
}

export const GroupsPage = ({
  groups,
  tools,
  createGroup,
  deleteGroup,
  removeToolFromGroup,
  createSubgroup,
}: Props) => {
  const [name, setName] = useState('')

  const exportJson = (group: Group) => {
    const selected = tools.filter((t) => group.toolIds.includes(t.id))
    download(`${group.name}.json`, JSON.stringify(selected, null, 2), 'application/json')
  }

  const exportCsv = (group: Group) => {
    const selected = tools.filter((t) => group.toolIds.includes(t.id))
    const header = ['name', 'category', 'customization', 'accessibility', 'persistence']
    const rows = selected.map((t) => [t.name, t.category, t.customization, t.accessibility, t.persistence])
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v.replaceAll('"', '""')}"`).join(',')).join('\n')
    download(`${group.name}.csv`, csv, 'text/csv')
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Custom Groups & Subgroups</h1>
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} className="rounded border border-slate-300 px-3 py-2" placeholder="New group name" />
        <button onClick={() => { if (name.trim()) { createGroup(name.trim()); setName('') } }} className="rounded bg-indigo-600 px-3 py-2 text-white">Create group</button>
      </div>

      <div className="space-y-4">
        {groups.length === 0 && <Empty text="No groups yet. Create one to curate tools." />}
        {groups.map((group) => {
          const summary = summarizeGroup(group, tools)
          return (
            <article key={group.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">{group.name} ({group.toolIds.length})</h2>
                <div className="flex gap-2">
                  <button onClick={() => exportJson(group)} className="rounded bg-slate-900 px-3 py-1 text-sm text-white">Export JSON</button>
                  <button onClick={() => exportCsv(group)} className="rounded bg-slate-900 px-3 py-1 text-sm text-white">Export CSV</button>
                  <button onClick={() => deleteGroup(group.id)} className="rounded bg-rose-600 px-3 py-1 text-sm text-white">Delete</button>
                </div>
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <div>
                  <h3 className="font-semibold">Category distribution</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={summary.byCategory as { category: string; value: number }[]}>
                      <XAxis dataKey="category" hide /><YAxis /><Tooltip />
                      <Bar dataKey="value" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="font-semibold">Accessibility distribution</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={summary.byAccessibility as { accessibility: string; value: number }[]}>
                      <XAxis dataKey="accessibility" hide /><YAxis /><Tooltip />
                      <Bar dataKey="value" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => createSubgroup(group.id, `Subgroup ${group.subgroups.length + 1}`)} className="rounded bg-indigo-100 px-3 py-1 text-sm text-indigo-700">Add subgroup</button>
                {group.subgroups.map((sub) => <span key={sub.id} className="rounded bg-slate-100 px-2 py-1 text-xs">{sub.name} ({sub.toolIds.length})</span>)}
              </div>

              <ul className="mt-3 space-y-1 text-sm">
                {group.toolIds.map((id) => {
                  const tool = tools.find((t) => t.id === id)
                  return tool ? (
                    <li key={id} className="flex items-center justify-between rounded bg-slate-50 px-2 py-1">
                      <span>{tool.name}</span>
                      <button onClick={() => removeToolFromGroup(group.id, id)} className="text-rose-600">remove</button>
                    </li>
                  ) : null
                })}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}

const Empty = ({ text }: { text: string }) => <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-slate-500">{text}</div>

const download = (filename: string, content: string, type: string) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
