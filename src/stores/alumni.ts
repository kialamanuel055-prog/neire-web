import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { seedGraduates } from '@/mocks/seed2'
import type { GraduateProfile } from '@/types'

export const useAlumniStore = defineStore('alumni', () => {
  const items = usePersistedRef<GraduateProfile[]>('neire.v1.alumni', () => structuredClone(seedGraduates))

  function byUser(userId: string) {
    return items.value.find((g) => g.userId === userId)
  }

  function upsert(g: GraduateProfile) {
    const i = items.value.findIndex((x) => x.userId === g.userId)
    if (i >= 0) items.value[i] = g
    else items.value.push(g)
  }

  return { items, byUser, upsert }
})
