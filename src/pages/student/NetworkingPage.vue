<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProfilesStore } from '@/stores/profiles'
import { useCompaniesStore } from '@/stores/companies'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'

type Kind = 'estudante' | 'alumni' | 'empresa'
interface Person {
  id: string
  kind: Kind
  name: string
  line: string
  tags: string[]
}

const profiles = useProfilesStore()
const companies = useCompaniesStore()

const q = ref('')
const kind = ref<'' | Kind>('')

const kindLabel: Record<Kind, string> = { estudante: 'Estudante', alumni: 'Alumni', empresa: 'Empresa' }
const kindTone: Record<Kind, 'blue' | 'green' | 'amber'> = { estudante: 'blue', alumni: 'green', empresa: 'amber' }

const everyone = computed<Person[]>(() => [
  ...profiles.items.map((p) => ({
    id: 'p-' + p.userId,
    kind: (p.year === 'Graduado' ? 'alumni' : 'estudante') as Kind,
    name: p.name,
    line: [p.course, p.headline].filter(Boolean).join(' · '),
    tags: p.skills.map((s) => s.name),
  })),
  ...companies.items
    .filter((c) => c.status === 'ativa' || c.status === 'verificada')
    .map((c) => ({
      id: 'c-' + c.id,
      kind: 'empresa' as Kind,
      name: c.name,
      line: c.sector,
      tags: [] as string[],
    })),
])

const results = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return everyone.value.filter(
    (p) =>
      (!kind.value || p.kind === kind.value) &&
      (!needle || `${p.name} ${p.line} ${p.tags.join(' ')}`.toLowerCase().includes(needle)),
  )
})
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Networking" subtitle="Descobre estudantes, Alumni e empresas. Networking orientado para oportunidades." />

    <div class="card grid gap-3 sm:grid-cols-2">
      <input v-model="q" class="input" placeholder="Nome, área ou competência" />
      <select v-model="kind" class="input">
        <option value="">Todos</option>
        <option value="estudante">Estudantes</option>
        <option value="alumni">Alumni</option>
        <option value="empresa">Empresas</option>
      </select>
    </div>

    <p class="text-sm text-slate-500">{{ results.length }} resultado(s)</p>
    <EmptyState v-if="results.length === 0" text="Ninguém corresponde à pesquisa." />

    <div class="grid gap-4 lg:grid-cols-2">
      <article v-for="p in results" :key="p.id" class="card space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h2 class="font-semibold text-slate-900">{{ p.name }}</h2>
          <StatusBadge :label="kindLabel[p.kind]" :tone="kindTone[p.kind]" />
        </div>
        <p v-if="p.line" class="text-sm text-slate-600">{{ p.line }}</p>
        <ul v-if="p.tags.length" class="flex flex-wrap gap-1.5">
          <li v-for="t in p.tags" :key="t" class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{{ t }}</li>
        </ul>
      </article>
    </div>
  </div>
</template>
