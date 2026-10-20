<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useDebatesStore } from '@/stores/debates'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { debateStatusLabels, debateTone } from '@/config/labels'

const store = useDebatesStore()
const form = reactive({ title: '', description: '', topics: '' })
const error = ref('')
const info = ref('')

function createContest() {
  error.value = ''
  if (!form.title.trim()) {
    error.value = 'Indica o título do concurso.'
    return
  }
  store.createContest(
    form.title.trim(),
    form.description.trim(),
    form.topics.split('\n').map((s) => s.trim()).filter(Boolean),
  )
  form.title = ''
  form.description = ''
  form.topics = ''
}

function start(id: string) {
  const n = store.start(id)
  info.value = n > 0 ? `Concurso iniciado. ${n} confronto(s) sorteado(s).` : 'São precisas pelo menos 2 equipas para iniciar.'
}

function draw(id: string) {
  const n = store.drawRound(id)
  if (n === -1) info.value = 'Regista primeiro todos os resultados da ronda atual.'
  else if (n === 0) info.value = 'Não foi possível sortear (equipas insuficientes).'
  else info.value = `Nova ronda sorteada: ${n} confronto(s).`
}

function onResult(matchId: string, e: Event) {
  const fd = new FormData(e.target as HTMLFormElement)
  const a = String(fd.get('a') ?? '').trim()
  const b = String(fd.get('b') ?? '').trim()
  if (a === '' || b === '') return
  const na = Number(a)
  const nb = Number(b)
  if (Number.isNaN(na) || Number.isNaN(nb)) return
  store.setResult(matchId, na, nb)
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Concurso de debates" subtitle="Inscrições, sorteios, resultados, classificação e certificados." />

    <form class="card grid gap-4" @submit.prevent="createContest">
      <h2 class="font-semibold text-slate-900">Novo concurso</h2>
      <div>
        <label class="label" for="d-title">Título</label>
        <input id="d-title" v-model="form.title" class="input" />
      </div>
      <div>
        <label class="label" for="d-desc">Descrição</label>
        <textarea id="d-desc" v-model="form.description" rows="2" class="input" />
      </div>
      <div>
        <label class="label" for="d-topics">Temas (um por linha)</label>
        <textarea id="d-topics" v-model="form.topics" rows="3" class="input" />
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <div><button type="submit" class="btn-primary">Criar concurso</button></div>
    </form>

    <p v-if="info" class="text-sm text-brand-700">{{ info }}</p>

    <section v-for="c in store.contests" :key="c.id" class="card space-y-5">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900">{{ c.title }}</h2>
          <p class="text-sm text-slate-500">{{ store.teamsOf(c.id).length }} equipa(s) inscrita(s)</p>
        </div>
        <StatusBadge :label="debateStatusLabels[c.status]" :tone="debateTone[c.status]" />
      </div>

      <ul class="flex flex-wrap gap-2">
        <li v-for="t in store.teamsOf(c.id)" :key="t.id" class="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700">
          {{ t.name }} ({{ t.members.length }})
        </li>
        <li v-if="store.teamsOf(c.id).length === 0" class="text-sm text-slate-500">Sem equipas inscritas.</li>
      </ul>

      <div class="flex flex-wrap gap-2">
        <button v-if="c.status === 'inscricoes'" class="btn-primary" @click="start(c.id)">Fechar inscrições e sortear 1.ª ronda</button>
        <button v-if="c.status === 'em_curso'" class="btn-secondary" @click="draw(c.id)">Sortear nova ronda</button>
        <button v-if="c.status === 'em_curso'" class="btn-primary" @click="store.finish(c.id)">Terminar e emitir certificados</button>
      </div>

      <div v-if="store.matchesOf(c.id).length" class="space-y-3">
        <p class="text-sm font-medium text-slate-700">Confrontos e resultados</p>
        <div v-for="m in store.matchesOf(c.id)" :key="m.id" class="space-y-2 rounded-xl border border-slate-200 p-3">
          <p class="text-xs text-slate-500">Ronda {{ m.round }} · {{ m.topic }}</p>
          <form class="flex flex-wrap items-center gap-2" @submit.prevent="onResult(m.id, $event)">
            <span class="min-w-32 text-sm font-medium text-slate-900">{{ store.teamName(m.teamAId) }}</span>
            <input name="a" type="number" min="0" :value="m.scoreA ?? ''" class="input w-20" :disabled="c.status === 'terminado'" />
            <span class="text-slate-500">-</span>
            <input name="b" type="number" min="0" :value="m.scoreB ?? ''" class="input w-20" :disabled="c.status === 'terminado'" />
            <span class="min-w-32 text-sm font-medium text-slate-900">{{ store.teamName(m.teamBId) }}</span>
            <button v-if="c.status !== 'terminado'" type="submit" class="btn-secondary">Guardar</button>
          </form>
        </div>
      </div>

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
              <th class="pb-2">Pontos marcados</th>
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
              <td class="py-2 pr-3 text-slate-600">{{ r.scored }}</td>
              <td class="py-2 font-semibold text-slate-900">{{ r.points }}</td>
            </tr>
          </tbody>
        </table>
        <p class="mt-2 text-xs text-slate-500">Vitória 3 pts, empate 1 pt. Desempate por pontos marcados. Com nº ímpar de equipas, uma fica sem adversário na ronda.</p>
      </div>
    </section>
  </div>
</template>
