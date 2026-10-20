<script setup lang="ts">
import { computed, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useOpportunitiesStore } from '@/stores/opportunities'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { areas, modalityLabels, typeLabels } from '@/config/labels'
import { formatDate } from '@/utils/format'

const store = useOpportunitiesStore()
const filters = reactive({ q: '', type: '', area: '', modality: '' })

const list = computed(() =>
  store.published
    .filter((o) => {
      const q = filters.q.trim().toLowerCase()
      return (
        (!q || o.title.toLowerCase().includes(q) || o.companyName.toLowerCase().includes(q)) &&
        (!filters.type || o.type === filters.type) &&
        (!filters.area || o.area === filters.area) &&
        (!filters.modality || o.modality === filters.modality)
      )
    })
    .sort((a, b) => a.deadline.localeCompare(b.deadline)),
)
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Oportunidades" subtitle="Estágios, empregos, formações, bolsas e concursos validados pelo NEIRE." />

    <div class="card grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <input v-model="filters.q" class="input" placeholder="Pesquisar por título ou empresa" />
      <select v-model="filters.type" class="input">
        <option value="">Todos os tipos</option>
        <option v-for="(label, key) in typeLabels" :key="key" :value="key">{{ label }}</option>
      </select>
      <select v-model="filters.area" class="input">
        <option value="">Todas as áreas</option>
        <option v-for="a in areas" :key="a" :value="a">{{ a }}</option>
      </select>
      <select v-model="filters.modality" class="input">
        <option value="">Todas as modalidades</option>
        <option v-for="(label, key) in modalityLabels" :key="key" :value="key">{{ label }}</option>
      </select>
    </div>

    <EmptyState v-if="list.length === 0" text="Nenhuma oportunidade encontrada com estes filtros." />

    <div class="grid gap-4 lg:grid-cols-2">
      <RouterLink
        v-for="o in list"
        :key="o.id"
        :to="`/app/estudante/oportunidades/${o.id}`"
        class="card block transition hover:border-brand-500"
      >
        <div class="flex flex-wrap items-center gap-2">
          <StatusBadge :label="typeLabels[o.type]" tone="blue" />
          <StatusBadge :label="modalityLabels[o.modality]" />
          <span class="text-xs text-slate-500">{{ o.area }} · {{ o.level }}</span>
        </div>
        <h2 class="mt-3 text-lg font-semibold text-slate-900">{{ o.title }}</h2>
        <p class="text-sm text-slate-600">{{ o.companyName }}</p>
        <p class="mt-2 text-xs text-slate-500">Prazo: {{ formatDate(o.deadline) }} · {{ o.vacancies }} vaga(s)</p>
      </RouterLink>
    </div>
  </div>
</template>
