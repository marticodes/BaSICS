import type { Tool } from '../types'

export const downloadNewToolIdeas = (ideas: Tool[]) => {
  if (ideas.length === 0) return

  const payload = {
    exportedAt: new Date().toISOString(),
    newToolIdeas: ideas.map((tool) => ({
      name: tool.name,
      description: tool.description,
      layer: tool.layer,
      accessibility: tool.accessibility,
      target: tool.target,
      category: tool.category,
    })),
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  anchor.href = url
  anchor.download = `basics-new-tool-ideas-${date}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}
