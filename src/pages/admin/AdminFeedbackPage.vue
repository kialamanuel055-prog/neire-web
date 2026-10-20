<script setup lang="ts">
import { useFeedbackStore } from '@/stores/feedback'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { feedbackCriteria } from '@/config/content'

const feedback = useFeedbackStore()

function labelOf(key: string) {
  return feedbackCriteria.find((c) => c.key === key)?.label ?? key
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Feedback" subtitle="Médias por critério e comentários dos estudantes." />

    <EmptyState v-if="feedback.summary.length === 0" text="Ainda não há avaliações. Estudantes inscritos em eventos ou formações podem avaliar." />

    <article v-for="g in feedback.summary" :key="g.kind + g.targetId" class="card space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p class="font-semibold text-slate-900">{{ g.title }}</p>
          <p class="text-sm text-slate-500">{{ g.count }} avaliação(ões)</p>
        </div>
        <div class="flex items-center gap-2">
          <StatusBadge :label="g.kind === 'evento' ? 'Evento' : 'Formação'" tone="blue" />
          <span class="text-2xl font-semibold text-slate-900">{{ g.overall.toFixed(1) }}</span>
        </div>
      </div>
      <ul class="grid gap-2 text-sm sm:grid-cols-3">
        <li v-for="(value, key) in g.averages" :key="key" class="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
          <span class="text-slate-600">{{ labelOf(String(key)) }}</span>
          <span class="font-medium text-slate-900">{{ value.toFixed(1) }}</span>
        </li>
      </ul>
      <ul v-if="g.comments.length" class="space-y-1 border-t border-slate-100 pt-3 text-sm text-slate-700">
        <li v-for="(c, i) in g.comments" :key="i">“{{ c }}”</li>
      </ul>
    </article>
  </div>
</template>
