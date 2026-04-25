import { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ActiveFilterChips } from './components/ActiveFilterChips'
import { FilterSidebar } from './components/layout/FilterSidebar'
import { TopNav } from './components/layout/TopNav'
import { useFilters } from './hooks/useFilters'
import { useToolsData } from './hooks/useToolsData'
import { DashboardPage } from './pages/DashboardPage'
import { LayerExplorerPage } from './pages/LayerExplorerPage'
import { PageTestPage } from './pages/PageTestPage'
import { LegendPage } from './pages/LegendPage'
import { ToolDetailPage } from './pages/ToolDetailPage'
import { ToolMapPage } from './pages/ToolMapPage'

function App() {
  const [showFilters, setShowFilters] = useState(false)
  const tools = useToolsData()
  const {
    filters,
    setFilters,
    filteredTools,
    options,
    toggle,
    reset,
    presets,
    savePreset,
    deletePreset,
  } = useFilters(tools)

  const isLoading = tools.length === 0
  const mainTools = useMemo(() => filteredTools, [filteredTools])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopNav />
      <div className="mx-auto max-w-7xl px-4 py-4">
        <main className="relative">
          <section className="sticky top-[66px] z-20 mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <input
                aria-label="Search tools"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Search by name or description"
                className="min-w-[220px] flex-1 rounded-md border border-slate-300 px-3 py-2"
              />
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="rounded bg-slate-900 px-3 py-2 text-sm text-white"
                aria-expanded={showFilters}
                aria-controls="optional-filters"
              >
                {showFilters ? 'Hide filters' : 'Show filters'}
              </button>
              <button
                onClick={() => {
                  const name = window.prompt('Preset name')
                  if (name?.trim()) savePreset(name.trim())
                }}
                className="rounded bg-indigo-600 px-3 py-2 text-sm text-white"
              >
                Save preset
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setFilters(preset.filters)}
                  className="rounded bg-slate-100 px-2 py-1 text-xs"
                  title="Apply preset"
                >
                  {preset.name}
                </button>
              ))}
              {presets.map((preset) => (
                <button key={`${preset.id}-delete`} onClick={() => deletePreset(preset.id)} className="text-xs text-rose-600" title={`Delete ${preset.name}`}>
                  x
                </button>
              ))}
            </div>
            <ActiveFilterChips
              filters={filters}
              onRemove={(key, value) => toggle(key, value)}
            />
          </section>
          {showFilters && (
            <div id="optional-filters" className="absolute right-0 top-[102px] z-30 w-full max-w-[300px]">
              <FilterSidebar
                filters={filters}
                options={options}
                toggle={toggle}
                setSearch={(search) => setFilters((prev) => ({ ...prev, search }))}
                reset={reset}
                showSearch={false}
                className="max-h-[min(65vh,460px)] overflow-y-auto"
              />
            </div>
          )}

          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6">Loading tools...</div>
          ) : mainTools.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-slate-500">No tools match these filters yet. Try clearing one filter.</div>
          ) : (
            <Routes>
              <Route path="/" element={<DashboardPage tools={mainTools} />} />
              <Route path="/legend" element={<LegendPage />} />
              <Route path="/layers" element={<LayerExplorerPage tools={mainTools} allTools={tools} />} />
              <Route path="/categories" element={<Navigate to="/layers" replace />} />
              <Route path="/map" element={<ToolMapPage tools={mainTools} allTools={tools} />} />
              <Route path="/page-test" element={<PageTestPage tools={mainTools} allTools={tools} />} />
              <Route path="/tool/:toolId" element={<ToolDetailPage tools={tools} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
