<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    label: string
    value: string | number
    hint?: string
    icon?: Component
    tone?: 'blue' | 'pink' | 'violet' | 'green' | 'orange'
  }>(),
  { tone: 'violet' },
)

const tones = {
  blue: 'bg-blue-500/15 text-blue-500',
  pink: 'bg-pink-500/15 text-pink-500',
  violet: 'bg-violet-500/15 text-violet-500',
  green: 'bg-emerald-500/15 text-emerald-500',
  orange: 'bg-orange-500/15 text-orange-500',
}
</script>

<template>
  <div class="card flex items-start gap-4">
    <span v-if="icon" :class="['flex size-11 shrink-0 items-center justify-center rounded-xl', tones[tone]]">
      <component :is="icon" class="size-5" />
    </span>
    <div class="min-w-0">
      <p class="text-sm text-slate-500">{{ label }}</p>
      <p class="numeral mt-0.5 text-3xl font-bold text-slate-900">{{ value }}</p>
      <p v-if="hint" class="mt-0.5 text-xs text-slate-400">{{ hint }}</p>
    </div>
  </div>
</template>
