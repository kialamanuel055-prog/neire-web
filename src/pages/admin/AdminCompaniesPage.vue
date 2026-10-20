<script setup lang="ts">
import { useCompaniesStore } from '@/stores/companies'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { companyFlow, companyStatusLabels, companyTone } from '@/config/labels'

const companies = useCompaniesStore()

function nextLabel(status: string): string | null {
  const i = companyFlow.findIndex((s) => s === status)
  const next = companyFlow[i + 1]
  return next ? companyStatusLabels[next] : null
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Empresas" subtitle="Pendente → Em análise → Verificada → Ativa" />

    <div v-for="c in companies.items" :key="c.id" class="card flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="font-semibold text-slate-900">{{ c.name }}</p>
        <p class="text-sm text-slate-500">{{ c.sector }} · {{ c.website }}</p>
      </div>
      <div class="flex items-center gap-3">
        <StatusBadge :label="companyStatusLabels[c.status]" :tone="companyTone[c.status]" />
        <button v-if="nextLabel(c.status)" class="btn-secondary" @click="companies.advance(c.id)">
          Avançar para {{ nextLabel(c.status) }}
        </button>
      </div>
    </div>
  </div>
</template>
