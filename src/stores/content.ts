import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { seedNews, seedStories } from '@/mocks/seed2'
import { useAuditStore } from '@/stores/audit'
import { uid } from '@/utils/format'
import type { ImpactStory, NewsItem } from '@/types'

export const useContentStore = defineStore('content', () => {
  const news = usePersistedRef<NewsItem[]>('neire.v1.news', () => structuredClone(seedNews))
  const stories = usePersistedRef<ImpactStory[]>('neire.v1.stories', () => structuredClone(seedStories))
  const audit = useAuditStore()

  const publishedNews = computed(() => news.value.filter((n) => n.published).sort((a, b) => b.date.localeCompare(a.date)))
  const publishedStories = computed(() => stories.value.filter((s) => s.published).sort((a, b) => b.date.localeCompare(a.date)))

  function addNews(data: Omit<NewsItem, 'id'>) {
    news.value.unshift({ ...data, id: uid('n') })
    audit.log('Notícia criada', data.title)
  }

  function addStory(data: Omit<ImpactStory, 'id'>) {
    stories.value.unshift({ ...data, id: uid('h') })
    audit.log('História de impacto criada', data.title)
  }

  function toggleNews(id: string) {
    const n = news.value.find((x) => x.id === id)
    if (!n) return
    n.published = !n.published
    audit.log(n.published ? 'Notícia publicada' : 'Notícia ocultada', n.title)
  }

  function toggleStory(id: string) {
    const s = stories.value.find((x) => x.id === id)
    if (!s) return
    s.published = !s.published
    audit.log(s.published ? 'História publicada' : 'História ocultada', s.title)
  }

  function removeNews(id: string) {
    news.value = news.value.filter((n) => n.id !== id)
  }

  function removeStory(id: string) {
    stories.value = stories.value.filter((s) => s.id !== id)
  }

  return { news, stories, publishedNews, publishedStories, addNews, addStory, toggleNews, toggleStory, removeNews, removeStory }
})
