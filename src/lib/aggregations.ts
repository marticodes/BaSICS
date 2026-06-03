import { formatTargetLabel, splitMultiValue } from './filtering'
import type { Group, Tool } from '../types'

const tally = (values: string[]) => {
  return values.reduce<Record<string, number>>((acc, val) => {
    acc[val] = (acc[val] ?? 0) + 1
    return acc
  }, {})
}

const toRows = (entries: Record<string, number>, key = 'name') =>
  Object.entries(entries)
    .map(([name, value]) => ({ [key]: name, value }))
    .sort((a, b) => (b.value as number) - (a.value as number))

export const toolsPerCategory = (tools: Tool[]) => toRows(tally(tools.map((t) => t.category)), 'category')

export const accessibilityDistribution = (tools: Tool[]) =>
  toRows(tally(tools.map((t) => t.accessibility)), 'accessibility')

export const layerDistribution = (tools: Tool[]) => toRows(tally(tools.map((t) => t.layer)), 'layer')

export const targetDistribution = (tools: Tool[]) =>
  toRows(
    tally(tools.map((t) => formatTargetLabel(t.target)).filter(Boolean)),
    'category',
  ) as { category: string; value: number }[]

export const targetPieSegments = (tools: Tool[]) =>
  targetDistribution(tools).map(({ category, value }) => ({ segment: category, value }))

export const customizationDistribution = (tools: Tool[]) =>
  toRows(tally(tools.map((t) => t.customization)), 'customization')

export const categoryCustomizationMatrix = (tools: Tool[]) => {
  const categories = [...new Set(tools.map((t) => t.category))]
  const customizations = [...new Set(tools.map((t) => t.customization))]

  return categories.map((category) => {
    const row: Record<string, string | number> = { category }
    customizations.forEach((customization) => {
      row[customization] = tools.filter(
        (tool) => tool.category === category && tool.customization === customization,
      ).length
    })
    return row
  })
}

export const categoryLayerMatrix = (tools: Tool[]) => {
  const categories = [...new Set(tools.map((t) => t.category))].sort((a, b) => a.localeCompare(b))
  const layers = [...new Set(tools.map((t) => t.layer))].sort((a, b) => a.localeCompare(b))

  return categories.map((category) => {
    const row: Record<string, string | number> = { category }
    layers.forEach((layer) => {
      row[layer] = tools.filter((tool) => tool.category === category && tool.layer === layer).length
    })
    return row
  })
}

export const layerCategoryFlow = (tools: Tool[]) => {
  const map = new Map<string, number>()
  tools.forEach((tool) => {
    const key = `${tool.layer}|||${tool.category}`
    map.set(key, (map.get(key) ?? 0) + 1)
  })
  return [...map.entries()]
    .map(([key, value]) => {
      const [layer, category] = key.split('|||')
      return { layer, category, value }
    })
    .sort((a, b) => b.value - a.value)
}

const tokensForField = (tool: Tool, key: keyof Tool): string[] => {
  const raw = String(tool[key]).trim()
  if (!raw) return []
  if (key === 'accessibility' || key === 'target') return splitMultiValue(raw)
  return [raw]
}

/** Count tools by a string field (e.g. customization, accessibility) for selection stats. */
export const tallyByField = (tools: Tool[], key: keyof Tool) => {
  const map = new Map<string, number>()
  for (const tool of tools) {
    for (const token of tokensForField(tool, key)) {
      map.set(token, (map.get(token) ?? 0) + 1)
    }
  }
  return [...map.entries()]
    .map(([segment, value]) => ({ segment, value }))
    .sort((a, b) => b.value - a.value)
}

export const summarizeGroup = (group: Group, tools: Tool[]) => {
  const selected = tools.filter((tool) => group.toolIds.includes(tool.id))
  return {
    totalTools: selected.length,
    byCategory: toolsPerCategory(selected),
    byAccessibility: accessibilityDistribution(selected),
  }
}
