<script setup lang="ts">
import { useChallengesStore } from '@/stores/challenges'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { challengeStatusLabels, challengeTone } from '@/config/labels'
import { formatDate } from '@/utils/format'

const store = useChallengesStore()
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Desafios empresariais" subtitle="Analisa os desafios propostos pelas empresas antes de chegarem aos estudantes." />

    <section class="space-y-3">
      <h2 class="font-semibold text-slate-900">Pendentes de validação ({{ store.pending.length }})</h2>
      <EmptyState v-if="store.pending.length === 0" text="Não há desafios por validar." />
      <div v-for="c in store.pending" :key="c.id" class="card space-y-3">
        <div>
          <p class="font-semibold text-slate-900">{{ c.title }}</p>
          <p class="text-sm text-slate-500">{{ c.companyName }} · prazo {{ formatDate(c.deadline) }} · prémio: {{ c.prize }}</p>
          <p class="mt-2 text-sm text-slate-700">{{ c.problem }}</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-primary" @click="store.setStatus(c.id, 'ativo')">Aprovar e publicar</button>
          <button class="btn-danger" @click="store.setStatus(c.id, 'rejeitado')">Rejeitar</button>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="font-semibold text-slate-900">Todos</h2>
      <div class="card overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="text-xs uppercase text-slate-500">
            <tr>
              <th class="pb-2">Desafio</th>
              <th class="pb-2">Empresa</th>
              <th class="pb-2">Prazo</th>
              <th class="pb-2">Equipas</th>
              <th class="pb-2">Submissões</th>
              <th class="pb-2">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="c in store.items" :key="c.id">
              <td class="py-2 pr-4 font-medium text-slate-900">{{ c.title }}</td>
              <td class="py-2 pr-4 text-slate-600">{{ c.companyName }}</td>
              <td class="py-2 pr-4 text-slate-600">{{ formatDate(c.deadline) }}</td>
              <td class="py-2 pr-4 text-slate-600">{{ store.teamsOf(c.id).length }}</td>
              <td class="py-2 pr-4 text-slate-600">{{ store.submissionsOf(c.id).length }}</td>
              <td class="py-2"><StatusBadge :label="challengeStatusLabels[c.status]" :tone="challengeTone[c.status]" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
