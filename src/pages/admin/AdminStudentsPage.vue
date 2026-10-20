<script setup lang="ts">
import { useProfilesStore } from '@/stores/profiles'
import { useApplicationsStore } from '@/stores/applications'
import PageHeader from '@/components/PageHeader.vue'

const profiles = useProfilesStore()
const apps = useApplicationsStore()
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Estudantes e Alumni" subtitle="Visão geral dos perfis registados." />

    <div class="card overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="text-xs uppercase text-slate-500">
          <tr>
            <th class="pb-2">Nome</th>
            <th class="pb-2">Curso</th>
            <th class="pb-2">Competências</th>
            <th class="pb-2">Projetos</th>
            <th class="pb-2">Candidaturas</th>
            <th class="pb-2">Banco de Talentos</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="p in profiles.items" :key="p.userId">
            <td class="py-2 pr-4 font-medium text-slate-900">{{ p.name }}</td>
            <td class="py-2 pr-4 text-slate-600">{{ p.course }} · {{ p.year }}</td>
            <td class="py-2 pr-4 text-slate-600">{{ p.skills.length }}</td>
            <td class="py-2 pr-4 text-slate-600">{{ p.projects.length }}</td>
            <td class="py-2 pr-4 text-slate-600">{{ apps.forStudent(p.userId).length }}</td>
            <td class="py-2 text-slate-600">{{ p.available ? 'Visível' : 'Oculto' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
