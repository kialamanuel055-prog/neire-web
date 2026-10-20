<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Trash2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useChallengesStore } from '@/stores/challenges'
import StatusBadge from '@/components/StatusBadge.vue'
import { challengeStatusLabels, challengeTone } from '@/config/labels'
import { formatDate } from '@/utils/format'

const route = useRoute()
const auth = useAuthStore()
const store = useChallengesStore()
const user = auth.user!

const ch = computed(() => store.byId(String(route.params.id)))
const teams = computed(() => (ch.value ? store.teamsOf(ch.value.id) : []))
const team = computed(() => (ch.value ? store.teamOf(ch.value.id, user.id) : undefined))
const sub = computed(() => (team.value ? store.submissionOf(team.value.id) : undefined))
const open = computed(() => !!ch.value && store.canParticipate(ch.value))
const winnerName = computed(() => teams.value.find((t) => t.id === ch.value?.winnerTeamId)?.name ?? '—')

const teamName = ref('')
const summary = ref('')
const link = ref('')
const feedback = ref('')

function createTeam() {
  if (!ch.value) return
  const name = teamName.value.trim()
  if (!name) {
    feedback.value = 'Indica o nome da equipa.'
    return
  }
  const t = store.createTeam(ch.value.id, { id: user.id, name: user.name }, name)
  feedback.value = t ? 'Equipa criada.' : 'Não foi possível criar a equipa.'
  if (t) teamName.value = ''
}

function join(teamId: string) {
  feedback.value = store.joinTeam(teamId, { id: user.id, name: user.name })
    ? 'Entraste na equipa.'
    : 'Não foi possível entrar (equipa cheia ou já pertences a uma equipa).'
}

function submitWork() {
  if (!team.value) return
  if (!summary.value.trim()) {
    feedback.value = 'Descreve a tua solução.'
    return
  }
  const ok = store.submit(team.value.id, user.id, summary.value.trim(), link.value.trim())
  feedback.value = ok ? 'Submissão enviada.' : 'Não foi possível submeter.'
  if (ok) {
    summary.value = ''
    link.value = ''
  }
}
</script>

<template>
  <div v-if="!ch" class="card text-center">
    <p class="text-slate-600">Desafio não encontrado.</p>
    <RouterLink to="/app/estudante/desafios" class="mt-3 inline-block text-brand-600 hover:underline">Voltar aos desafios</RouterLink>
  </div>

  <div v-else class="mx-auto max-w-3xl space-y-6">
    <RouterLink to="/app/estudante/desafios" class="text-sm text-brand-600 hover:underline">← Voltar aos desafios</RouterLink>

    <div class="card space-y-4">
      <div class="flex items-center justify-between gap-2">
        <p class="text-sm text-slate-600">{{ ch.companyName }}</p>
        <StatusBadge :label="challengeStatusLabels[ch.status]" :tone="challengeTone[ch.status]" />
      </div>
      <h1 class="text-2xl font-bold text-slate-900">{{ ch.title }}</h1>
      <p class="text-slate-700">{{ ch.problem }}</p>

      <div>
        <h2 class="font-semibold text-slate-900">Requisitos</h2>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li v-for="r in ch.requirements" :key="r">{{ r }}</li>
        </ul>
      </div>

      <div v-if="ch.skills.length" class="flex flex-wrap gap-2">
        <StatusBadge v-for="s in ch.skills" :key="s" :label="s" tone="blue" />
      </div>

      <p class="text-sm text-slate-500">Prazo: {{ formatDate(ch.deadline) }} · Prémio: {{ ch.prize }}</p>
    </div>

    <div v-if="ch.status === 'encerrado'" class="card border-emerald-300 bg-emerald-50 text-sm text-emerald-800">
      Desafio encerrado. Equipa vencedora: <strong>{{ winnerName }}</strong>.
    </div>

    <p v-if="feedback" class="text-sm text-brand-700">{{ feedback }}</p>

    <!-- Tenho equipa -->
    <div v-if="team" class="card space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="font-semibold text-slate-900">A minha equipa: {{ team.name }}</h2>
        <button v-if="ch.status !== 'encerrado'" class="btn-secondary" @click="store.leaveTeam(team.id, user.id)">Sair da equipa</button>
      </div>
      <ul class="flex flex-wrap gap-2">
        <li v-for="m in team.members" :key="m.id" class="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700">
          {{ m.name }}
        </li>
      </ul>

      <div v-if="sub" class="rounded-xl border border-slate-200 p-4 text-sm">
        <p class="font-medium text-slate-900">Submissão atual</p>
        <p class="mt-1 text-slate-700">{{ sub.summary }}</p>
        <a v-if="sub.link" :href="sub.link" target="_blank" rel="noopener" class="text-brand-600 hover:underline">{{ sub.link }}</a>
        <p v-if="sub.score !== undefined" class="mt-2 font-semibold text-emerald-600">Avaliação: {{ sub.score }}/10</p>
        <p v-if="sub.feedback" class="text-slate-600">{{ sub.feedback }}</p>
        <p v-else-if="sub.score === undefined" class="mt-2 text-slate-500">Ainda sem avaliação.</p>
      </div>

      <form v-if="open" class="space-y-3" @submit.prevent="submitWork">
        <p class="text-sm font-medium text-slate-700">
          {{ sub ? 'Atualizar submissão (a avaliação anterior é reposta)' : 'Submeter solução' }}
        </p>
        <textarea v-model="summary" rows="5" class="input" placeholder="Descreve o problema, a tua solução e o impacto esperado." />
        <input v-model="link" class="input" placeholder="Link do protótipo, apresentação ou repositório (opcional)" />
        <button type="submit" class="btn-primary">Enviar submissão</button>
      </form>
    </div>

    <!-- Sem equipa -->
    <div v-else-if="open" class="card space-y-5">
      <form class="space-y-3" @submit.prevent="createTeam">
        <h2 class="font-semibold text-slate-900">Criar uma equipa</h2>
        <div class="flex flex-wrap gap-2">
          <input v-model="teamName" class="input max-w-xs" placeholder="Nome da equipa" />
          <button type="submit" class="btn-primary">Criar equipa</button>
        </div>
        <p class="text-xs text-slate-500">Cada equipa pode ter até {{ store.maxTeam }} membros.</p>
      </form>

      <div class="space-y-2">
        <h2 class="font-semibold text-slate-900">Ou junta-te a uma equipa existente</h2>
        <p v-if="teams.length === 0" class="text-sm text-slate-500">Ainda não há equipas.</p>
        <div v-for="t in teams" :key="t.id" class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3">
          <div>
            <p class="font-medium text-slate-900">{{ t.name }}</p>
            <p class="text-xs text-slate-500">{{ t.members.map((m) => m.name).join(', ') }} · {{ t.members.length }}/{{ store.maxTeam }}</p>
          </div>
          <button class="btn-secondary" :disabled="t.members.length >= store.maxTeam" @click="join(t.id)">
            {{ t.members.length >= store.maxTeam ? 'Cheia' : 'Juntar-me' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="card text-sm text-slate-500">As inscrições neste desafio estão encerradas.</div>
  </div>
</template>
