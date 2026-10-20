import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { seedCompanies } from '@/mocks/seed'
import { companyFlow, companyStatusLabels } from '@/config/labels'
import { useAuditStore } from '@/stores/audit'
import type { Company } from '@/types'

export const useCompaniesStore = defineStore('companies', () => {
  const items = usePersistedRef<Company[]>('neire.v1.companies', () => structuredClone(seedCompanies))
  const audit = useAuditStore()

  function byId(id: string) {
    return items.value.find((c) => c.id === id)
  }

  function advance(id: string) {
    const c = byId(id)
    if (!c) return
    const i = companyFlow.indexOf(c.status)
    if (i < 0 || i >= companyFlow.length - 1) return
    c.status = companyFlow[i + 1]!
    audit.log(`Empresa: ${companyStatusLabels[c.status]}`, c.name)
  }

  return { items, byId, advance }
})
