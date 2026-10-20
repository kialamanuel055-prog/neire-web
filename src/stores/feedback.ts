import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { uid } from '@/utils/format'
import type { FeedbackEntry } from '@/types'

export interface FeedbackSummary {
  kind: FeedbackEntry['kind']
  targetId: string
  title: string
  count: number
  overall: number
  averages: Record<string, number>
  comments: string[]
}

export const useFeedbackStore = defineStore('feedback', () => {
  const items = usePersistedRef<FeedbackEntry[]>('neire.v1.feedback', () => [])

  function has(kind: FeedbackEntry['kind'], targetId: string, userId: string) {
    return items.value.some((f) => f.kind === kind && f.targetId === targetId && f.userId === userId)
  }

  function submit(data: Omit<FeedbackEntry, 'id' | 'at'>) {
    if (has(data.kind, data.targetId, data.userId)) return null
    const f: FeedbackEntry = { ...data, id: uid('f'), at: new Date().toISOString() }
    items.value.unshift(f)
    return f
  }

  const summary = computed<FeedbackSummary[]>(() => {
    const groups = new Map<string, FeedbackEntry[]>()
    for (const f of items.value) {
      const key = `${f.kind}:${f.targetId}`
      const arr = groups.get(key) ?? []
      arr.push(f)
      groups.set(key, arr)
    }
    return [...groups.values()].map((list) => {
      const first = list[0]!
      const sums: Record<string, number> = {}
      for (const f of list) {
        for (const [k, v] of Object.entries(f.ratings)) sums[k] = (sums[k] ?? 0) + v
      }
      const averages: Record<string, number> = {}
      for (const [k, v] of Object.entries(sums)) averages[k] = v / list.length
      const vals = Object.values(averages)
      const overall = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
      return {
        kind: first.kind,
        targetId: first.targetId,
        title: first.targetTitle,
        count: list.length,
        overall,
        averages,
        comments: list.map((f) => f.comment).filter(Boolean),
      }
    })
  })

  return { items, has, submit, summary }
})
