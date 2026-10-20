import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { useAuthStore } from '@/stores/auth'
import { uid } from '@/utils/format'
import type { AuditEntry } from '@/types'

export const useAuditStore = defineStore('audit', () => {
  const entries = usePersistedRef<AuditEntry[]>('neire.v1.audit', () => [])

  function log(action: string, detail: string) {
    const auth = useAuthStore()
    entries.value.unshift({
      id: uid('log'),
      at: new Date().toISOString(),
      actor: auth.user?.name ?? 'sistema',
      action,
      detail,
    })
  }

  return { entries, log }
})
