/** Category (layer) colors — aligned with Tool Map cards and legend names. */
export const LAYER_CHART_COLORS: Record<string, string> = {
  Boundary: '#6366f1',
  'Standards & Rules': '#10b981',
  'In-Context': '#f59e0b',
  'Social Infrastructure': '#f43f5e',
}

const chartColors = [
  '#6366f1',
  '#0ea5e9',
  '#14b8a6',
  '#10b981',
  '#84cc16',
  '#f59e0b',
  '#f97316',
  '#f43f5e',
  '#ec4899',
  '#a855f7',
  '#3b82f6',
  '#64748b',
]

/** Normalize dataset / legend spelling differences for layer lookup. */
export const normalizeLayerKey = (layer: string): string =>
  layer
    .trim()
    .toLowerCase()
    .replace(/\s*&\s*/g, ' and ')
    .replace(/\s+/g, ' ')

const layerColorByKey: Record<string, string> = {
  boundary: LAYER_CHART_COLORS.Boundary,
  'standards and rules': LAYER_CHART_COLORS['Standards & Rules'],
  'standards & rules': LAYER_CHART_COLORS['Standards & Rules'],
  'in-context': LAYER_CHART_COLORS['In-Context'],
  'in context': LAYER_CHART_COLORS['In-Context'],
  'social infrastructure': LAYER_CHART_COLORS['Social Infrastructure'],
}

export const colorForLayer = (layer: string): string =>
  layerColorByKey[normalizeLayerKey(layer)] ?? colorForSegment(layer)

export const paletteColorAt = (index: number): string =>
  chartColors[index % chartColors.length]

export const colorForSegment = (segment: string, index?: number): string => {
  const layerColor = layerColorByKey[normalizeLayerKey(segment)]
  if (layerColor) return layerColor
  if (LAYER_CHART_COLORS[segment]) return LAYER_CHART_COLORS[segment]
  if (index !== undefined) return chartColors[index % chartColors.length]
  let hash = 0
  for (let i = 0; i < segment.length; i += 1) {
    hash = (hash << 5) - hash + segment.charCodeAt(i)
    hash |= 0
  }
  return chartColors[Math.abs(hash) % chartColors.length]
}
