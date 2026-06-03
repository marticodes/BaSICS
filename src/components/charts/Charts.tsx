import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { colorForSegment, paletteColorAt } from '../../lib/chartColors'

const pieSliceLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  value = 0,
}: {
  cx?: number
  cy?: number
  midAngle?: number
  innerRadius?: number
  outerRadius?: number
  value?: number
}) => {
  if (!value) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.52
  const radian = (-midAngle * Math.PI) / 180
  const x = cx + radius * Math.cos(radian)
  const y = cy + radius * Math.sin(radian)
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
      stroke="#0f172a"
      strokeWidth={2}
      paintOrder="stroke"
    >
      {value}
    </text>
  )
}

export const CategoryBar = ({
  data,
  getBarColor,
}: {
  data: { category: string; value: number }[]
  /** When set, overrides default segment colors (e.g. cluster → parent category color). */
  getBarColor?: (category: string, index: number) => string
}) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
      <XAxis dataKey="category" hide />
      <YAxis />
      <Tooltip
        formatter={(value) => [value, 'Tools']}
        labelFormatter={(_, payload) =>
          String((payload?.[0]?.payload as { category?: string } | undefined)?.category ?? '')
        }
      />
      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
        {data.map((row, idx) => (
          <Cell
            key={row.category}
            fill={getBarColor ? getBarColor(row.category, idx) : colorForSegment(row.category, idx)}
          />
        ))}
        <LabelList
          dataKey="value"
          position="top"
          className="fill-slate-800 text-xs font-semibold"
        />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
)

export const AccessibilityDonut = ({ data }: { data: { accessibility: string; value: number }[] }) => (
  <ResponsiveContainer width="100%" height={280}>
    <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="accessibility"
        innerRadius={72}
        outerRadius={118}
        label={pieSliceLabel}
        labelLine={false}
      >
        {data.map((row, idx) => (
          <Cell key={row.accessibility} fill={colorForSegment(row.accessibility, idx)} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
)

/** Donut for arbitrary segments (e.g. selection stats: customization, accessibility). */
export const SelectionPie = ({
  data,
  title,
  compact = false,
}: {
  data: { segment: string; value: number }[]
  title: string
  compact?: boolean
}) => {
  const total = data.reduce((sum, row) => sum + row.value, 0)
  const chartHeight = compact ? 154 : 200
  const innerRadius = compact ? 36 : 48
  const outerRadius = compact ? 58 : 78

  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold text-slate-800">{title}</h3>
      {data.length === 0 ? (
        <p className="text-xs text-slate-500">No data</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="segment"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={1}
                label={pieSliceLabel}
                labelLine={false}
              >
                {data.map((row) => (
                  <Cell key={row.segment} fill={colorForSegment(row.segment)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-1.5 space-y-1 text-xs text-slate-700">
            {data.map((row) => {
              const pct = total > 0 ? Math.round((row.value / total) * 100) : 0
              return (
                <li key={`legend-${row.segment}`} className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: colorForSegment(row.segment) }}
                      aria-hidden
                    />
                    <span>{row.segment}</span>
                  </span>
                  <span className="font-medium text-slate-900">
                    {row.value} ({pct}%)
                  </span>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}

export const MatrixBar = ({ data, keys }: { data: Record<string, string | number>[]; keys: string[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="category" hide />
      <YAxis />
      <Tooltip />
      {keys.map((key, idx) => (
        <Bar key={key} stackId="a" dataKey={key} fill={paletteColorAt(idx)} />
      ))}
    </BarChart>
  </ResponsiveContainer>
)

export const CategoryLayerHeatmap = ({
  data,
  layers,
}: {
  data: Record<string, string | number>[]
  layers: string[]
}) => {
  const maxValue = Math.max(
    1,
    ...data.flatMap((row) => layers.map((layer) => Number(row[layer] ?? 0))),
  )

  return (
    <div className="overflow-auto">
      <table className="min-w-full border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="p-1 text-left">Cluster</th>
            {layers.map((layer) => (
              <th key={layer} className="p-1 text-left">{layer}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={String(row.category)}>
              <td className="whitespace-nowrap p-1 font-medium">{String(row.category)}</td>
              {layers.map((layer) => {
                const value = Number(row[layer] ?? 0)
                const alpha = value === 0 ? 0.06 : 0.15 + (value / maxValue) * 0.8
                return (
                  <td
                    key={`${row.category}-${layer}`}
                    className="rounded p-2 text-center font-semibold"
                    style={{ backgroundColor: `rgba(79,70,229,${alpha})`, color: value > maxValue * 0.65 ? 'white' : '#111827' }}
                  >
                    {value}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const CategoryTreemapLike = ({ data }: { data: { category: string; value: number }[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {data.map((item, idx) => {
        const pct = Math.round((item.value / total) * 100)
        const minHeight = 70 + Math.min(120, pct * 2)
        return (
          <article
            key={item.category}
            className="rounded-lg p-2 text-white"
            style={{ backgroundColor: paletteColorAt(idx), minHeight }}
          >
            <p className="text-xs opacity-90">{item.category}</p>
            <p className="text-xl font-bold">{item.value}</p>
            <p className="text-xs opacity-90">{pct}%</p>
          </article>
        )
      })}
    </div>
  )
}

export const LayerCategoryFlowList = ({
  data,
}: {
  data: { layer: string; category: string; value: number }[]
}) => (
  <ul className="space-y-2">
    {data.slice(0, 16).map((row) => (
      <li key={`${row.layer}-${row.category}`} className="rounded-lg border border-slate-200 p-2">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span>{row.layer} {'->'} {row.category}</span>
          <strong>{row.value}</strong>
        </div>
        <div className="h-2 rounded bg-slate-100">
          <div className="h-2 rounded bg-indigo-500" style={{ width: `${Math.min(100, row.value * 10)}%` }} />
        </div>
      </li>
    ))}
  </ul>
)
