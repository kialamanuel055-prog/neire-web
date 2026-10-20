<script setup lang="ts">
import { adminModules, departments, roleHierarchy } from '@/config/content'
import { useDepartment } from '@/composables/useDepartment'
import PageHeader from '@/components/PageHeader.vue'

const { current, department } = useDepartment()
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Permissões" subtitle="Níveis de acesso e módulos por departamento." />

    <section class="card space-y-3">
      <h2 class="font-semibold text-slate-900">Hierarquia de perfis</h2>
      <ol class="flex flex-wrap items-center gap-2 text-sm">
        <template v-for="(r, i) in roleHierarchy" :key="r">
          <span class="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">{{ r }}</span>
          <span v-if="i < roleHierarchy.length - 1" class="text-slate-300">→</span>
        </template>
      </ol>
    </section>

    <section class="card space-y-3">
      <h2 class="font-semibold text-slate-900">Departamento ativo (simulação)</h2>
      <p class="text-sm text-slate-500">
        Escolhe um departamento para simular o acesso. {{ department.scope }}
      </p>
      <select v-model="current" class="input max-w-xs">
        <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
      </select>
    </section>

    <section class="card overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="text-xs uppercase text-slate-500">
          <tr>
            <th class="pb-2 pr-4">Módulo</th>
            <th v-for="d in departments" :key="d.id" class="pb-2 pr-3 text-center">{{ d.name }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="m in adminModules" :key="m">
            <td class="py-2 pr-4 font-medium text-slate-900">{{ m }}</td>
            <td v-for="d in departments" :key="d.id" class="py-2 pr-3 text-center">
              <span :class="d.modules.includes(m) ? 'text-emerald-600' : 'text-slate-300'">
                {{ d.modules.includes(m) ? '✓' : '—' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>
