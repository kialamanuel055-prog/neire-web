<script setup lang="ts">
import { computed } from 'vue'
import type { ApplicationStatus } from '@/types'
import { applicationFlow, applicationStatusLabels } from '@/config/labels'

const props = defineProps<{ status: ApplicationStatus }>()
const currentIndex = computed(() => applicationFlow.indexOf(props.status))
const rejected = computed(() => props.status === 'nao_selecionado')
</script>

<template>
  <div v-if="rejected" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">Não selecionado</div>
  <ol v-else class="flex flex-wrap items-center gap-2 text-xs">
    <li v-for="(step, i) in applicationFlow" :key="step" class="flex items-center gap-2">
      <span
        :class="[
          'rounded-full px-2.5 py-1 font-medium',
          i <= currentIndex ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500',
        ]"
      >
        {{ applicationStatusLabels[step] }}
      </span>
      <span v-if="i < applicationFlow.length - 1" class="text-slate-300">→</span>
    </li>
  </ol>
</template>
