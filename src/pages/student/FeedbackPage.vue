<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import { useAcademyStore } from '@/stores/academy'
import { useFeedbackStore } from '@/stores/feedback'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { feedbackCriteria } from '@/config/content'
import { formatDate } from '@/utils/format'
import type { FeedbackEntry } from '@/types'

interface Target {
  kind: FeedbackEntry['kind']
  id: string
  title: string
}

const auth = useAuthStore()
const events = useEventsStore()
const academy = useAcademyStore()
const feedback = useFeedbackStore()
const userId = auth.user!.id

const targets = computed<Target[]>(() => [
  ...events.items
    .filter((e) => e.registered.includes(userId))
    .map((e) => ({ kind: 'evento' as const, id: e.id, title: e.title })),
  ...academy.items
    .filter((c) => c.enrolled.includes(userId))
    .map((c) => ({ kind: 'formacao' as const, id: c.id, title: c.title })),
])
const pending = computed(() => targets.value.filter((t) => !feedback.has(t.kind, t.id, userId)))
const done = computed(() => feedback.items.filter((f) => f.userId === userId))

const active = ref<Target | null>(null)
const ratings = reactive<Record<string, number>>({})
const comment = ref('')

function open(t: Target) {
  active.value = t
  for (const c of feedbackCriteria) ratings[c.key] = 5
  comment.value = ''
}

function submit() {
  const t = active.value
  if (!t) return
  feedback.submit({
    kind: t.kind,
    targetId: t.id,
    targetTitle: t.title,
    userId,
    userName: auth.user!.name,
    ratings: { ...ratings },
    comment: comment.value.trim(),
  })
  active.value = null
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-8">
    <PageHeader title="Avaliações" subtitle="A tua opinião ajuda o NEIRE a melhorar eventos e formações." />

    <section class="space-y-3">
      <h2 class="font-semibold text-slate-900">Por avaliar</h2>
      <EmptyState v-if="pending.length === 0" text="Não tens nada por avaliar. Inscreve-te em eventos ou formações." />
      <div v-for="t in pending" :key="t.kind + t.id" class="card space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="font-medium text-slate-900">{{ t.title }}</p>
            <StatusBadge :label="t.kind === 'evento' ? 'Evento' : 'Formação'" tone="blue" />
          </div>
          <button v-if="!active || active.id !== t.id || active.kind !== t.kind" class="btn-primary" @click="open(t)">Avaliar</button>
        </div>

        <form v-if="active && active.id === t.id && active.kind === t.kind" class="space-y-4" @submit.prevent="submit">
          <div class="grid gap-3 sm:grid-cols-2">
            <div v-for="c in feedbackCriteria" :key="c.key">
              <label class="label" :for="'fb-' + c.key">{{ c.label }}</label>
              <select :id="'fb-' + c.key" v-model.number="ratings[c.key]" class="input">
                <option v-for="n in 5" :key="n" :value="n">{{ n }} / 5</option>
              </select>
            </div>
          </div>
          <div>
            <label class="label" for="fb-comment">Comentário (opcional)</label>
            <textarea id="fb-comment" v-model="comment" rows="3" class="input" />
          </div>
          <div class="flex gap-2">
            <button type="submit" class="btn-primary">Enviar avaliação</button>
            <button type="button" class="btn-secondary" @click="active = null">Cancelar</button>
          </div>
        </form>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="font-semibold text-slate-900">Avaliações enviadas</h2>
      <EmptyState v-if="done.length === 0" text="Ainda não enviaste avaliações." />
      <div v-for="f in done" :key="f.id" class="card">
        <p class="font-medium text-slate-900">{{ f.targetTitle }}</p>
        <p class="text-sm text-slate-500">{{ formatDate(f.at) }}</p>
        <p v-if="f.comment" class="mt-2 text-sm text-slate-700">{{ f.comment }}</p>
      </div>
    </section>
  </div>
</template>
