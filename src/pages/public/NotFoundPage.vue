<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="mx-auto max-w-xl px-4 py-24 text-center">
    <p class="text-6xl font-extrabold text-brand-600">404</p>
    <h1 class="mt-4 text-2xl font-bold text-slate-900">Página não encontrada</h1>
    <RouterLink to="/" class="mt-6 inline-block text-brand-600 hover:underline">Voltar ao início</RouterLink>
  </div>
</template>
