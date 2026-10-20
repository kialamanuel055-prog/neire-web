<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useEventsStore } from '@/stores/events'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { eventTypes } from '@/config/labels'
import { formatDate } from '@/utils/format'

const events = useEventsStore()
const error = ref('')
const form = reactive({
  title: '',
  type: eventTypes[0] as string,
  description: '',
  date: '',
  time: '09:00',
  location: '',
  capacity: 50,
})

function submit() {
  error.value = ''
  if (!form.title.trim() || !form.date || !form.location.trim()) {
    error.value = 'Preenche o título, a data e o local.'
    return
  }
  events.create({
    title: form.title.trim(),
    type: form.type,
    description: form.description.trim(),
    date: form.date,
    time: form.time,
    location: form.location.trim(),
    capacity: form.capacity,
  })
  form.title = ''
  form.description = ''
  form.date = ''
  form.location = ''
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Eventos" subtitle="Cria e acompanha os eventos do NEIRE." />

    <form class="card grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
      <div class="sm:col-span-2">
        <label class="label" for="ev-title">Título</label>
        <input id="ev-title" v-model="form.title" class="input" />
      </div>
      <div>
        <label class="label" for="ev-type">Tipo</label>
        <select id="ev-type" v-model="form.type" class="input">
          <option v-for="t in eventTypes" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div>
        <label class="label" for="ev-cap">Vagas</label>
        <input id="ev-cap" v-model.number="form.capacity" type="number" min="1" class="input" />
      </div>
      <div>
        <label class="label" for="ev-date">Data</label>
        <input id="ev-date" v-model="form.date" type="date" class="input" />
      </div>
      <div>
        <label class="label" for="ev-time">Hora</label>
        <input id="ev-time" v-model="form.time" type="time" class="input" />
      </div>
      <div class="sm:col-span-2">
        <label class="label" for="ev-loc">Local</label>
        <input id="ev-loc" v-model="form.location" class="input" />
      </div>
      <div class="sm:col-span-2">
        <label class="label" for="ev-desc">Descrição</label>
        <textarea id="ev-desc" v-model="form.description" rows="3" class="input" />
      </div>
      <p v-if="error" class="text-sm text-red-600 sm:col-span-2">{{ error }}</p>
      <div class="sm:col-span-2"><button type="submit" class="btn-primary">Criar evento</button></div>
    </form>

    <div class="grid gap-4 lg:grid-cols-2">
      <div v-for="e in events.sorted" :key="e.id" class="card space-y-2">
        <div class="flex items-center justify-between">
          <StatusBadge :label="e.type" tone="blue" />
          <span class="text-xs text-slate-500">{{ e.registered.length }}/{{ e.capacity }} inscritos</span>
        </div>
        <p class="font-semibold text-slate-900">{{ e.title }}</p>
        <p class="text-sm text-slate-500">{{ formatDate(e.date) }} às {{ e.time }} · {{ e.location }}</p>
      </div>
    </div>
  </div>
</template>
