<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCompaniesStore } from '@/stores/companies'
import { useChallengesStore } from '@/stores/challenges'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { challengeStatusLabels, challengeTone } from '@/config/labels'
import { formatDate, isPast } from '@/utils/format'
import type { Challenge } from '@/types'

const auth = useAuthStore()
const companies = useCompaniesStore()
const store = useChallengesStore()

const company = computed(() => companies.byId(auth.user!.id))
const canPublish = computed(() => company.value?.status === 'ativa' || company.value?.status === 'verificada')
const mine = computed(() => store.byCompany(auth.user!.id))

const form = reactive({ title: '', problem: '', requirements: '', skills: '', prize: '', deadline: '' })
const error = ref('')
const info = ref('')

function submit() {
  error.value = ''
  if (!form.title.trim() || !form.problem.trim() || !form.prize.trim()) {
    error.value = 'Preenche o título, o problema e o prémio.'
    return
  }
  if (!form.deadline || isPast(form.deadline)) {
    error.value = 'Indica um prazo futuro.'
    return
  }
  store.create({
    title: form.title.trim(),
    companyId: auth.user!.id,
    companyName: company.value?.name ?? auth.user!.name,
    problem: form.problem.trim(),
    requirements: form.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
    skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
    deadline: form.deadline,
    prize: form.prize.trim(),
  })
  form.title = ''
  form.problem = ''
  form.requirements = ''
  form.skills = ''
  form.prize = ''
  form.deadline = ''
  info.value = 'Desafio submetido. O NEIRE vai analisá-lo antes de o publicar.'
}

function onScore(id: string, e: Event) {
  const fd = new FormData(e.target as HTMLFormElement)
  const raw = String(fd.get('score') ?? '').trim()
  if (raw === '') return
  const n = Number(raw)
  if (Number.isNaN(n)) return
  store.score(id, n, String(fd.get('feedback') ?? ''))
}

function hasScored(challengeId: string) {
  return store.submissionsOf(challengeId).some((s) => s.score !== undefined)
}

function winner(c: Challenge) {
  return store.teamsOf(c.id).find((t) => t.id === c.winnerTeamId)?.name ?? '—'
}

function declare(id: string) {
  const w = store.declareWinner(id)
  info.value = w ? `Vencedor: ${w.teamName} (${w.score}/10). Os certificados foram emitidos.` : 'Avalia pelo menos uma submissão primeiro.'
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Desafios empresariais" subtitle="Lança um problema real e deixa os estudantes do INSTIC apresentarem soluções." />

    <div v-if="!canPublish" class="card text-sm text-amber-700">
      A tua empresa ainda não foi verificada pelo NEIRE. Só empresas verificadas podem lançar desafios.
    </div>

    <form class="card grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
      <h2 class="font-semibold text-slate-900 sm:col-span-2">Novo desafio empresarial</h2>
      <div class="sm:col-span-2">
        <label class="label" for="ch-title">Título</label>
        <input id="ch-title" v-model="form.title" class="input" />
      </div>
      <div class="sm:col-span-2">
        <label class="label" for="ch-problem">Problema</label>
        <textarea id="ch-problem" v-model="form.problem" rows="4" class="input" placeholder="Precisamos de uma solução para..." />
      </div>
      <div class="sm:col-span-2">
        <label class="label" for="ch-req">Requisitos (um por linha)</label>
        <textarea id="ch-req" v-model="form.requirements" rows="3" class="input" />
      </div>
      <div>
        <label class="label" for="ch-skills">Competências necessárias (separadas por vírgula)</label>
        <input id="ch-skills" v-model="form.skills" class="input" />
      </div>
      <div>
        <label class="label" for="ch-prize">Prémio</label>
        <input id="ch-prize" v-model="form.prize" class="input" placeholder="Ex.: Estágio + mentoria" />
      </div>
      <div>
        <label class="label" for="ch-deadline">Prazo</label>
        <input id="ch-deadline" v-model="form.deadline" type="date" class="input" />
      </div>
      <p v-if="error" class="text-sm text-red-600 sm:col-span-2">{{ error }}</p>
      <p v-if="info" class="text-sm text-brand-700 sm:col-span-2">{{ info }}</p>
      <div class="sm:col-span-2">
        <button type="submit" class="btn-primary" :disabled="!canPublish">Submeter para validação</button>
      </div>
    </form>

    <section class="space-y-4">
      <h2 class="font-semibold text-slate-900">Os meus desafios</h2>
      <EmptyState v-if="mine.length === 0" text="Ainda não lançaste nenhum desafio." />

      <div v-for="c in mine" :key="c.id" class="card space-y-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="font-semibold text-slate-900">{{ c.title }}</p>
            <p class="text-sm text-slate-500">
              Prazo {{ formatDate(c.deadline) }} · {{ store.teamsOf(c.id).length }} equipa(s) · {{ store.submissionsOf(c.id).length }} submissão(ões)
            </p>
          </div>
          <StatusBadge :label="challengeStatusLabels[c.status]" :tone="challengeTone[c.status]" />
        </div>

        <p v-if="c.status === 'encerrado'" class="text-sm font-medium text-emerald-600">Equipa vencedora: {{ winner(c) }}</p>

        <template v-if="c.status === 'ativo' || c.status === 'encerrado'">
          <p v-if="store.submissionsOf(c.id).length === 0" class="text-sm text-slate-500">Ainda sem submissões.</p>

          <div v-for="s in store.submissionsOf(c.id)" :key="s.id" class="space-y-3 rounded-xl border border-slate-200 p-4">
            <div>
              <p class="font-medium text-slate-900">{{ s.teamName }}</p>
              <p class="mt-1 text-sm text-slate-700">{{ s.summary }}</p>
              <a v-if="s.link" :href="s.link" target="_blank" rel="noopener" class="text-sm text-brand-600 hover:underline">{{ s.link }}</a>
            </div>
            <form v-if="c.status === 'ativo'" class="flex flex-wrap items-end gap-2" @submit.prevent="onScore(s.id, $event)">
              <div>
                <label class="label" :for="`sc-${s.id}`">Nota (0 a 10)</label>
                <input :id="`sc-${s.id}`" name="score" type="number" min="0" max="10" step="0.1" :value="s.score ?? ''" class="input w-28" />
              </div>
              <div class="min-w-48 flex-1">
                <label class="label" :for="`fb-${s.id}`">Comentário</label>
                <input :id="`fb-${s.id}`" name="feedback" :value="s.feedback ?? ''" class="input" />
              </div>
              <button type="submit" class="btn-secondary">Guardar avaliação</button>
            </form>
            <p v-else-if="s.score !== undefined" class="text-sm font-semibold text-slate-700">Nota: {{ s.score }}/10</p>
          </div>

          <div v-if="c.status === 'ativo' && hasScored(c.id)">
            <button class="btn-primary" @click="declare(c.id)">Declarar vencedor e emitir certificados</button>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
