import type { Tool } from '../types'

/** BaSICS category (layer) for a cluster, from the most common mapping in the dataset. */
export const layerForCluster = (cluster: string, tools: Tool[]): string => {
  const counts = new Map<string, number>()
  for (const tool of tools) {
    if (tool.category !== cluster) continue
    counts.set(tool.layer, (counts.get(tool.layer) ?? 0) + 1)
  }

  let best = ''
  let max = 0
  for (const [layer, count] of counts) {
    if (count > max) {
      max = count
      best = layer
    }
  }
  return best
}
