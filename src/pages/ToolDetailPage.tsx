import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Tool } from '../types'

export const ToolDetailPage = ({ tools }: { tools: Tool[] }) => {
  const { toolId } = useParams()
  const tool = useMemo(() => tools.find((item) => item.id === toolId), [tools, toolId])
  const [isTallImage, setIsTallImage] = useState(false)

  if (!tool) return <div className="rounded bg-white p-4">Tool not found.</div>

  const related = tools
    .filter((t) => t.id !== tool.id)
    .filter((t) => t.category === tool.category || t.layer === tool.layer || t.target === tool.target)
    .slice(0, 6)

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-3xl font-bold">{tool.name}</h1>
      <p className="mb-4 text-slate-600">{tool.category}</p>
      <div className={`mb-4 ${isTallImage ? 'md:grid md:grid-cols-[260px_minmax(0,1fr)] md:gap-4' : 'space-y-4'}`}>
        <div className={`overflow-hidden rounded-xl bg-slate-100 ${isTallImage ? 'h-[420px]' : 'max-h-[480px]'}`}>
          <img
            src={tool.imageUrl}
            alt={tool.name}
            onLoad={(event) => {
              const { naturalWidth, naturalHeight } = event.currentTarget
              setIsTallImage(naturalHeight > naturalWidth * 1.15)
            }}
            className="h-full w-full object-contain"
          />
        </div>
        <div>
          <p className="mb-4">{tool.description}</p>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Meta k="Customization" v={tool.customization} />
            <Meta k="Accessibility" v={tool.accessibility} />
            <Meta k="Persistence" v={tool.persistence} />
            <Meta k="Category" v={tool.layer} />
            <Meta k="Target" v={tool.target} />
            <Meta k="Example Platforms" v={tool.examplePlatforms} />
          </dl>
        </div>
      </div>
      <h2 className="mt-6 text-xl font-semibold">Related tools</h2>
      <ul className="mt-2 list-disc pl-5">
        {related.map((r) => <li key={r.id}>{r.name}</li>)}
      </ul>
    </section>
  )
}

const Meta = ({ k, v }: { k: string; v: string }) => (
  <div>
    <dt className="text-sm font-semibold text-slate-700">{k}</dt>
    <dd>{v}</dd>
  </div>
)
