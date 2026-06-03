import { describe, expect, it } from 'vitest'
import { colorForLayer } from '../chartColors'
import { filterTools, formatTargetLabel, splitMultiValue } from '../filtering'
import { targetDistribution, toolsPerCategory } from '../aggregations'
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

describe('colorForLayer', () => {
  it('maps dataset layer spellings to chart colors', () => {
    expect(colorForLayer('Social infrastructure')).toBe('#f43f5e')
    expect(colorForLayer('Standards and rules')).toBe('#10b981')
    expect(colorForLayer('Social Infrastructure')).toBe('#f43f5e')
  })
})

describe('splitMultiValue', () => {
  it('splits comma- and plus-separated values', () => {
    expect(splitMultiValue('Content, User')).toEqual(['Content', 'User'])
    expect(splitMultiValue('Feed + User')).toEqual(['Feed', 'User'])
    expect(splitMultiValue('User +')).toEqual(['User'])
    expect(splitMultiValue('Feed + User, Content')).toEqual(['Feed', 'User', 'Content'])
  })
})

describe('formatTargetLabel', () => {
  it('normalizes multi-target values to a sorted compound label', () => {
    expect(formatTargetLabel('User')).toBe('User')
    expect(formatTargetLabel('Feed + User')).toBe('Feed + User')
    expect(formatTargetLabel('User, Content')).toBe('Content + User')
  })
})

describe('targetDistribution', () => {
  it('counts compound labels and merges equivalent combinations', () => {
    const multi: Tool[] = [
      { ...tools[0], id: 'c', target: 'Feed + User' },
      { ...tools[1], id: 'd', target: 'User, Content' },
      { ...tools[0], id: 'e', target: 'Content + User' },
    ]
    const result = targetDistribution(multi)
    expect(result).toEqual(
      expect.arrayContaining([
        { category: 'Feed + User', value: 1 },
        { category: 'Content + User', value: 2 },
      ]),
    )
    expect(result).toHaveLength(2)
  })
})
