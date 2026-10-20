<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import { formatDateTime } from '@/utils/format'

const auth = useAuthStore()
const store = useNotificationsStore()
const userId = auth.user!.id
const mine = computed(() => store.forUser(userId))
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <PageHeader title="Notificações" subtitle="Novidades sobre oportunidades, candidaturas e certificados.">
      <button class="btn-secondary" @click="store.markAllRead(userId)">Marcar todas como lidas</button>
    </PageHeader>

    <EmptyState v-if="mine.length === 0" text="Ainda não tens notificações." />

    <div v-for="n in mine" :key="n.id" :class="['card', n.read ? '' : 'border-brand-500 bg-brand-50']">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p class="font-medium text-slate-900">{{ n.title }}</p>
          <p class="text-sm text-slate-600">{{ n.text }}</p>
          <p class="mt-1 text-xs text-slate-400">{{ formatDateTime(n.at) }}</p>
        </div>
        <div class="flex gap-3 text-sm">
          <RouterLink v-if="n.link" :to="n.link" class="text-brand-600 hover:underline" @click="store.markRead(n.id)">Abrir</RouterLink>
          <button v-if="!n.read" class="text-slate-500 hover:underline" @click="store.markRead(n.id)">Marcar como lida</button>
        </div>
      </div>
    </div>
  </div>
</template>
