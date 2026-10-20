<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Lightbulb } from 'lucide-vue-next'
import { useChallengesStore } from '@/stores/challenges'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { challengeStatusLabels, challengeTone } from '@/config/labels'
import { formatDate } from '@/utils/format'

const store = useChallengesStore()
const list = computed(() => store.items.filter((c) => c.status === 'ativo' || c.status === 'encerrado'))
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Desafios empresariais" subtitle="Problemas reais propostos por empresas. Forma uma equipa e apresenta a tua solução." />

    <EmptyState v-if="list.length === 0" text="Ainda não há desafios publicados." />

    <div class="grid gap-4 lg:grid-cols-2">
      <RouterLink
        v-for="c in list"
        :key="c.id"
        :to="`/app/estudante/desafios/${c.id}`"
        class="card block space-y-3 transition hover:border-brand-500"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="flex size-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
            <Lightbulb class="size-5" />
          </span>
          <StatusBadge :label="challengeStatusLabels[c.status]" :tone="challengeTone[c.status]" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-slate-900">{{ c.title }}</h2>
          <p class="text-sm text-slate-600">{{ c.companyName }}</p>
        </div>
        <p class="text-xs text-slate-500">
          Prazo: {{ formatDate(c.deadline) }} · Prémio: {{ c.prize }} · {{ store.teamsOf(c.id).length }} equipa(s)
        </p>
      </RouterLink>
    </div>
  </div>
</template>
