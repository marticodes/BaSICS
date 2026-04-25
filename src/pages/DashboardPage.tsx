import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AccessibilityDonut,
  CategoryBar,
  MatrixBar,
} from '../components/charts/Charts'
import {
  accessibilityDistribution,
  categoryCustomizationMatrix,
  customizationDistribution,
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
  const matrixKeys = useMemo(
    () => [...new Set(tools.map((tool) => tool.customization))],
    [tools],
  )

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Overview Dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Total tools" value={tools.length} />
        <Stat
          label="Clusters"
          value={new Set(tools.map((tool) => tool.category)).size}
          to="/legend?section=clusters"
        />
        <Stat label="Customization levels" value={customCounts.length} to="/legend?section=customization" />
        <Stat label="Accessibility types" value={accessData.length} to="/legend?section=tool-accessibility" />
        <Stat label="Target types" value={new Set(tools.map((t) => t.target)).size} to="/legend?section=target" />
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

const Stat = ({ label, value, to }: { label: string; value: number; to?: string }) => {
  const content = (
    <>
      <p className="text-sm text-slate-500">
        {label}
        {to ? (
          <span
            className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] font-semibold text-slate-500"
            aria-hidden
          >
            i
          </span>
        ) : null}
      </p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </>
  )

  if (!to) {
    return <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">{content}</article>
  }

  return (
    <Link
      to={to}
      aria-label={`${label}: ${value}. Open Legend page`}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {content}
    </Link>
  )
}

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="mb-2 font-semibold text-slate-900">{title}</h2>
    {children}
  </article>
)
