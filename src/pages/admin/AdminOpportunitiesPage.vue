<script setup lang="ts">
import { useOpportunitiesStore } from '@/stores/opportunities'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { opportunityStatusLabels, opportunityTone, typeLabels } from '@/config/labels'
import { formatDate } from '@/utils/format'

const opps = useOpportunitiesStore()
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Oportunidades" subtitle="Valida o que as empresas submetem antes de chegar aos estudantes." />

    <section class="space-y-3">
      <h2 class="font-semibold text-slate-900">Pendentes de validação ({{ opps.pending.length }})</h2>
      <EmptyState v-if="opps.pending.length === 0" text="Não há oportunidades por validar." />
      <div v-for="o in opps.pending" :key="o.id" class="card space-y-3">
        <div>
          <p class="font-semibold text-slate-900">{{ o.title }}</p>
          <p class="text-sm text-slate-500">
            {{ o.companyName }} · {{ typeLabels[o.type] }} · {{ o.vacancies }} vaga(s) · prazo {{ formatDate(o.deadline) }}
          </p>
          <p class="mt-2 text-sm text-slate-700">{{ o.description }}</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-primary" @click="opps.setStatus(o.id, 'publicada')">Aprovar e publicar</button>
          <button class="btn-danger" @click="opps.setStatus(o.id, 'rejeitada')">Rejeitar</button>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="font-semibold text-slate-900">Todas</h2>
      <div class="card overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="text-xs uppercase text-slate-500">
            <tr>
              <th class="pb-2">Título</th>
              <th class="pb-2">Empresa</th>
              <th class="pb-2">Prazo</th>
              <th class="pb-2">Estado</th>
              <th class="pb-2" />
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="o in opps.items" :key="o.id">
              <td class="py-2 pr-4 font-medium text-slate-900">{{ o.title }}</td>
              <td class="py-2 pr-4 text-slate-600">{{ o.companyName }}</td>
              <td class="py-2 pr-4 text-slate-600">{{ formatDate(o.deadline) }}</td>
              <td class="py-2 pr-4">
                <StatusBadge :label="opportunityStatusLabels[o.status]" :tone="opportunityTone[o.status]" />
              </td>
              <td class="py-2 text-right">
                <button v-if="o.status === 'publicada'" class="text-sm text-brand-600 hover:underline" @click="opps.setStatus(o.id, 'encerrada')">
                  Encerrar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
