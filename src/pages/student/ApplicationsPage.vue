<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApplicationsStore } from '@/stores/applications'
import { useOpportunitiesStore } from '@/stores/opportunities'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import ApplicationStepper from '@/components/ApplicationStepper.vue'
import { applicationStatusLabels, applicationTone } from '@/config/labels'
import { formatDate } from '@/utils/format'

const auth = useAuthStore()
const apps = useApplicationsStore()
const opps = useOpportunitiesStore()

const mine = computed(() => (auth.user ? apps.forStudent(auth.user.id) : []))
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="As minhas candidaturas" subtitle="Acompanha o estado de cada processo." />

    <EmptyState v-if="mine.length === 0" text="Ainda não te candidataste a nenhuma oportunidade." />

    <div v-for="a in mine" :key="a.id" class="card space-y-3">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div>
          <RouterLink
            :to="`/app/estudante/oportunidades/${a.opportunityId}`"
            class="text-lg font-semibold text-slate-900 hover:text-brand-600"
          >
            {{ opps.byId(a.opportunityId)?.title ?? 'Oportunidade removida' }}
          </RouterLink>
          <p class="text-sm text-slate-600">{{ opps.byId(a.opportunityId)?.companyName }}</p>
        </div>
        <StatusBadge :label="applicationStatusLabels[a.status]" :tone="applicationTone[a.status]" />
      </div>

      <ApplicationStepper :status="a.status" />

      <ul class="space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <li v-for="(h, i) in a.history" :key="i">
          {{ formatDate(h.at) }} · {{ applicationStatusLabels[h.status] }}
        </li>
      </ul>
    </div>
  </div>
</template>
