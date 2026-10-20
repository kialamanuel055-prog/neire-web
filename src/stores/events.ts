import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { seedEvents } from '@/mocks/seed'
import { useAuditStore } from '@/stores/audit'
import { uid } from '@/utils/format'
import type { EventItem } from '@/types'

export const useEventsStore = defineStore('events', () => {
  const items = usePersistedRef<EventItem[]>('neire.v1.events', () => structuredClone(seedEvents))
  const audit = useAuditStore()

  const sorted = computed(() => [...items.value].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)))

  function isRegistered(eventId: string, userId: string) {
    return !!items.value.find((e) => e.id === eventId)?.registered.includes(userId)
  }

  function toggle(eventId: string, userId: string): 'inscrito' | 'cancelado' | 'lotado' | 'inexistente' {
    const ev = items.value.find((e) => e.id === eventId)
    if (!ev) return 'inexistente'
    const i = ev.registered.indexOf(userId)
    if (i >= 0) {
      ev.registered.splice(i, 1)
      return 'cancelado'
    }
    if (ev.registered.length >= ev.capacity) return 'lotado'
    ev.registered.push(userId)
    return 'inscrito'
  }

  function create(data: Omit<EventItem, 'id' | 'registered'>) {
    const ev: EventItem = { ...data, id: uid('e'), registered: [] }
    items.value.push(ev)
    audit.log('Evento criado', ev.title)
    return ev
  }

  return { items, sorted, isRegistered, toggle, create }
})
