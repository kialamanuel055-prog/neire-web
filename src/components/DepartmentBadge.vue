<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDepartment } from '@/composables/useDepartment'

const auth = useAuthStore()
const route = useRoute()
const { department } = useDepartment()

const show = computed(() => auth.user?.role === 'admin')
const blocked = computed(() => (typeof route.query.semAcesso === 'string' ? route.query.semAcesso : ''))
</script>

<template>
  <div v-if="show" class="hidden items-center gap-2 text-xs sm:flex">
    <span class="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">{{ department.name }}</span>
    <span v-if="blocked" class="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-700">
      Sem acesso: {{ blocked }}
    </span>
  </div>
</template>
