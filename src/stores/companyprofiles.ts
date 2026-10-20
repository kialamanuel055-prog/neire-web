import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import type { CompanyProfile } from '@/types'

export const useCompanyProfilesStore = defineStore('companyProfiles', () => {
  const items = usePersistedRef<CompanyProfile[]>('neire.v1.companyProfiles', () => [])

  function ensure(companyId: string): CompanyProfile {
    const found = items.value.find((p) => p.companyId === companyId)
    if (found) return found
    items.value.push({ companyId, description: '', location: '', areas: '', contactEmail: '', contactPhone: '' })
    return items.value[items.value.length - 1]!
  }

  return { items, ensure }
})
