import type { LegendEntry, LegendSection } from '../data/legend'
import { legendSections } from '../data/legend'

const clustersSection = legendSections.find((s) => s.title === 'Clusters')
const targetSection = legendSections.find((s) => s.title === 'Target')
const sidebarSections = legendSections.filter(
  (s) => s.title !== 'Clusters' && s.title !== 'Target',
)

const LegendTable = ({ section }: { section: LegendSection }) => (
  <article className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
    <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50/80 to-white px-4 py-3">
      <h2 className="text-base font-semibold text-slate-900">{section.title}</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/90">
            <th
              scope="col"
              className="w-[min(11rem,28%)] whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600"
            >
              Name
            </th>
            <th scope="col" className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {section.entries.map((entry: LegendEntry, index: number) => (
            <tr
              key={`${section.title}-${entry.name}`}
              className={`border-b border-slate-100 last:border-b-0 ${
                index % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'
              }`}
            >
              <td className="align-top px-4 py-3 font-medium text-slate-900">{entry.name}</td>
              <td className="align-top px-4 py-3 leading-relaxed text-slate-600">{entry.definition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </article>
)

export const LegendPage = () => {
  if (!clustersSection) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Legend</h1>
        <p className="text-sm text-rose-600">Legend data is missing the Clusters section.</p>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Legend</h1>
        <p className="mt-1 text-sm text-slate-600">
          Definitions used across the dashboard and category views.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
          <div className="min-w-0 lg:col-span-2">
            <LegendTable section={clustersSection} />
          </div>
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-1">
            {sidebarSections.map((section) => (
              <LegendTable key={section.title} section={section} />
            ))}
          </div>
        </div>
        {targetSection ? (
          <div className="min-w-0 w-full">
            <LegendTable section={targetSection} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
