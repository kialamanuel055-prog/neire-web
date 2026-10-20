<script setup lang="ts">
import { ref } from 'vue'
import { useContentStore } from '@/stores/content'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { formatDate } from '@/utils/format'

const content = useContentStore()
const tab = ref<'news' | 'stories'>('news')
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6 px-4 py-12">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Notícias</h1>
      <p class="mt-2 text-slate-600">Oportunidades, resultados, eventos e histórias de quem passou pelo NEIRE.</p>
    </div>

    <div class="flex gap-2">
      <button :class="tab === 'news' ? 'btn-primary' : 'btn-secondary'" @click="tab = 'news'">Notícias</button>
      <button :class="tab === 'stories' ? 'btn-primary' : 'btn-secondary'" @click="tab = 'stories'">Histórias de impacto</button>
    </div>

    <template v-if="tab === 'news'">
      <EmptyState v-if="content.publishedNews.length === 0" text="Ainda não há notícias publicadas." />
      <article v-for="n in content.publishedNews" :key="n.id" class="card space-y-2">
        <div class="flex items-center gap-2">
          <StatusBadge :label="n.category" tone="blue" />
          <span class="text-xs text-slate-500">{{ formatDate(n.date) }}</span>
        </div>
        <h2 class="text-lg font-semibold text-slate-900">{{ n.title }}</h2>
        <p class="text-slate-600">{{ n.summary }}</p>
        <details v-if="n.body" class="text-sm text-slate-700">
          <summary class="cursor-pointer text-brand-600">Ler mais</summary>
          <p class="mt-2">{{ n.body }}</p>
        </details>
      </article>
    </template>

    <template v-else>
      <EmptyState v-if="content.publishedStories.length === 0" text="Ainda não há histórias publicadas." />
      <article v-for="s in content.publishedStories" :key="s.id" class="card space-y-2">
        <h2 class="text-lg font-semibold text-slate-900">{{ s.title }}</h2>
        <p class="text-sm text-slate-500">{{ s.personName }} · {{ s.role }} · {{ formatDate(s.date) }}</p>
        <p class="text-slate-700">{{ s.story }}</p>
      </article>
    </template>
  </div>
</template>
