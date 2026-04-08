import { describe, expect, it } from 'vitest'
import { filterTools } from '../filtering'
import { toolsPerCategory } from '../aggregations'
import type { Filters, Tool } from '../../types'

const tools: Tool[] = [
  {
    id: 'a',
    name: 'Tool A',
    category: 'Safety',
    customization: 'High',
    description: 'Great for safety checks',
    examplePlatforms: 'Discord',
    layer: 'Boundary',
    target: 'User',
    accessibility: 'Platform',
    persistence: 'Persistent',
    imageUrl: 'x',
  },
  {
    id: 'b',
    name: 'Tool B',
    category: 'Visibility',
    customization: 'Low',
    description: 'Manage profile view',
    examplePlatforms: 'Reddit',
    layer: 'In-Context',
    target: 'Feed',
    accessibility: 'User',
    persistence: 'Temporary',
    imageUrl: 'y',
  },
]

const baseFilters: Filters = {
  categories: [],
  customizations: [],
  layers: [],
  targets: [],
  accessibilities: [],
  persistences: [],
  search: '',
}

describe('filterTools', () => {
  it('filters by category and text search', () => {
    const result = filterTools(tools, {
      ...baseFilters,
      categories: ['Safety'],
      search: 'safety',
    })

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })
})

describe('toolsPerCategory', () => {
  it('returns grouped category totals', () => {
    const result = toolsPerCategory(tools)
    expect(result).toEqual(
      expect.arrayContaining([
        { category: 'Safety', value: 1 },
        { category: 'Visibility', value: 1 },
      ]),
    )
  })
})
