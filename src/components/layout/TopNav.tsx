import { NavLink } from 'react-router-dom'
import { useNewToolIdeas } from '../../context/NewToolIdeasContext'
import { downloadNewToolIdeas } from '../../lib/exportNewToolIdeas'

const links = [
  ['/', 'Dashboard'],
  ['/legend', 'Legend'],
  ['/page-test', 'Tool Map'],
]

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-4"
    aria-hidden
  >
    <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 1 0-1.09-1.03l-2.955 3.129V2.75Z" />
    <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
  </svg>
)

export const TopNav = () => {
  const { ideas } = useNewToolIdeas()
  const hasIdeas = ideas.length > 0

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3" aria-label="Main">
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm transition ${
                isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => downloadNewToolIdeas(ideas)}
          disabled={!hasIdeas}
          className="ml-auto flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          title={
            hasIdeas
              ? `Download ${ideas.length} new tool idea${ideas.length === 1 ? '' : 's'} as JSON`
              : 'Create a new tool idea on Tool Map to enable download'
          }
          aria-label={
            hasIdeas
              ? `Download ${ideas.length} new tool ideas`
              : 'Download new tool ideas (none created yet)'
          }
        >
          <DownloadIcon />
        </button>
      </nav>
    </header>
  )
}
