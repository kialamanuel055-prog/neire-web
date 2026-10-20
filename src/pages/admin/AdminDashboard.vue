<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useProfilesStore } from '@/stores/profiles'
import { useCompaniesStore } from '@/stores/companies'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useApplicationsStore } from '@/stores/applications'
import { useEventsStore } from '@/stores/events'
import StatCard from '@/components/StatCard.vue'

const profiles = useProfilesStore()
const companies = useCompaniesStore()
const opps = useOpportunitiesStore()
const apps = useApplicationsStore()
const events = useEventsStore()

const activeCompanies = computed(() => companies.items.filter((c) => c.status === 'ativa' || c.status === 'verificada').length)
const placed = computed(() => apps.items.filter((a) => a.status === 'selecionado').length)
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Painel Administrativo</h1>
      <p class="text-slate-500">Indicadores gerais do NEIRE.</p>
    </div>

    <RouterLink
      v-if="opps.pending.length > 0"
      to="/app/admin/oportunidades"
      class="card block border-amber-300 bg-amber-50 text-sm text-amber-800 hover:bg-amber-100"
    >
      Tens {{ opps.pending.length }} oportunidade(s) à espera de validação. Rever agora →
    </RouterLink>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard label="Estudantes e Alumni" :value="profiles.items.length" hint="perfis registados" />
      <StatCard label="Empresas" :value="activeCompanies" :hint="`${companies.items.length} registadas`" />
      <StatCard label="Oportunidades" :value="opps.published.length" hint="publicadas" />
      <StatCard label="Candidaturas" :value="apps.items.length" />
      <StatCard label="Selecionados" :value="placed" hint="candidaturas com sucesso" />
      <StatCard label="Eventos" :value="events.items.length" />
    </div>
    <!-- ANCHOR:admin-dashboard-sections -->
  </div>
</template>
