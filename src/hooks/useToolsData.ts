import { useMemo } from 'react'
import { loadTools } from '../data/loader'

export const useToolsData = () => {
  return useMemo(() => loadTools(), [])
}
