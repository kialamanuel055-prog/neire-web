<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMentorshipStore } from '@/stores/mentorship'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { mentorshipStatusLabels, mentorshipTone } from '@/config/labels'
import { formatDate } from '@/utils/format'

const auth = useAuthStore()
const store = useMentorshipStore()
const userId = auth.user!.id

const sent = computed(() => store.forStudent(userId))
const received = computed(() => store.forMentor(userId))
const isMentor = computed(() => !!store.byUser(userId))
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-8">
    <PageHeader title="Mentoria" subtitle="Os teus pedidos e, se és mentor, os pedidos que recebeste." />

    <section v-if="isMentor" class="space-y-3">
      <h2 class="font-semibold text-slate-900">Pedidos recebidos ({{ received.length }})</h2>
      <EmptyState v-if="received.length === 0" text="Ainda não recebeste pedidos." />
      <div v-for="r in received" :key="r.id" class="card space-y-3">
        <div class="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p class="font-semibold text-slate-900">{{ r.studentName }}</p>
            <p class="text-sm text-slate-700">{{ r.topic }}</p>
            <p class="text-xs text-slate-500">{{ formatDate(r.createdAt) }}</p>
          </div>
          <StatusBadge :label="mentorshipStatusLabels[r.status]" :tone="mentorshipTone[r.status]" />
        </div>
        <p v-if="r.message" class="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{{ r.message }}</p>
        <div v-if="r.status === 'pendente'" class="flex gap-2">
          <button class="btn-primary" @click="store.respond(r.id, 'aceite')">Aceitar</button>
          <button class="btn-danger" @click="store.respond(r.id, 'recusada')">Recusar</button>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="font-semibold text-slate-900">Os meus pedidos ({{ sent.length }})</h2>
      <EmptyState v-if="sent.length === 0" text="Ainda não pediste mentoria. Procura um mentor em Mentores." />
      <div v-for="r in sent" :key="r.id" class="card flex flex-wrap items-start justify-between gap-2">
        <div>
          <p class="font-semibold text-slate-900">{{ r.mentorName }}</p>
          <p class="text-sm text-slate-700">{{ r.topic }}</p>
          <p class="text-xs text-slate-500">{{ formatDate(r.createdAt) }}</p>
        </div>
        <StatusBadge :label="mentorshipStatusLabels[r.status]" :tone="mentorshipTone[r.status]" />
      </div>
    </section>
  </div>
</template>
