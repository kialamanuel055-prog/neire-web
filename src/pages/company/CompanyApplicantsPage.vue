<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useApplicationsStore } from '@/stores/applications'
import { useProfilesStore } from '@/stores/profiles'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { applicationStatusLabels, skillLevelLabels, skillTone } from '@/config/labels'
import { formatDate } from '@/utils/format'
import type { ApplicationStatus } from '@/types'

const auth = useAuthStore()
const opps = useOpportunitiesStore()
const apps = useApplicationsStore()
const profiles = useProfilesStore()

const received = computed(() => {
  const ids = new Set(opps.byCompany(auth.user!.id).map((o) => o.id))
  return apps.items.filter((a) => ids.has(a.opportunityId))
})

function onStatus(id: string, e: Event) {
  apps.setStatus(id, (e.target as HTMLSelectElement).value as ApplicationStatus)
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Candidaturas recebidas" subtitle="Avalia os candidatos e atualiza o estado de cada processo." />

    <EmptyState v-if="received.length === 0" text="Ainda não recebeste candidaturas." />

    <div v-for="a in received" :key="a.id" class="card space-y-3">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="font-semibold text-slate-900">{{ a.studentName }}</p>
          <p class="text-sm text-slate-500">
            {{ opps.byId(a.opportunityId)?.title }} · {{ formatDate(a.createdAt) }}
          </p>
          <p v-if="profiles.byUser(a.studentId)" class="text-sm text-slate-500">
            {{ profiles.byUser(a.studentId)?.course }} · {{ profiles.byUser(a.studentId)?.year }}
          </p>
        </div>
        <select class="input max-w-52" :value="a.status" @change="onStatus(a.id, $event)">
          <option v-for="(label, key) in applicationStatusLabels" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>

      <ul v-if="profiles.byUser(a.studentId)" class="flex flex-wrap gap-2">
        <li v-for="s in profiles.byUser(a.studentId)?.skills" :key="s.name" class="flex items-center gap-1 text-xs">
          {{ s.name }} <StatusBadge :label="skillLevelLabels[s.level]" :tone="skillTone[s.level]" />
        </li>
      </ul>
      <p v-if="a.message" class="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{{ a.message }}</p>
    </div>
  </div>
</template>
