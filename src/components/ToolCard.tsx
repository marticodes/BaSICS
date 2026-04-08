import type { Tool } from '../types'

export const ToolCard = ({ tool, onClick }: { tool: Tool; onClick: (tool: Tool) => void }) => (
  <button
    onClick={() => onClick(tool)}
    className="group w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
  >
    <div className="mb-2 flex items-center justify-between gap-2">
      <h3 className="font-semibold text-slate-900">{tool.name}</h3>
      <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-700">{tool.customization}</span>
    </div>
    <p className="mb-2 text-sm text-slate-500">{tool.category}</p>
    <p className="line-clamp-2 text-sm text-slate-700">{tool.description}</p>
    <div className="mt-3 inline-block rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">{tool.accessibility}</div>
  </button>
)
