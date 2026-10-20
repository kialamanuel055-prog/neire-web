<script setup lang="ts">
import { useAuditStore } from '@/stores/audit'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import { formatDateTime } from '@/utils/format'

const audit = useAuditStore()
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Trilha de auditoria" subtitle="Quem fez o quê e quando: publicações, aprovações e seleções." />

    <EmptyState v-if="audit.entries.length === 0" text="Ainda não há registos. Aprova uma oportunidade ou altera um estado para ver aqui." />

    <div v-else class="card overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="text-xs uppercase text-slate-500">
          <tr>
            <th class="pb-2">Quando</th>
            <th class="pb-2">Quem</th>
            <th class="pb-2">Ação</th>
            <th class="pb-2">Detalhe</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="e in audit.entries" :key="e.id">
            <td class="py-2 pr-4 whitespace-nowrap text-slate-600">{{ formatDateTime(e.at) }}</td>
            <td class="py-2 pr-4 text-slate-900">{{ e.actor }}</td>
            <td class="py-2 pr-4 text-slate-700">{{ e.action }}</td>
            <td class="py-2 text-slate-600">{{ e.detail }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
