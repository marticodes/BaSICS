import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { layerForCluster } from '../lib/clusterCategoryMap'
import { splitMultiValue, uniqueSplitValues, uniqueValues } from '../lib/filtering'
import type { Tool } from '../types'

export type TemporaryToolDraft = {
  name: string
  description: string
  accessibilities: string[]
  cluster: string
  targets: string[]
}

const emptyDraft = (): TemporaryToolDraft => ({
  name: '',
  description: '',
  accessibilities: [],
  cluster: '',
  targets: [],
})

const toolToDraft = (tool: Tool): TemporaryToolDraft => ({
  name: tool.name,
  description: tool.description,
  accessibilities: splitMultiValue(tool.accessibility),
  cluster: tool.category,
  targets: splitMultiValue(tool.target),
})

export const buildTemporaryTool = (
  draft: TemporaryToolDraft,
  allTools: Tool[],
  existingId?: string,
): Tool => ({
  id: existingId ?? `temp-${crypto.randomUUID()}`,
  name: draft.name.trim(),
  description: draft.description.trim(),
  accessibility: draft.accessibilities.join(', '),
  customization: '',
  target: draft.targets.join(', '),
  category: draft.cluster,
  layer: layerForCluster(draft.cluster, allTools),
  examplePlatforms: '',
  persistence: '',
  imageUrl: '',
})

type Props = {
  allTools: Tool[]
  ideas: Tool[]
  onCreate: (tool: Tool) => void
  onUpdate: (tool: Tool) => void
  onRemove: (id: string) => void
}

const fieldClass =
  'mt-1 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30'
const labelClass = 'text-xs font-semibold uppercase tracking-wide text-slate-700'

const listBoxClass =
  'max-h-28 space-y-0.5 overflow-y-auto rounded-md border border-slate-200 bg-slate-50/80 p-2'

const MultiSelect = ({
  title,
  values,
  selected,
  onToggle,
}: {
  title: string
  values: string[]
  selected: string[]
  onToggle: (value: string) => void
}) => (
  <fieldset className="space-y-1.5">
    <legend className={labelClass}>{title}</legend>
    <div className={listBoxClass}>
      {values.map((value) => (
        <label
          key={value}
          className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm text-slate-700 hover:bg-white"
        >
          <input
            type="checkbox"
            className="size-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30"
            checked={selected.includes(value)}
            onChange={() => onToggle(value)}
            aria-label={`${title} ${value}`}
          />
          {value}
        </label>
      ))}
    </div>
  </fieldset>
)

const SingleSelect = ({
  title,
  name,
  values,
  selected,
  onSelect,
}: {
  title: string
  name: string
  values: string[]
  selected: string
  onSelect: (value: string) => void
}) => (
  <fieldset className="space-y-1.5">
    <legend className={labelClass}>{title}</legend>
    <div className={listBoxClass}>
      {values.map((value) => (
        <label
          key={value}
          className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm text-slate-700 hover:bg-white"
        >
          <input
            type="radio"
            name={name}
            className="size-4 shrink-0 border-slate-300 text-indigo-600 focus:ring-indigo-500/30"
            checked={selected === value}
            onChange={() => onSelect(value)}
            aria-label={`${title} ${value}`}
          />
          {value}
        </label>
      ))}
    </div>
  </fieldset>
)

