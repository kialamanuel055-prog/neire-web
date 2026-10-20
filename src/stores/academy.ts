import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { seedCourses } from '@/mocks/seed2'
import { useAuditStore } from '@/stores/audit'
import { uid } from '@/utils/format'
import type { Course } from '@/types'

export const useAcademyStore = defineStore('academy', () => {
  const items = usePersistedRef<Course[]>('neire.v1.courses', () => structuredClone(seedCourses))
  const audit = useAuditStore()

  const sorted = computed(() => [...items.value].sort((a, b) => a.startDate.localeCompare(b.startDate)))

  function toggleEnroll(courseId: string, userId: string): 'inscrito' | 'cancelado' | 'lotado' | 'inexistente' {
    const c = items.value.find((x) => x.id === courseId)
    if (!c) return 'inexistente'
    const i = c.enrolled.indexOf(userId)
    if (i >= 0) {
      c.enrolled.splice(i, 1)
      c.completed = c.completed.filter((u) => u !== userId)
      return 'cancelado'
    }
    if (c.enrolled.length >= c.capacity) return 'lotado'
    c.enrolled.push(userId)
    return 'inscrito'
  }

  function complete(courseId: string, userId: string) {
    const c = items.value.find((x) => x.id === courseId)
    if (!c || !c.enrolled.includes(userId) || c.completed.includes(userId)) return
    c.completed.push(userId)
    audit.log('Formação concluída', `${c.title} (participante ${userId})`)
  }

  function create(data: Omit<Course, 'id' | 'enrolled' | 'completed'>) {
    const c: Course = { ...data, id: uid('k'), enrolled: [], completed: [] }
    items.value.push(c)
    audit.log('Formação criada', c.title)
    return c
  }

  return { items, sorted, toggleEnroll, complete, create }
})
