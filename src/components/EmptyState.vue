<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <div class="card text-center text-sm text-slate-500">{{ text }}</div>
</template>
