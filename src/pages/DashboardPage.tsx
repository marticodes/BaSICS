import { useMemo } from 'react'
import {
  AccessibilityDonut,
  CategoryBar,
  CategoryLayerHeatmap,
  CategoryTreemapLike,
  LayerCategoryFlowList,
  MatrixBar,
} from '../components/charts/Charts'
import {
  accessibilityDistribution,
  categoryLayerMatrix,
  categoryCustomizationMatrix,
  customizationDistribution,
  layerCategoryFlow,
  layerDistribution,
  toolsPerCategory,
} from '../lib/aggregations'
import type { Tool } from '../types'

export const DashboardPage = ({ tools }: { tools: Tool[] }) => {
  const categoryData = useMemo(() => toolsPerCategory(tools), [tools])
  const accessData = useMemo(() => accessibilityDistribution(tools), [tools])
  const matrix = useMemo(() => categoryCustomizationMatrix(tools), [tools])
  const customCounts = useMemo(() => customizationDistribution(tools), [tools])
  const layers = useMemo(() => layerDistribution(tools), [tools])
  const layerCategoryData = useMemo(() => categoryLayerMatrix(tools), [tools])
  const flowData = useMemo(() => layerCategoryFlow(tools), [tools])
  const layerKeys = useMemo(() => [...new Set(tools.map((tool) => tool.layer))], [tools])
  const matrixKeys = useMemo(
    () => [...new Set(tools.map((tool) => tool.customization))],
    [tools],
  )

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Overview Dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Total tools" value={tools.length} />
        <Stat label="Clusters" value={new Set(tools.map((tool) => tool.category)).size} />
        <Stat label="Customization levels" value={customCounts.length} />
        <Stat label="Accessibility types" value={accessData.length} />
        <Stat label="Persistence types" value={new Set(tools.map((t) => t.persistence)).size} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Tools per cluster"><CategoryBar data={categoryData as { category: string; value: number }[]} /></ChartCard>
        <ChartCard title="Accessibility distribution"><AccessibilityDonut data={accessData as { accessibility: string; value: number }[]} /></ChartCard>
        <ChartCard title="Cluster vs customization"><MatrixBar data={matrix} keys={matrixKeys} /></ChartCard>
        <ChartCard title="Category distribution"><CategoryBar data={layers.map((r) => ({ category: r.layer as string, value: r.value }))} /></ChartCard>
        {/* <ChartCard title="Cluster x category heatmap"><CategoryLayerHeatmap data={layerCategoryData} layers={layerKeys} /></ChartCard> */}
        {/* <ChartCard title="Cluster treemap (option)"><CategoryTreemapLike data={categoryData as { category: string; value: number }[]} /></ChartCard> */}
        {/* <ChartCard title="Category -> cluster flow (option)"><LayerCategoryFlowList data={flowData} /></ChartCard> */}
      </div>
    </section>
  )
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-2xl font-semibold text-slate-900">{value}</p>
  </article>
)

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="mb-2 font-semibold text-slate-900">{title}</h2>
    {children}
  </article>
)
