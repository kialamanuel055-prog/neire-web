import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { complaintStatusLabels } from '@/config/labels'
import { useAuditStore } from '@/stores/audit'
import { useNotificationsStore } from '@/stores/notifications'
import { uid } from '@/utils/format'
import type { Complaint, ComplaintStatus } from '@/types'

export const useComplaintsStore = defineStore('complaints', () => {
  const items = usePersistedRef<Complaint[]>('neire.v1.complaints', () => [])
  const audit = useAuditStore()
  const notifications = useNotificationsStore()

  // Nao regista na auditoria no momento do envio, para nao expor denuncias anonimas.
  function submit(data: { category: string; description: string; author?: { id: string; name: string } }) {
    const c: Complaint = {
      id: uid('dn'),
      category: data.category,
      description: data.description,
      status: 'recebida',
      createdAt: new Date().toISOString(),
    }
    if (data.author) {
      c.authorId = data.author.id
      c.authorName = data.author.name
    }
    items.value.unshift(c)
    notifications.notify('u4', 'Nova denúncia recebida', c.category, '/app/admin/denuncias')
    return c
  }

  function forAuthor(userId: string) {
    return items.value.filter((c) => c.authorId === userId)
  }

  function setStatus(id: string, status: ComplaintStatus, response: string) {
    const c = items.value.find((x) => x.id === id)
    if (!c) return
    c.status = status
    if (response.trim()) c.response = response.trim()
    audit.log(`Denúncia: ${complaintStatusLabels[status]}`, c.category)
    if (c.authorId) {
      notifications.notify(c.authorId, 'Denúncia atualizada', `A tua denúncia está agora: ${complaintStatusLabels[status]}.`, '/app/denuncias')
    }
  }

  return { items, submit, forAuthor, setStatus }
})
