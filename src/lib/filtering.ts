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
      if (!inSet(filters.customizations, tool.customization)) return false
      if (!inSet(filters.layers, tool.layer)) return false
      if (!inSet(filters.targets, tool.target)) return false
      if (!inSet(filters.accessibilities, tool.accessibility)) return false
      if (!inSet(filters.persistences, tool.persistence)) return false

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
