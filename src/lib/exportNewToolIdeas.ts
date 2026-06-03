import type { Tool } from '../types'

const toolExportRow = (tool: Tool) => ({
  id: tool.id,
  name: tool.name,
  description: tool.description,
  cluster: tool.category,
  category: tool.layer,
  accessibility: tool.accessibility,
  target: tool.target,
})

export const downloadToolMapExport = (ideas: Tool[], selectedTools: Tool[]) => {
  if (ideas.length === 0 && selectedTools.length === 0) return

  const payload = {
    exportedAt: new Date().toISOString(),
    selectedTools: selectedTools.map(toolExportRow),
    newToolIdeas: ideas.map(toolExportRow),
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  anchor.href = url
  anchor.download = `basics-tool-map-export-${date}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}
