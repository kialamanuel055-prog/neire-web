<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">{{ title }}</h1>
      <p v-if="subtitle" class="text-slate-500">{{ subtitle }}</p>
    </div>
    <div><slot /></div>
  </div>
</template>
