import type { ReactNode } from 'react'

type InfoTooltipProps = {
  content: string
  children?: ReactNode
  className?: string
}

export const InfoTooltip = ({ content, children, className = '' }: InfoTooltipProps) => {
  if (!content.trim()) return <>{children}</>

  return (
    <span
      className={`group/info relative inline-flex align-middle ${className}`}
      onClick={(event) => event.preventDefault()}
      onMouseDown={(event) => event.preventDefault()}
    >
      {children ?? (
        <span
          tabIndex={0}
          className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-[10px] font-semibold text-slate-500 transition group-hover/info:border-indigo-300 group-hover/info:bg-indigo-50 group-hover/info:text-indigo-700 group-focus-within/info:border-indigo-400 group-focus-within/info:ring-2 group-focus-within/info:ring-indigo-500/30"
          aria-label="More information"
        >
          i
        </span>
      )}
      <span
        role="tooltip"
        className="pointer-events-none absolute top-[calc(100%+0.5rem)] left-1/2 z-50 w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-slate-200/80 bg-gradient-to-b from-indigo-50/90 to-white px-3 py-2.5 text-left text-xs leading-relaxed text-slate-600 opacity-0 shadow-md ring-1 ring-slate-900/5 transition-opacity duration-150 group-hover/info:opacity-100 group-focus-within/info:opacity-100"
      >
        <span
          className="absolute bottom-full left-1/2 mb-px h-0 w-0 -translate-x-1/2 border-x-[6px] border-b-[6px] border-x-transparent border-b-slate-200"
          aria-hidden
        />
        <span
          className="absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 border-x-[5px] border-b-[5px] border-x-transparent border-b-white"
          style={{ marginBottom: '1px' }}
          aria-hidden
        />
        {content}
      </span>
    </span>
  )
}
