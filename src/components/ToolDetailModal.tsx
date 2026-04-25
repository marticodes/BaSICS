import { useEffect, useState } from 'react'
import type { Tool } from '../types'

interface Props {
  tool: Tool
  tools: Tool[]
  onClose: () => void
  onOpenTool: (tool: Tool) => void
}

export const ToolDetailModal = ({ tool, tools, onClose, onOpenTool }: Props) => {
  const [isTallImage, setIsTallImage] = useState(false)
  const [isImageOpen, setIsImageOpen] = useState(false)

  useEffect(() => {
    setIsTallImage(false)
    setIsImageOpen(false)
  }, [tool.id])

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

        <div className={`mb-4 ${isTallImage ? 'md:grid md:grid-cols-[200px_minmax(0,1fr)] md:gap-4' : 'space-y-4'}`}>
          <div className={`rounded-lg bg-slate-100 ${isTallImage ? 'h-[320px]' : 'h-[260px]'}`}>
            <button
              type="button"
              onClick={() => setIsImageOpen(true)}
              className="flex h-full w-full cursor-zoom-in items-center justify-center p-2"
              aria-label={`Open larger image for ${tool.name}`}
            >
              <img
                key={tool.id}
                src={tool.imageUrl}
                alt={tool.name}
                onLoad={(event) => {
                  const { naturalWidth, naturalHeight } = event.currentTarget
                  setIsTallImage(naturalHeight > naturalWidth * 1.15)
                }}
                className="max-h-full max-w-full h-auto w-auto object-contain"
              />
            </button>
          </div>
          <div>
            <p className="mb-4 text-slate-700">{tool.description}</p>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div><dt className="font-semibold">Customization</dt><dd>{tool.customization}</dd></div>
              <div><dt className="font-semibold">Accessibility</dt><dd>{tool.accessibility}</dd></div>
              <div><dt className="font-semibold">Persistence</dt><dd>{tool.persistence}</dd></div>
              <div><dt className="font-semibold">Category</dt><dd>{tool.layer}</dd></div>
              <div><dt className="font-semibold">Target</dt><dd>{tool.target}</dd></div>
              <div><dt className="font-semibold">Example Platforms</dt><dd>{tool.examplePlatforms}</dd></div>
            </dl>
          </div>
        </div>

        <h3 className="mt-6 font-semibold">Related tools</h3>
        <ul className="mt-2 space-y-1 text-sm">
          {related.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onOpenTool(r)}
                className="text-left text-indigo-700 underline-offset-2 hover:underline"
              >
                {r.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {isImageOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 p-4" role="dialog" aria-modal="true" aria-label={`${tool.name} image preview`}>
          <button
            type="button"
            onClick={() => setIsImageOpen(false)}
            className="absolute right-4 top-4 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            aria-label="Close image preview"
          >
            X
          </button>
          <img
            src={tool.imageUrl}
            alt={tool.name}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  )
}
