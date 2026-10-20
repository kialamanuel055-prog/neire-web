<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDebatesStore } from '@/stores/debates'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { debateStatusLabels, debateTone } from '@/config/labels'

const auth = useAuthStore()
const store = useDebatesStore()
const user = auth.user!

const names = reactive<Record<string, string>>({})
const feedback = ref('')

function create(contestId: string) {
  const name = (names[contestId] ?? '').trim()
  if (!name) {
    feedback.value = 'Indica o nome da equipa.'
    return
  }
  const t = store.createTeam(contestId, { id: user.id, name: user.name }, name)
  feedback.value = t ? 'Equipa criada.' : 'Não foi possível criar a equipa.'
  if (t) names[contestId] = ''
}

function join(teamId: string) {
  feedback.value = store.joinTeam(teamId, { id: user.id, name: user.name })
    ? 'Entraste na equipa.'
    : 'Não foi possível entrar (equipa cheia ou já pertences a uma equipa).'
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Concurso de debates" subtitle="Forma a tua equipa, acompanha os confrontos e a classificação." />

    <p v-if="feedback" class="text-sm text-brand-700">{{ feedback }}</p>
    <EmptyState v-if="store.contests.length === 0" text="Ainda não há concursos de debates." />

    <section v-for="c in store.contests" :key="c.id" class="card space-y-5">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-xl font-bold text-slate-900">{{ c.title }}</h2>
          <p class="text-sm text-slate-600">{{ c.description }}</p>
        </div>
        <StatusBadge :label="debateStatusLabels[c.status]" :tone="debateTone[c.status]" />
      </div>

      <div v-if="c.topics.length">
        <p class="text-sm font-medium text-slate-700">Temas</p>
        <ul class="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li v-for="t in c.topics" :key="t">{{ t }}</li>
        </ul>
      </div>

      <!-- Equipa -->
      <div class="space-y-3">
        <template v-if="store.teamOf(c.id, user.id)">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="font-semibold text-slate-900">A minha equipa: {{ store.teamOf(c.id, user.id)?.name }}</p>
            <button
              v-if="c.status === 'inscricoes'"
              class="btn-secondary"
              @click="store.leaveTeam(store.teamOf(c.id, user.id)!.id, user.id)"
            >
              Sair da equipa
            </button>
          </div>
          <p class="text-sm text-slate-600">{{ store.teamOf(c.id, user.id)?.members.map((m) => m.name).join(', ') }}</p>
        </template>

        <template v-else-if="c.status === 'inscricoes'">
          <form class="flex flex-wrap gap-2" @submit.prevent="create(c.id)">
            <input v-model="names[c.id]" class="input max-w-xs" placeholder="Nome da nova equipa" />
            <button type="submit" class="btn-primary">Criar equipa</button>
          </form>
          <div v-for="t in store.teamsOf(c.id)" :key="t.id" class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3">
            <div>
              <p class="font-medium text-slate-900">{{ t.name }}</p>
              <p class="text-xs text-slate-500">{{ t.members.map((m) => m.name).join(', ') }} · {{ t.members.length }}/{{ store.maxTeam }}</p>
            </div>
            <button class="btn-secondary" :disabled="t.members.length >= store.maxTeam" @click="join(t.id)">
              {{ t.members.length >= store.maxTeam ? 'Cheia' : 'Juntar-me' }}
            </button>
          </div>
        </template>

        <p v-else class="text-sm text-slate-500">As inscrições estão encerradas.</p>
      </div>

      <!-- Confrontos -->
      <div v-if="store.matchesOf(c.id).length" class="space-y-2">
        <p class="text-sm font-medium text-slate-700">Confrontos</p>
        <div v-for="m in store.matchesOf(c.id)" :key="m.id" class="rounded-xl border border-slate-200 p-3 text-sm">
          <p class="text-xs text-slate-500">Ronda {{ m.round }} · {{ m.topic }}</p>
          <p class="mt-1 font-medium text-slate-900">
            {{ store.teamName(m.teamAId) }}
            <span class="text-slate-500">
              {{ m.scoreA !== undefined ? `${m.scoreA} - ${m.scoreB}` : 'vs' }}
            </span>
            {{ store.teamName(m.teamBId) }}
          </p>
        </div>
      </div>

      <!-- Classificação -->
      <div v-if="store.matchesOf(c.id).length" class="overflow-x-auto">
        <p class="mb-2 text-sm font-medium text-slate-700">Classificação</p>
        <table class="w-full text-left text-sm">
          <thead class="text-xs uppercase text-slate-500">
            <tr>
              <th class="pb-2">#</th>
              <th class="pb-2">Equipa</th>
              <th class="pb-2">J</th>
              <th class="pb-2">V</th>
              <th class="pb-2">E</th>
              <th class="pb-2">D</th>
              <th class="pb-2">Pts</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(r, i) in store.ranking(c.id)" :key="r.team.id">
              <td class="py-2 pr-3 text-slate-500">{{ i + 1 }}</td>
              <td class="py-2 pr-3 font-medium text-slate-900">{{ r.team.name }}</td>
              <td class="py-2 pr-3 text-slate-600">{{ r.played }}</td>
              <td class="py-2 pr-3 text-slate-600">{{ r.wins }}</td>
              <td class="py-2 pr-3 text-slate-600">{{ r.draws }}</td>
              <td class="py-2 pr-3 text-slate-600">{{ r.losses }}</td>
              <td class="py-2 font-semibold text-slate-900">{{ r.points }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
