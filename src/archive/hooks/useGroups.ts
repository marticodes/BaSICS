import { useMemo, useState } from 'react'
import type { Group } from '../../types'
import { loadGroups, saveGroups } from '../../lib/storage'

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>(() => loadGroups())

  const persist = (next: Group[]) => {
    setGroups(next)
    saveGroups(next)
  }

  const createGroup = (name: string, description = '') => {
    const next = [
      ...groups,
      {
        id: crypto.randomUUID(),
        name,
        description,
        toolIds: [],
        subgroups: [],
        createdAt: new Date().toISOString(),
      },
    ]
    persist(next)
  }

  const deleteGroup = (id: string) => persist(groups.filter((group) => group.id !== id))

  const addToolToGroup = (groupId: string, toolId: string) => {
    persist(
      groups.map((group) =>
        group.id !== groupId || group.toolIds.includes(toolId)
          ? group
          : { ...group, toolIds: [...group.toolIds, toolId] },
      ),
    )
  }

  const removeToolFromGroup = (groupId: string, toolId: string) => {
    persist(
      groups.map((group) =>
        group.id !== groupId
          ? group
          : { ...group, toolIds: group.toolIds.filter((id) => id !== toolId) },
      ),
    )
  }

  const createSubgroup = (groupId: string, name: string) => {
    persist(
      groups.map((group) =>
        group.id !== groupId
          ? group
          : {
              ...group,
              subgroups: [...group.subgroups, { id: crypto.randomUUID(), name, toolIds: [] }],
            },
      ),
    )
  }

  const addToolToSubgroup = (groupId: string, subgroupId: string, toolId: string) => {
    persist(
      groups.map((group) =>
        group.id !== groupId
          ? group
          : {
              ...group,
              subgroups: group.subgroups.map((subgroup) =>
                subgroup.id !== subgroupId || subgroup.toolIds.includes(toolId)
                  ? subgroup
                  : { ...subgroup, toolIds: [...subgroup.toolIds, toolId] },
              ),
            },
      ),
    )
  }

  const lookup = useMemo(() => new Map(groups.map((group) => [group.id, group])), [groups])

  return {
    groups,
    lookup,
    createGroup,
    deleteGroup,
    addToolToGroup,
    removeToolFromGroup,
    createSubgroup,
    addToolToSubgroup,
  }
}
