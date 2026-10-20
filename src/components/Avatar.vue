<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ name: string; size?: 'sm' | 'md' | 'lg'; square?: boolean }>(), {
  size: 'md',
  square: false,
})

const gradients = [
  'from-orange-400 to-pink-500',
  'from-pink-500 to-purple-500',
  'from-purple-500 to-blue-500',
  'from-blue-500 to-cyan-400',
]
const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-12 text-base' }

const initials = computed(() =>
  props.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join(''),
)
const gradient = computed(() => {
  let h = 0
  for (const ch of props.name) h = (h * 31 + ch.charCodeAt(0)) % 997
  return gradients[h % gradients.length]
})
</script>

<template>
  <span
    :class="[
      'inline-flex shrink-0 items-center justify-center bg-linear-to-br font-bold text-white',
      gradient,
      sizes[size],
      square ? 'rounded-xl' : 'rounded-full',
    ]"
  >
    {{ initials }}
  </span>
</template>
