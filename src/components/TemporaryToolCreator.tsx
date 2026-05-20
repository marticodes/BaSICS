import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Tool } from '../types'
import { uniqueSplitValues, uniqueValues } from '../lib/filtering'

export type TemporaryToolDraft = {
  name: string
  description: string
  accessibilities: string[]
  customization: string
  targets: string[]
}

const emptyDraft = (): TemporaryToolDraft => ({
  name: '',
  description: '',
  accessibilities: [],
  customization: '',
  targets: [],
})

export const buildTemporaryTool = (draft: TemporaryToolDraft): Tool => ({
  id: `temp-${crypto.randomUUID()}`,
  name: draft.name.trim(),
  description: draft.description.trim(),
  accessibility: draft.accessibilities.join(', '),
  customization: draft.customization,
  target: draft.targets.join(', '),
  category: 'Custom',
  layer: 'Custom',
  examplePlatforms: '',
  persistence: '',
  imageUrl: '',
})

type Props = {
  allTools: Tool[]
  tool: Tool | null
  onCreate: (tool: Tool) => void
  onRemove: () => void
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

export const TemporaryToolCreator = ({ allTools, tool, onCreate, onRemove }: Props) => {
  const [showModal, setShowModal] = useState(false)
  const [draft, setDraft] = useState<TemporaryToolDraft>(emptyDraft)

  const options = useMemo(
    () => ({
      customizations: uniqueValues(allTools, 'customization'),
      targets: uniqueSplitValues(allTools, 'target'),
      accessibilities: uniqueSplitValues(allTools, 'accessibility'),
    }),
    [allTools],
  )

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

  const closeModal = () => {
    setDraft(emptyDraft())
    setShowModal(false)
  }

  useEffect(() => {
    if (!showModal) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDraft(emptyDraft())
        setShowModal(false)
      }
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
    if (draft.accessibilities.length === 0 || !draft.customization || draft.targets.length === 0) return

    onCreate(buildTemporaryTool(draft))
    closeModal()
  }

  const canSubmit =
    draft.name.trim().length > 0 &&
    draft.accessibilities.length > 0 &&
    draft.customization.length > 0 &&
    draft.targets.length > 0

  const modal =
    showModal &&
    createPortal(
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-[2px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="temp-tool-dialog-title"
        onClick={closeModal}
      >
        <div
          className="max-h-[min(90vh,640px)] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 id="temp-tool-dialog-title" className="text-lg font-semibold text-slate-900">
                Create temporary tool
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
                  <label htmlFor="temp-tool-name" className={labelClass}>
                    Name
                  </label>
                  <input
                    id="temp-tool-name"
                    value={draft.name}
                    onChange={(e) => update({ name: e.target.value })}
                    className={fieldClass}
                    placeholder="Tool name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="temp-tool-description" className={labelClass}>
                    Description
                  </label>
                  <textarea
                    id="temp-tool-description"
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
                  title="Customization"
                  name="temp-tool-customization"
                  values={options.customizations}
                  selected={draft.customization}
                  onSelect={(value) => update({ customization: value })}
                />
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
              Add tool
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
        onClick={() => setShowModal(true)}
        className="w-full rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-800 transition hover:border-indigo-300 hover:bg-indigo-100"
      >
        Create temporary tool
      </button>

      {tool && (
        <article className="mt-3 rounded-lg border border-indigo-200 bg-gradient-to-b from-indigo-50/90 to-white p-3 shadow-sm ring-1 ring-indigo-500/10">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Temporary tool</p>
              <h3 className="mt-1 font-semibold text-slate-900">{tool.name}</h3>
              {tool.description ? (
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{tool.description}</p>
              ) : (
                <p className="mt-1 text-sm italic text-slate-400">No description</p>
              )}
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="shrink-0 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              aria-label="Remove temporary tool"
            >
              Remove
            </button>
          </div>
          <dl className="mt-2 flex flex-wrap gap-1.5 text-xs">
            <div className="rounded-full bg-white px-2 py-0.5 text-slate-700 ring-1 ring-slate-200">
              <dt className="sr-only">Accessibility</dt>
              <dd>
                <span className="font-medium text-slate-500">Accessibility:</span> {tool.accessibility}
              </dd>
            </div>
            <div className="rounded-full bg-white px-2 py-0.5 text-slate-700 ring-1 ring-slate-200">
              <dt className="sr-only">Customization</dt>
              <dd>
                <span className="font-medium text-slate-500">Customization:</span> {tool.customization}
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
      )}

      {modal}
    </>
  )
}
