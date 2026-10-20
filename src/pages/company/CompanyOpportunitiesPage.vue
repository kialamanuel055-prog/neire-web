<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useApplicationsStore } from '@/stores/applications'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { opportunityStatusLabels, opportunityTone, typeLabels } from '@/config/labels'
import { formatDate } from '@/utils/format'

const auth = useAuthStore()
const opps = useOpportunitiesStore()
const apps = useApplicationsStore()

const mine = computed(() => opps.byCompany(auth.user!.id))
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="As minhas oportunidades" subtitle="Vagas, estágios, concursos e programas publicados pela tua empresa.">
      <RouterLink to="/app/empresa/oportunidades/nova" class="btn-primary"><Plus class="size-4" /> Nova oportunidade</RouterLink>
    </PageHeader>

    <EmptyState v-if="mine.length === 0" text="Ainda não publicaste nenhuma oportunidade." />

    <div v-for="o in mine" :key="o.id" class="card flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="font-semibold text-slate-900">{{ o.title }}</p>
        <p class="text-sm text-slate-500">
          {{ typeLabels[o.type] }} · prazo {{ formatDate(o.deadline) }} · {{ apps.forOpportunity(o.id).length }} candidatura(s)
        </p>
      </div>
      <div class="flex items-center gap-3">
        <StatusBadge :label="opportunityStatusLabels[o.status]" :tone="opportunityTone[o.status]" />
        <button v-if="o.status === 'publicada'" class="btn-secondary" @click="opps.setStatus(o.id, 'encerrada')">
          Encerrar
        </button>
      </div>
    </div>
  </div>
</template>
