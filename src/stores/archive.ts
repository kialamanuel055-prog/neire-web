import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { useAuditStore } from '@/stores/audit'
import { useAuthStore } from '@/stores/auth'
import { uid } from '@/utils/format'
import type { ArchiveDoc } from '@/types'

export const useArchiveStore = defineStore('archive', () => {
  const items = usePersistedRef<ArchiveDoc[]>('neire.v1.archive', () => [
    {
      id: 'ar1',
      title: 'Estatuto do NEIRE',
      category: 'Estatuto',
      description: 'Versão em vigor do estatuto.',
      link: '',
      uploadedBy: 'Admin NEIRE',
      createdAt: '2026-10-01T09:00:00.000Z',
    },
    {
      id: 'ar2',
      title: 'Política de Oportunidades',
      category: 'Regulamento',
      description: 'Critérios, prazos, vagas e métodos de avaliação dos processos geridos pelo NEIRE.',
      link: '',
      uploadedBy: 'Admin NEIRE',
      createdAt: '2026-10-01T09:30:00.000Z',
    },
  ])
  const audit = useAuditStore()

  function add(data: Omit<ArchiveDoc, 'id' | 'uploadedBy' | 'createdAt'>) {
    const auth = useAuthStore()
    const doc: ArchiveDoc = {
      ...data,
      id: uid('ar'),
      uploadedBy: auth.user?.name ?? 'sistema',
      createdAt: new Date().toISOString(),
    }
    items.value.unshift(doc)
    audit.log('Documento arquivado', `${doc.title} (${doc.category})`)
    return doc
  }

  function remove(id: string) {
    const d = items.value.find((x) => x.id === id)
    if (!d) return
    items.value = items.value.filter((x) => x.id !== id)
    audit.log('Documento removido do arquivo', d.title)
  }

  return { items, add, remove }
})
