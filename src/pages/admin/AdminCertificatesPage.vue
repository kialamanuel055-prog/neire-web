<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useProfilesStore } from '@/stores/profiles'
import { useEventsStore } from '@/stores/events'
import { useCertificatesStore } from '@/stores/certificates'
import PageHeader from '@/components/PageHeader.vue'
import { formatDate } from '@/utils/format'

const profiles = useProfilesStore()
const events = useEventsStore()
const certs = useCertificatesStore()

const form = reactive({ userId: '', activity: '' })
const error = ref('')

function submit() {
  error.value = ''
  const student = profiles.items.find((p) => p.userId === form.userId)
  if (!student || !form.activity.trim()) {
    error.value = 'Escolhe o estudante e indica a atividade.'
    return
  }
  certs.issue({ id: student.userId, name: student.name }, form.activity.trim())
  form.activity = ''
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Certificados" subtitle="Emite certificados digitais com código de verificação e QR Code." />

    <form class="card grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
      <div>
        <label class="label" for="c-student">Estudante / Alumni</label>
        <select id="c-student" v-model="form.userId" class="input">
          <option value="" disabled>Escolhe...</option>
          <option v-for="p in profiles.items" :key="p.userId" :value="p.userId">{{ p.name }}</option>
        </select>
      </div>
      <div>
        <label class="label" for="c-activity">Atividade</label>
        <input id="c-activity" v-model="form.activity" list="c-activities" class="input" placeholder="Ex.: Workshop: CV e LinkedIn" />
        <datalist id="c-activities">
          <option v-for="e in events.items" :key="e.id" :value="e.title" />
        </datalist>
      </div>
      <p v-if="error" class="text-sm text-red-600 sm:col-span-2">{{ error }}</p>
      <div class="sm:col-span-2"><button type="submit" class="btn-primary">Emitir certificado</button></div>
    </form>

    <div class="card overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="text-xs uppercase text-slate-500">
          <tr>
            <th class="pb-2">Código</th>
            <th class="pb-2">Nome</th>
            <th class="pb-2">Atividade</th>
            <th class="pb-2">Data</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="c in certs.items" :key="c.id">
            <td class="py-2 pr-4 font-mono text-slate-900">{{ c.code }}</td>
            <td class="py-2 pr-4 text-slate-700">{{ c.studentName }}</td>
            <td class="py-2 pr-4 text-slate-600">{{ c.activity }}</td>
            <td class="py-2 text-slate-600">{{ formatDate(c.issuedAt) }}</td>
          </tr>
          <tr v-if="certs.items.length === 0">
            <td colspan="4" class="py-4 text-center text-slate-500">Ainda não foram emitidos certificados.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
