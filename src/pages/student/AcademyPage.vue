<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAcademyStore } from '@/stores/academy'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { courseKindLabels } from '@/config/content'
import { formatDate } from '@/utils/format'

const auth = useAuthStore()
const academy = useAcademyStore()
const userId = auth.user!.id

const mine = computed(() => academy.sorted.filter((c) => c.enrolled.includes(userId)))
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Academia NEIRE" subtitle="Cursos, workshops, bootcamps e masterclasses." />

    <section class="space-y-3">
      <h2 class="font-semibold text-slate-900">Formações disponíveis</h2>
      <div class="grid gap-4 lg:grid-cols-2">
        <div v-for="c in academy.sorted" :key="c.id" class="card flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <StatusBadge :label="courseKindLabels[c.kind]" tone="blue" />
            <span class="text-xs text-slate-500">{{ c.enrolled.length }}/{{ c.capacity }} inscritos</span>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900">{{ c.title }}</h3>
            <p class="text-sm text-slate-600">{{ c.description }}</p>
          </div>
          <p class="text-sm text-slate-500">
            {{ formatDate(c.startDate) }} · {{ c.hours }}h · {{ c.instructor }}
          </p>
          <div class="mt-auto">
            <button v-if="c.enrolled.includes(userId)" class="btn-secondary" @click="academy.toggleEnroll(c.id, userId)">
              Cancelar inscrição
            </button>
            <button v-else class="btn-primary" :disabled="c.enrolled.length >= c.capacity" @click="academy.toggleEnroll(c.id, userId)">
              {{ c.enrolled.length >= c.capacity ? 'Lotado' : 'Inscrever-me' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="font-semibold text-slate-900">O meu histórico de formação</h2>
      <EmptyState v-if="mine.length === 0" text="Ainda não te inscreveste em nenhuma formação." />
      <div v-for="c in mine" :key="c.id" class="card flex items-center justify-between gap-3">
        <div>
          <p class="font-medium text-slate-900">{{ c.title }}</p>
          <p class="text-sm text-slate-500">{{ formatDate(c.startDate) }} · {{ c.hours }}h</p>
        </div>
        <StatusBadge
          :label="c.completed.includes(userId) ? 'Concluída' : 'Inscrito'"
          :tone="c.completed.includes(userId) ? 'green' : 'gray'"
        />
      </div>
    </section>
  </div>
</template>
