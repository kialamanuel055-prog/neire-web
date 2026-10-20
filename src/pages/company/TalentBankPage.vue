<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useProfilesStore } from '@/stores/profiles'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { skillLevelLabels, skillTone } from '@/config/labels'

const profiles = useProfilesStore()
const filters = reactive({ q: '', course: '' })

const courses = computed(() => [...new Set(profiles.items.map((p) => p.course).filter(Boolean))])

const results = computed(() =>
  profiles.items.filter((p) => {
    if (!p.available) return false
    if (filters.course && p.course !== filters.course) return false
    const q = filters.q.trim().toLowerCase()
    if (!q) return true
    return (
      p.name.toLowerCase().includes(q) ||
      p.headline.toLowerCase().includes(q) ||
      p.skills.some((s) => s.name.toLowerCase().includes(q))
    )
  }),
)
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Banco de Talentos" subtitle="Procura estudantes e Alumni por competências, curso ou projetos." />

    <div class="card grid gap-3 sm:grid-cols-2">
      <input v-model="filters.q" class="input" placeholder="Ex.: Python, redes, cibersegurança..." />
      <select v-model="filters.course" class="input">
        <option value="">Todos os cursos</option>
        <option v-for="c in courses" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <p class="text-sm text-slate-500">{{ results.length }} talento(s) encontrado(s)</p>
    <EmptyState v-if="results.length === 0" text="Nenhum talento corresponde à pesquisa." />

    <div class="grid gap-4 lg:grid-cols-2">
      <article v-for="p in results" :key="p.userId" class="card space-y-3">
        <div>
          <h2 class="text-lg font-semibold text-slate-900">{{ p.name }}</h2>
          <p class="text-sm text-slate-500">{{ p.course }} · {{ p.year }}</p>
          <p v-if="p.headline" class="text-sm text-slate-700">{{ p.headline }}</p>
        </div>
        <ul class="flex flex-wrap gap-2">
          <li v-for="s in p.skills" :key="s.name" class="flex items-center gap-1 text-xs">
            {{ s.name }} <StatusBadge :label="skillLevelLabels[s.level]" :tone="skillTone[s.level]" />
          </li>
        </ul>
        <p class="text-xs text-slate-500">
          {{ p.projects.length }} projeto(s) · Contactos disponíveis após candidatura ou autorização do estudante.
        </p>
      </article>
    </div>
  </div>
</template>
