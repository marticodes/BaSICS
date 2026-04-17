import rawData from '../../data.json'
import type { Tool, ToolRaw } from '../types'

const UNKNOWN = 'Unknown'

const sampleImages = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&auto=format&fit=crop',
]

const norm = (value: string | null | undefined) => {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : UNKNOWN
}

export const loadTools = (): Tool[] => {
  const rows = rawData as ToolRaw[]
  return rows.map((item, index) => ({
    id: `${norm(item.Name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
    name: norm(item.Name),
    category: norm(item.Category),
    customization: norm(item.Customization),
    description: norm(item.Description),
    examplePlatforms: norm(item['Example Platforms']),
    layer: norm(item.Layer),
    target: norm(item.Target),
    accessibility: norm(item['Tool Accessibility']),
    persistence: norm(item['Tool Persistence']),
    imageUrl: item.imageUrl?.trim() || sampleImages[index % sampleImages.length],
  }))
}

export const UNKNOWN_VALUE = UNKNOWN
