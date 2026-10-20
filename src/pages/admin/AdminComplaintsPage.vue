<script setup lang="ts">
import { useComplaintsStore } from '@/stores/complaints'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { complaintStatusLabels, complaintTone } from '@/config/labels'
import { formatDateTime } from '@/utils/format'
import type { ComplaintStatus } from '@/types'

const store = useComplaintsStore()

function onUpdate(id: string, e: Event) {
  const fd = new FormData(e.target as HTMLFormElement)
  store.setStatus(id, String(fd.get('status')) as ComplaintStatus, String(fd.get('response') ?? ''))
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Denúncias" subtitle="Informação confidencial. Acesso restrito à administração." />

    <EmptyState v-if="store.items.length === 0" text="Não há denúncias registadas." />

    <div v-for="c in store.items" :key="c.id" class="card space-y-3">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p class="font-semibold text-slate-900">{{ c.category }}</p>
          <p class="text-xs text-slate-500">
            {{ formatDateTime(c.createdAt) }} · {{ c.authorName ? `Identificada: ${c.authorName}` : 'Anónima' }}
          </p>
        </div>
        <StatusBadge :label="complaintStatusLabels[c.status]" :tone="complaintTone[c.status]" />
      </div>
      <p class="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{{ c.description }}</p>

      <form class="flex flex-wrap items-end gap-2" @submit.prevent="onUpdate(c.id, $event)">
        <div>
          <label class="label" :for="`st-${c.id}`">Estado</label>
          <select :id="`st-${c.id}`" name="status" class="input w-44" :value="c.status">
            <option v-for="(label, key) in complaintStatusLabels" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div class="min-w-48 flex-1">
          <label class="label" :for="`rs-${c.id}`">Resposta / nota</label>
          <input :id="`rs-${c.id}`" name="response" class="input" :value="c.response ?? ''" />
        </div>
        <button type="submit" class="btn-secondary">Guardar</button>
      </form>
    </div>
  </div>
</template>
