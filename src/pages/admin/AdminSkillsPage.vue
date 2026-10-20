<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useSkillRequestsStore } from '@/stores/skillrequests'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { skillLevelLabels } from '@/config/labels'
import { formatDate } from '@/utils/format'
import type { SkillLevel } from '@/types'

const requests = useSkillRequestsStore()
const pending = computed(() => requests.items.filter((r) => r.status === 'pendente'))
const decided = computed(() => requests.items.filter((r) => r.status !== 'pendente'))

const levels = reactive<Record<string, SkillLevel>>({})
function levelFor(id: string): SkillLevel {
  return levels[id] ?? 'comprovada'
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Verificação de competências" subtitle="Comprovada: há evidência. Validada: confirmada por teste ou avaliação do NEIRE." />

    <section class="space-y-3">
      <h2 class="font-semibold text-slate-900">Pedidos pendentes ({{ pending.length }})</h2>
      <EmptyState v-if="pending.length === 0" text="Não há pedidos por analisar." />
      <div v-for="r in pending" :key="r.id" class="card space-y-3">
        <div>
          <p class="font-semibold text-slate-900">{{ r.userName }} · {{ r.skill }}</p>
          <p class="text-sm text-slate-500">{{ r.evidenceType }} · {{ formatDate(r.at) }}</p>
          <p class="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{{ r.evidence }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <select class="input max-w-48" :value="levelFor(r.id)" @change="levels[r.id] = ($event.target as HTMLSelectElement).value as SkillLevel">
            <option value="comprovada">Comprovada</option>
            <option value="validada">Validada</option>
          </select>
          <button class="btn-primary" @click="requests.decide(r.id, true, levelFor(r.id))">Aprovar</button>
          <button class="btn-danger" @click="requests.decide(r.id, false, 'declarada')">Rejeitar</button>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="font-semibold text-slate-900">Decididos</h2>
      <div v-for="r in decided" :key="r.id" class="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="font-medium text-slate-900">{{ r.userName }} · {{ r.skill }}</p>
          <p class="text-sm text-slate-500">
            {{ r.evidenceType }}
            <template v-if="r.resultLevel"> · {{ skillLevelLabels[r.resultLevel] }}</template>
          </p>
        </div>
        <StatusBadge :label="r.status === 'aprovada' ? 'Aprovada' : 'Rejeitada'" :tone="r.status === 'aprovada' ? 'green' : 'red'" />
      </div>
    </section>
  </div>
</template>
