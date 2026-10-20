<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useApplicationsStore } from '@/stores/applications'
import StatusBadge from '@/components/StatusBadge.vue'
import ApplicationStepper from '@/components/ApplicationStepper.vue'
import { applicationStatusLabels, applicationTone, modalityLabels, typeLabels } from '@/config/labels'
import { formatDate, isPast } from '@/utils/format'

const route = useRoute()
const auth = useAuthStore()
const opps = useOpportunitiesStore()
const apps = useApplicationsStore()

const opp = computed(() => opps.byId(String(route.params.id)))
const existing = computed(() =>
  opp.value && auth.user ? apps.find(opp.value.id, auth.user.id) : undefined,
)
const closed = computed(() => !opp.value || opp.value.status !== 'publicada' || isPast(opp.value.deadline))

const showForm = ref(false)
const message = ref('')

function submit() {
  if (!opp.value || !auth.user) return
  apps.apply(opp.value.id, { id: auth.user.id, name: auth.user.name }, message.value.trim())
  showForm.value = false
  message.value = ''
}
</script>

<template>
  <div v-if="!opp" class="card text-center">
    <p class="text-slate-600">Oportunidade não encontrada.</p>
    <RouterLink to="/app/estudante/oportunidades" class="mt-3 inline-block text-brand-600 hover:underline">
      Voltar às oportunidades
    </RouterLink>
  </div>

  <div v-else class="mx-auto max-w-3xl space-y-6">
    <RouterLink to="/app/estudante/oportunidades" class="text-sm text-brand-600 hover:underline">
      ← Voltar às oportunidades
    </RouterLink>

    <div class="card space-y-4">
      <div class="flex flex-wrap items-center gap-2">
        <StatusBadge :label="typeLabels[opp.type]" tone="blue" />
        <StatusBadge :label="modalityLabels[opp.modality]" />
        <span class="text-xs text-slate-500">{{ opp.area }} · {{ opp.level }}</span>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-900">{{ opp.title }}</h1>
        <p class="text-slate-600">{{ opp.companyName }}</p>
      </div>
      <p class="text-slate-700">{{ opp.description }}</p>

      <div>
        <h2 class="font-semibold text-slate-900">Requisitos</h2>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li v-for="r in opp.requirements" :key="r">{{ r }}</li>
        </ul>
      </div>

      <p class="text-sm text-slate-500">
        Prazo: {{ formatDate(opp.deadline) }} · Vagas: {{ opp.vacancies }}
      </p>
    </div>

    <div v-if="existing" class="card space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold text-slate-900">A tua candidatura</h2>
        <StatusBadge :label="applicationStatusLabels[existing.status]" :tone="applicationTone[existing.status]" />
      </div>
      <ApplicationStepper :status="existing.status" />
    </div>

    <div v-else class="card space-y-3">
      <p v-if="closed" class="text-sm text-slate-500">As candidaturas para esta oportunidade estão encerradas.</p>
      <template v-else>
        <button v-if="!showForm" class="btn-primary" @click="showForm = true">Candidatar-me</button>
        <form v-else class="space-y-3" @submit.prevent="submit">
          <p class="text-sm text-slate-600">O teu perfil profissional e portfólio serão enviados com a candidatura.</p>
          <div>
            <label class="label" for="msg">Carta de motivação (opcional)</label>
            <textarea id="msg" v-model="message" rows="5" class="input" />
          </div>
          <div class="flex gap-2">
            <button type="submit" class="btn-primary">Enviar candidatura</button>
            <button type="button" class="btn-secondary" @click="showForm = false">Cancelar</button>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>
