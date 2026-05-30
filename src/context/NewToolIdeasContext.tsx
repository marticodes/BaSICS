import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Tool } from '../types'

type NewToolIdeasContextValue = {
  ideas: Tool[]
  addIdea: (tool: Tool) => void
  updateIdea: (tool: Tool) => void
  removeIdea: (id: string) => void
}

const NewToolIdeasContext = createContext<NewToolIdeasContextValue | null>(null)

export const NewToolIdeasProvider = ({ children }: { children: ReactNode }) => {
  const [ideas, setIdeas] = useState<Tool[]>([])

  const addIdea = useCallback((tool: Tool) => {
    setIdeas((prev) => [...prev, tool])
  }, [])

  const updateIdea = useCallback((tool: Tool) => {
    setIdeas((prev) => prev.map((item) => (item.id === tool.id ? tool : item)))
  }, [])

  const removeIdea = useCallback((id: string) => {
    setIdeas((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const value = useMemo(
    () => ({ ideas, addIdea, updateIdea, removeIdea }),
    [ideas, addIdea, updateIdea, removeIdea],
  )

  return <NewToolIdeasContext.Provider value={value}>{children}</NewToolIdeasContext.Provider>
}

export const useNewToolIdeas = (): NewToolIdeasContextValue => {
  const ctx = useContext(NewToolIdeasContext)
  if (!ctx) {
    throw new Error('useNewToolIdeas must be used within NewToolIdeasProvider')
  }
  return ctx
}
