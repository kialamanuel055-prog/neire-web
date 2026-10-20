<script setup lang="ts">
withDefaults(defineProps<{ size?: number; text?: boolean; subtitle?: boolean }>(), {
  size: 36,
  text: true,
  subtitle: false,
})
</script>

<template>
  <span class="inline-flex items-center gap-3">
    <svg :width="size" :height="size" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="nl-a" gradientUnits="userSpaceOnUse" x1="6" y1="6" x2="16" y2="42">
          <stop offset="0" stop-color="#ff9d2e" />
          <stop offset="1" stop-color="#f2527a" />
        </linearGradient>
        <linearGradient id="nl-b" gradientUnits="userSpaceOnUse" x1="11" y1="11" x2="37" y2="37">
          <stop offset="0" stop-color="#f2527a" />
          <stop offset="1" stop-color="#8b5cf6" />
        </linearGradient>
        <linearGradient id="nl-c" gradientUnits="userSpaceOnUse" x1="32" y1="6" x2="42" y2="42">
          <stop offset="0" stop-color="#8b5cf6" />
          <stop offset="1" stop-color="#4f7cff" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="10" height="36" rx="5" fill="url(#nl-a)" />
      <path d="M11 11 L37 37" stroke="url(#nl-b)" stroke-width="10" stroke-linecap="round" />
      <rect x="32" y="6" width="10" height="36" rx="5" fill="url(#nl-c)" />
    </svg>
    <span v-if="text" class="leading-tight">
      <span class="block text-xl font-extrabold tracking-wide">NEIRE</span>
      <span v-if="subtitle" class="block max-w-60 text-[11px] font-normal opacity-70">
        Núcleo de Empregabilidade, Inovação e Relações Empresariais do INSTIC
      </span>
    </span>
  </span>
</template>
