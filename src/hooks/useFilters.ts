import { useMemo, useState } from 'react'
import type { FilterPreset, Filters, Tool } from '../types'
import { createDefaultFilters, filterTools, uniqueSplitValues, uniqueValues } from '../lib/filtering'
import { loadPresets, savePresets } from '../lib/storage'

export const useFilters = (tools: Tool[]) => {
  const [filters, setFilters] = useState<Filters>(createDefaultFilters)
  const [presets, setPresets] = useState<FilterPreset[]>(() => loadPresets())

  const filteredTools = useMemo(() => filterTools(tools, filters), [tools, filters])

  const options = useMemo(
    () => ({
      categories: uniqueValues(tools, 'category'),
      targets: uniqueSplitValues(tools, 'target'),
      accessibilities: uniqueSplitValues(tools, 'accessibility'),
    }),
    [tools],
  )

  const toggle = (key: Exclude<keyof Filters, 'search'>, value: string) => {
    setFilters((prev) => {
      const next = prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value]
      return { ...prev, [key]: next }
    })
  }

  const reset = () => setFilters(createDefaultFilters())

  const savePreset = (name: string) => {
    const next = [...presets, { id: crypto.randomUUID(), name, filters }]
    setPresets(next)
    savePresets(next)
  }

  const deletePreset = (id: string) => {
    const next = presets.filter((p) => p.id !== id)
    setPresets(next)
    savePresets(next)
  }

  return {
    filters,
    setFilters,
    filteredTools,
    options,
    toggle,
    reset,
    presets,
    savePreset,
    deletePreset,
  }
}