export const TemporaryToolCreator = ({ allTools, ideas, onCreate, onUpdate, onRemove }: Props) => {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<TemporaryToolDraft>(emptyDraft)

  const options = useMemo(
    () => ({
      clusters: uniqueValues(allTools, 'category'),
      targets: uniqueSplitValues(allTools, 'target'),
      accessibilities: uniqueSplitValues(allTools, 'accessibility'),
    }),
    [allTools],
  )

  const assignedCategory = draft.cluster ? layerForCluster(draft.cluster, allTools) : ''

  const update = (patch: Partial<TemporaryToolDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }))
  }

  const toggleList = (key: 'accessibilities' | 'targets', value: string) => {
    setDraft((prev) => {
      const list = prev[key]
      return {
        ...prev,
        [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      }
    })
  }

  const openCreateModal = () => {
    setEditingId(null)
    setDraft(emptyDraft())
    setShowModal(true)
  }

  const openEditModal = (tool: Tool) => {
    setEditingId(tool.id)
    setDraft(toolToDraft(tool))
    setShowModal(true)
  }

  const closeModal = () => {
    setEditingId(null)
    setDraft(emptyDraft())
    setShowModal(false)
  }

  useEffect(() => {
    if (!showModal) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [showModal])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!draft.name.trim()) return
    if (draft.accessibilities.length === 0 || !draft.cluster || draft.targets.length === 0) return

    const tool = buildTemporaryTool(draft, allTools, editingId ?? undefined)
    if (editingId) onUpdate(tool)
    else onCreate(tool)
    closeModal()
  }

  const canSubmit =
    draft.name.trim().length > 0 &&
    draft.accessibilities.length > 0 &&
    draft.cluster.length > 0 &&
    draft.targets.length > 0

  const isEditing = editingId !== null

  const modal =
    showModal &&
    createPortal(
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-[2px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-tool-idea-dialog-title"
        onClick={closeModal}
      >
        <div
          className="max-h-[min(90vh,640px)] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 id="new-tool-idea-dialog-title" className="text-lg font-semibold text-slate-900">
                {isEditing ? 'Edit new tool idea' : 'Create new tool idea'}
              </h2>
              <p className="mt-0.5 text-sm text-slate-600">
                Not saved to the database. Shown in the sidebar after you add it.
              </p>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="shrink-0 rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2 md:items-start">
              <div className="space-y-4">
                <div>
                  <label htmlFor="new-tool-idea-name" className={labelClass}>
                    Name
                  </label>
                  <input
                    id="new-tool-idea-name"
                    value={draft.name}
                    onChange={(e) => update({ name: e.target.value })}
                    className={fieldClass}
                    placeholder="Tool name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-tool-idea-description" className={labelClass}>
                    Description
                  </label>
                  <textarea
                    id="new-tool-idea-description"
                    value={draft.description}
                    onChange={(e) => update({ description: e.target.value })}
                    rows={8}
                    className={`${fieldClass} min-h-[10rem] resize-y`}
                    placeholder="Short description"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <MultiSelect
                  title="Accessibility"
                  values={options.accessibilities}
                  selected={draft.accessibilities}
                  onToggle={(value) => toggleList('accessibilities', value)}
                />
                <SingleSelect
                  title="Cluster"
                  name="new-tool-idea-cluster"
                  values={options.clusters}
                  selected={draft.cluster}
                  onSelect={(value) => update({ cluster: value })}
                />
                {assignedCategory ? (
                  <p className="rounded-md border border-indigo-100 bg-indigo-50/80 px-2.5 py-2 text-xs text-slate-700">
                    <span className="font-semibold uppercase tracking-wide text-indigo-800">Category</span>
                    <span className="mt-0.5 block font-medium text-slate-900">{assignedCategory}</span>
                    <span className="mt-0.5 block text-slate-500">Set automatically from the selected cluster.</span>
                  </p>
                ) : null}
                <MultiSelect
                  title="Target"
                  values={options.targets}
                  selected={draft.targets}
                  onToggle={(value) => toggleList('targets', value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-5 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEditing ? 'Save changes' : 'Add tool idea'}
            </button>
          </form>
        </div>
      </div>,
      document.body,
    )

  return (
    <>
      <button
        type="button"
        onClick={openCreateModal}
        className="w-full rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-800 transition hover:border-indigo-300 hover:bg-indigo-100"
      >
        Create new tool idea
      </button>

      {ideas.length > 0 && (
        <ul className="mt-3 space-y-3" aria-label="New tool ideas">
          {ideas.map((tool) => (
            <li key={tool.id}>
              <article className="rounded-lg border border-indigo-200 bg-gradient-to-b from-indigo-50/90 to-white p-3 shadow-sm ring-1 ring-indigo-500/10">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">New tool idea</p>
                    <h3 className="mt-1 font-semibold text-slate-900">{tool.name}</h3>
                    {tool.description ? (
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{tool.description}</p>
                    ) : (
                      <p className="mt-1 text-sm italic text-slate-400">No description</p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(tool)}
                      className="rounded border border-indigo-200 bg-white px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(tool.id)}
                      className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      aria-label={`Remove ${tool.name}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <dl className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <div className="rounded-full bg-white px-2 py-0.5 text-slate-700 ring-1 ring-slate-200">
                    <dt className="sr-only">Accessibility</dt>
                    <dd>
                      <span className="font-medium text-slate-500">Accessibility:</span> {tool.accessibility}
                    </dd>
                  </div>
                  <div className="rounded-full bg-white px-2 py-0.5 text-slate-700 ring-1 ring-slate-200">
                    <dt className="sr-only">Cluster</dt>
                    <dd>
                      <span className="font-medium text-slate-500">Cluster:</span> {tool.category}
                    </dd>
                  </div>
                  <div className="rounded-full bg-white px-2 py-0.5 text-slate-700 ring-1 ring-slate-200">
                    <dt className="sr-only">Category</dt>
                    <dd>
                      <span className="font-medium text-slate-500">Category:</span> {tool.layer}
                    </dd>
                  </div>
                  <div className="rounded-full bg-white px-2 py-0.5 text-slate-700 ring-1 ring-slate-200">
                    <dt className="sr-only">Target</dt>
                    <dd>
                      <span className="font-medium text-slate-500">Target:</span> {tool.target}
                    </dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ul>
      )}

      {modal}
    </>
  )
}
