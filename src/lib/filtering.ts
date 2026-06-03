import type { Filters, Tool } from '../types'

export const createDefaultFilters = (): Filters => ({
  categories: [],
  customizations: [],
  layers: [],
  targets: [],
  accessibilities: [],
  persistences: [],
  search: '',
})

const inSet = (selected: string[], value: string) =>
  selected.length === 0 || selected.includes(value)

/** Split compound field values (e.g. `Feed + User`, `Content, User`). */
export const splitMultiValue = (value: string): string[] =>
  value
    .split(/\s*(?:,|\+)\s*/)
    .map((part) => part.trim())
    .filter(Boolean)

/** Single target as-is; multiple targets as sorted `A + B` (for charts and counts). */
export const formatTargetLabel = (value: string): string => {
  const tokens = splitMultiValue(value)
  if (tokens.length === 0) return ''
  if (tokens.length === 1) return tokens[0]
  return [...tokens].sort((a, b) => a.localeCompare(b)).join(' + ')
}

export const uniqueTargetLabels = (tools: Tool[], key: keyof Pick<Tool, 'target'> = 'target'): string[] =>
  [...new Set(tools.map((tool) => formatTargetLabel(tool[key])).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  )

const matchesAnyToken = (selected: string[], value: string) => {
  if (selected.length === 0) return true
  const tokens = splitMultiValue(value).map((token) => token.toLowerCase())
  return selected.some((choice) => tokens.includes(choice.toLowerCase()))
}

export const scoreSearch = (tool: Tool, search: string): number => {
  const q = search.trim().toLowerCase()
  if (!q) return 1

  let score = 0
  if (tool.name.toLowerCase().includes(q)) score += 6
  if (tool.description.toLowerCase().includes(q)) score += 3
  if (tool.category.toLowerCase().includes(q)) score += 2
  return score
}

export const filterTools = (tools: Tool[], filters: Filters): Tool[] => {
  return tools
    .filter((tool) => {
      if (!inSet(filters.categories, tool.category)) return false
      if (!matchesAnyToken(filters.targets, tool.target)) return false
      if (!matchesAnyToken(filters.accessibilities, tool.accessibility)) return false

      if (!filters.search.trim()) return true
      return scoreSearch(tool, filters.search) > 0
    })
    .sort((a, b) => scoreSearch(b, filters.search) - scoreSearch(a, filters.search))
}

export const uniqueValues = (tools: Tool[], key: keyof Tool): string[] => {
  return [...new Set(tools.map((tool) => tool[key] as string))].sort((a, b) =>
    a.localeCompare(b),
  )
}

export const uniqueSplitValues = (tools: Tool[], key: keyof Pick<Tool, 'target' | 'accessibility'>): string[] => {
  const values = tools.flatMap((tool) => splitMultiValue(tool[key]))
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}
