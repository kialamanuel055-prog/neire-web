import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { seedOpportunities } from '@/mocks/seed'
import { opportunityStatusLabels } from '@/config/labels'
import { useAuditStore } from '@/stores/audit'
import { useNotificationsStore } from '@/stores/notifications'
import { useProfilesStore } from '@/stores/profiles'
import { uid } from '@/utils/format'
import type { Opportunity, OpportunityStatus } from '@/types'

export const useOpportunitiesStore = defineStore('opportunities', () => {
  const items = usePersistedRef<Opportunity[]>('neire.v1.opportunities', () => structuredClone(seedOpportunities))
  const audit = useAuditStore()
  const notifications = useNotificationsStore()
  const profiles = useProfilesStore()

  const published = computed(() => items.value.filter((o) => o.status === 'publicada'))
  const pending = computed(() => items.value.filter((o) => o.status === 'pendente'))

  function byId(id: string) {
    return items.value.find((o) => o.id === id)
  }

  function byCompany(companyId: string) {
    return items.value.filter((o) => o.companyId === companyId)
  }

  function create(data: Omit<Opportunity, 'id' | 'status' | 'createdAt'>) {
    const opp: Opportunity = { ...data, id: uid('o'), status: 'pendente', createdAt: new Date().toISOString() }
    items.value.unshift(opp)
    audit.log('Oportunidade submetida', `${opp.title} (${opp.companyName})`)
    return opp
  }

  function setStatus(id: string, status: OpportunityStatus) {
    const opp = byId(id)
    if (!opp || opp.status === status) return
    opp.status = status
    audit.log(`Oportunidade: ${opportunityStatusLabels[status]}`, opp.title)

    if (status === 'publicada') {
      notifications.notify(opp.companyId, 'Oportunidade aprovada', `"${opp.title}" já está visível aos estudantes.`, '/app/empresa/oportunidades')
      for (const p of profiles.items) {
        notifications.notify(p.userId, 'Nova oportunidade', `${opp.title} · ${opp.companyName}`, `/app/estudante/oportunidades/${opp.id}`)
      }
    } else if (status === 'rejeitada') {
      notifications.notify(opp.companyId, 'Oportunidade rejeitada', `"${opp.title}" não foi aprovada pelo NEIRE.`, '/app/empresa/oportunidades')
    }
  }

  return { items, published, pending, byId, byCompany, create, setStatus }
})
