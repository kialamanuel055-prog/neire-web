<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useApplicationsStore } from '@/stores/applications'
import { useProfilesStore } from '@/stores/profiles'
import { useEventsStore } from '@/stores/events'
import { useCompaniesStore } from '@/stores/companies'
import StatCard from '@/components/StatCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { companyStatusLabels, companyTone } from '@/config/labels'

const auth = useAuthStore()
const opps = useOpportunitiesStore()
const apps = useApplicationsStore()
const profiles = useProfilesStore()
const events = useEventsStore()
const companies = useCompaniesStore()

const company = computed(() => companies.byId(auth.user!.id))
const mine = computed(() => opps.byCompany(auth.user!.id))
const published = computed(() => mine.value.filter((o) => o.status === 'publicada').length)
const received = computed(() => {
  const ids = new Set(mine.value.map((o) => o.id))
  return apps.items.filter((a) => ids.has(a.opportunityId)).length
})
const talents = computed(() => profiles.items.filter((p) => p.available).length)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">{{ company?.name ?? 'Painel da Empresa' }}</h1>
        <p class="text-slate-500">Resumo da tua atividade no NEIRE.</p>
      </div>
      <StatusBadge v-if="company" :label="companyStatusLabels[company.status]" :tone="companyTone[company.status]" />
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard label="Oportunidades publicadas" :value="published" />
      <StatCard label="Candidaturas" :value="received" />
      <StatCard label="Talentos disponíveis" :value="talents" />
      <StatCard label="Desafios ativos" :value="0" />
      <StatCard label="Eventos" :value="events.items.length" />
    </div>
    <!-- ANCHOR:company-dashboard-sections -->
  </div>
</template>
