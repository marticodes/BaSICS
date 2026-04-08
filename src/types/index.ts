export interface ToolRaw {
  Name: string | null
  Category: string | null
  Customization: string | null
  Description: string | null
  'Example Platforms': string | null
  Layer: string | null
  Target: string | null
  'Tool Accessibility': string | null
  'Tool Persistence': string | null
  imageUrl?: string | null
}

export interface Tool {
  id: string
  name: string
  category: string
  customization: string
  description: string
  examplePlatforms: string
  layer: string
  target: string
  accessibility: string
  persistence: string
  imageUrl: string
}

export interface Filters {
  categories: string[]
  customizations: string[]
  layers: string[]
  targets: string[]
  accessibilities: string[]
  persistences: string[]
  search: string
}

export interface Group {
  id: string
  name: string
  description?: string
  toolIds: string[]
  subgroups: Subgroup[]
  createdAt: string
}

export interface Subgroup {
  id: string
  name: string
  toolIds: string[]
}

export interface FilterPreset {
  id: string
  name: string
  filters: Filters
}
