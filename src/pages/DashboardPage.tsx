import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AccessibilityDonut, CategoryBar } from '../components/charts/Charts'
import {
  accessibilityDistribution,
  layerDistribution,
  targetDistribution,
  toolsPerCategory,
} from '../lib/aggregations'
import { InfoTooltip } from '../components/InfoTooltip'
import { legendSectionDescriptionByAnchor } from '../data/legend'
import { layerForCluster } from '../lib/clusterCategoryMap'
import { colorForLayer } from '../lib/chartColors'
import { uniqueTargetLabels } from '../lib/filtering'
import type { Tool } from '../types'

export const DashboardPage = ({ tools }: { tools: Tool[] }) => {
  const clusterData = useMemo(() => toolsPerCategory(tools), [tools])
  const clusterBarColor = useMemo(() => {
    const byCluster = new Map<string, string>()
    return (cluster: string) => {
      let color = byCluster.get(cluster)
      if (!color) {
        color = colorForLayer(layerForCluster(cluster, tools))
        byCluster.set(cluster, color)
      }
      return color
    }
  }, [tools])
  const accessData = useMemo(() => accessibilityDistribution(tools), [tools])
  const categoryData = useMemo(
    () => layerDistribution(tools).map((row) => ({ category: row.layer as string, value: row.value })),
    [tools],
  )
  const targetData = useMemo(() => targetDistribution(tools), [tools])

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Overview Dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Total tools" value={tools.length} />
        <Stat
          label="Clusters"
          value={new Set(tools.map((tool) => tool.category)).size}
          to="/legend?section=clusters"
          tooltip={legendSectionDescriptionByAnchor.clusters}
        />
        <Stat
          label="Categories"
          value={new Set(tools.map((tool) => tool.layer)).size}
          to="/legend?section=category"
          tooltip={legendSectionDescriptionByAnchor.category}
        />
        <Stat
          label="Accessibility types"
          value={accessData.length}
          to="/legend?section=tool-accessibility"
          tooltip={legendSectionDescriptionByAnchor['tool-accessibility']}
        />
        <Stat
          label="Target types"
          value={uniqueTargetLabels(tools).length}
          to="/legend?section=target"
          tooltip={legendSectionDescriptionByAnchor.target}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Tools per cluster">
          <CategoryBar
            data={clusterData as { category: string; value: number }[]}
            getBarColor={(cluster) => clusterBarColor(cluster)}
          />
        </ChartCard>
        <ChartCard title="Accessibility distribution">
          <AccessibilityDonut data={accessData as { accessibility: string; value: number }[]} />
        </ChartCard>
        <ChartCard title="Category distribution">
          <CategoryBar data={categoryData} />
        </ChartCard>
        <ChartCard title="Target distribution">
          <CategoryBar data={targetData} />
        </ChartCard>
      </div>
    </section>
  )
}

const Stat = ({
  label,
  value,
  to,
  tooltip,
}: {
  label: string
  value: number
  to?: string
  tooltip?: string
}) => {
  const content = (
    <>
      <p className="text-sm text-slate-500">
        {label}
        {tooltip ? <InfoTooltip content={tooltip} className="ml-1" /> : null}
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
