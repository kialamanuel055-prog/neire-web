import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { uid } from '@/utils/format'
import type { AppNotification } from '@/types'

export const useNotificationsStore = defineStore('notifications', () => {
  const items = usePersistedRef<AppNotification[]>('neire.v1.notifications', () => {
    const now = new Date().toISOString()
    return [
      { id: 'n1', userId: 'u1', title: 'Bem-vindo ao NEIRE', text: 'Completa o teu perfil para receberes melhores oportunidades.', link: '/app/estudante/perfil', read: false, at: now },
      { id: 'n2', userId: 'u3', title: 'Bem-vindo ao NEIRE', text: 'Publica a tua primeira oportunidade para os estudantes do INSTIC.', link: '/app/empresa/oportunidades/nova', read: false, at: now },
    ]
  })

  function notify(userId: string, title: string, text: string, link?: string) {
    items.value.unshift({ id: uid('n'), userId, title, text, link, read: false, at: new Date().toISOString() })
  }

  function forUser(userId: string) {
    return items.value.filter((n) => n.userId === userId)
  }

  function markRead(id: string) {
    const n = items.value.find((x) => x.id === id)
    if (n) n.read = true
  }

  function markAllRead(userId: string) {
    items.value.forEach((n) => {
      if (n.userId === userId) n.read = true
    })
  }

  return { items, notify, forUser, markRead, markAllRead }
})
