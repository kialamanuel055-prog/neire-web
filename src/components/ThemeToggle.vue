<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { theme, set } = useTheme()
</script>

<template>
  <div class="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1" role="group" aria-label="Tema">
    <button
      type="button"
      :class="['rounded-full p-1.5 transition', theme === 'dark' ? 'bg-brand-600 text-white' : 'text-slate-500']"
      aria-label="Tema escuro"
      @click="set('dark')"
    >
      <Moon class="size-4" />
    </button>
    <button
      type="button"
      :class="['rounded-full p-1.5 transition', theme === 'light' ? 'bg-brand-600 text-white' : 'text-slate-500']"
      aria-label="Tema claro"
      @click="set('light')"
    >
      <Sun class="size-4" />
    </button>
  </div>
</template>
