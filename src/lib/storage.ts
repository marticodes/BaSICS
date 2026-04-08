import type { FilterPreset, Group } from '../types'

const GROUPS_KEY = 'tool_groups_v1'
const PRESETS_KEY = 'tool_filter_presets_v1'

const read = <T>(key: string, fallback: T): T => {
  try {
    const val = localStorage.getItem(key)
    return val ? (JSON.parse(val) as T) : fallback
  } catch {
    return fallback
  }
}

const write = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const loadGroups = () => read<Group[]>(GROUPS_KEY, [])
export const saveGroups = (groups: Group[]) => write(GROUPS_KEY, groups)

export const loadPresets = () => read<FilterPreset[]>(PRESETS_KEY, [])
export const savePresets = (presets: FilterPreset[]) => write(PRESETS_KEY, presets)
