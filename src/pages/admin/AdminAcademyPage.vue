<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAcademyStore } from '@/stores/academy'
import { useProfilesStore } from '@/stores/profiles'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { courseKindLabels } from '@/config/content'
import { formatDate } from '@/utils/format'
import type { CourseKind } from '@/types'

const academy = useAcademyStore()
const profiles = useProfilesStore()
const error = ref('')

const form = reactive({
  title: '',
  kind: 'workshop' as CourseKind,
  description: '',
  instructor: '',
  startDate: '',
  hours: 2,
  capacity: 30,
})

function nameOf(userId: string) {
  return profiles.byUser(userId)?.name ?? userId
}

function submit() {
  error.value = ''
  if (!form.title.trim() || !form.startDate) {
    error.value = 'Preenche o título e a data de início.'
    return
  }
  academy.create({
    title: form.title.trim(),
    kind: form.kind,
    description: form.description.trim(),
    instructor: form.instructor.trim(),
    startDate: form.startDate,
    hours: form.hours,
    capacity: form.capacity,
  })
  form.title = ''
  form.description = ''
  form.instructor = ''
  form.startDate = ''
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Formação" subtitle="Cria formações e marca a conclusão dos participantes." />

    <form class="card grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
      <div class="sm:col-span-2">
        <label class="label" for="ac-title">Título</label>
        <input id="ac-title" v-model="form.title" class="input" />
      </div>
      <div>
        <label class="label" for="ac-kind">Tipo</label>
        <select id="ac-kind" v-model="form.kind" class="input">
          <option v-for="(label, key) in courseKindLabels" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>
      <div>
        <label class="label" for="ac-inst">Formador</label>
        <input id="ac-inst" v-model="form.instructor" class="input" />
      </div>
      <div>
        <label class="label" for="ac-date">Data de início</label>
        <input id="ac-date" v-model="form.startDate" type="date" class="input" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label" for="ac-hours">Horas</label>
          <input id="ac-hours" v-model.number="form.hours" type="number" min="1" class="input" />
        </div>
        <div>
          <label class="label" for="ac-cap">Vagas</label>
          <input id="ac-cap" v-model.number="form.capacity" type="number" min="1" class="input" />
        </div>
      </div>
      <div class="sm:col-span-2">
        <label class="label" for="ac-desc">Descrição</label>
        <textarea id="ac-desc" v-model="form.description" rows="3" class="input" />
      </div>
      <p v-if="error" class="text-sm text-red-600 sm:col-span-2">{{ error }}</p>
      <div class="sm:col-span-2"><button type="submit" class="btn-primary">Criar formação</button></div>
    </form>

    <div class="space-y-4">
      <div v-for="c in academy.sorted" :key="c.id" class="card space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p class="font-semibold text-slate-900">{{ c.title }}</p>
            <p class="text-sm text-slate-500">{{ formatDate(c.startDate) }} · {{ c.hours }}h · {{ c.instructor }}</p>
          </div>
          <StatusBadge :label="courseKindLabels[c.kind]" tone="blue" />
        </div>
        <p v-if="c.enrolled.length === 0" class="text-sm text-slate-500">Sem participantes.</p>
        <ul class="divide-y divide-slate-100">
          <li v-for="uid in c.enrolled" :key="uid" class="flex items-center justify-between py-2 text-sm">
            <span class="text-slate-800">{{ nameOf(uid) }}</span>
            <StatusBadge v-if="c.completed.includes(uid)" label="Concluída" tone="green" />
            <button v-else class="btn-secondary" @click="academy.complete(c.id, uid)">Marcar concluída</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
