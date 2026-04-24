import { NavLink } from 'react-router-dom'

const links = [
  ['/', 'Dashboard'],
  ['/legend', 'Legend'],
  ['/layers', 'Categories'],
  ['/map', 'Tool Map'],
]

export const TopNav = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3" aria-label="Main">
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
      </nav>
    </header>
  )
}
