import { Link } from 'react-router-dom'
import type { Tool } from '../types'

interface Props {
  tool: Tool
  tools: Tool[]
  onClose: () => void
}

export const ToolDetailModal = ({ tool, tools, onClose }: Props) => {
  const related = tools
    .filter((t) => t.id !== tool.id)
    .filter((t) => t.category === tool.category || t.layer === tool.layer || t.target === tool.target)
    .slice(0, 4)

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4" role="dialog" aria-modal="true" aria-label={`${tool.name} details`}>
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-5">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{tool.name}</h2>
            <p className="text-slate-600">{tool.category}</p>
          </div>
          <button onClick={onClose} className="rounded bg-slate-100 px-3 py-1">Close</button>
        </div>

        <img src={tool.imageUrl} alt={tool.name} className="mb-4 h-56 w-full rounded-lg object-cover" />
        <p className="mb-4 text-slate-700">{tool.description}</p>
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div><dt className="font-semibold">Customization</dt><dd>{tool.customization}</dd></div>
          <div><dt className="font-semibold">Accessibility</dt><dd>{tool.accessibility}</dd></div>
          <div><dt className="font-semibold">Persistence</dt><dd>{tool.persistence}</dd></div>
          <div><dt className="font-semibold">Category</dt><dd>{tool.layer}</dd></div>
          <div><dt className="font-semibold">Target</dt><dd>{tool.target}</dd></div>
          <div><dt className="font-semibold">Example Platforms</dt><dd>{tool.examplePlatforms}</dd></div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={`/tool/${tool.id}`} className="rounded bg-slate-800 px-3 py-1 text-sm text-white">Open full detail page</Link>
        </div>

        <h3 className="mt-6 font-semibold">Related tools</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {related.map((r) => <li key={r.id}>{r.name}</li>)}
        </ul>
      </div>
    </div>
  )
}
