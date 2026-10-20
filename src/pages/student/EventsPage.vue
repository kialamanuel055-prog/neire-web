<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { formatDate } from '@/utils/format'

const auth = useAuthStore()
const events = useEventsStore()
const userId = auth.user!.id
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Eventos" subtitle="Fóruns, workshops, hackathons, visitas técnicas e sessões empresariais." />

    <div class="grid gap-4 lg:grid-cols-2">
      <div v-for="e in events.sorted" :key="e.id" class="card flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <StatusBadge :label="e.type" tone="blue" />
          <span class="text-xs text-slate-500">{{ e.registered.length }}/{{ e.capacity }} inscritos</span>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-slate-900">{{ e.title }}</h2>
          <p class="text-sm text-slate-600">{{ e.description }}</p>
        </div>
        <p class="text-sm text-slate-500">{{ formatDate(e.date) }} às {{ e.time }} · {{ e.location }}</p>
        <div class="mt-auto">
          <button
            v-if="events.isRegistered(e.id, userId)"
            class="btn-secondary"
            @click="events.toggle(e.id, userId)"
          >
            Cancelar inscrição
          </button>
          <button
            v-else
            class="btn-primary"
            :disabled="e.registered.length >= e.capacity"
            @click="events.toggle(e.id, userId)"
          >
            {{ e.registered.length >= e.capacity ? 'Lotado' : 'Inscrever-me' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
