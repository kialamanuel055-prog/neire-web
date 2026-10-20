<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCompaniesStore } from '@/stores/companies'
import { useOpportunitiesStore } from '@/stores/opportunities'
import PageHeader from '@/components/PageHeader.vue'
import { areas, experienceLevels, modalityLabels, typeLabels } from '@/config/labels'
import { isPast } from '@/utils/format'
import type { Modality, OpportunityType } from '@/types'

const auth = useAuthStore()
const companies = useCompaniesStore()
const opps = useOpportunitiesStore()
const router = useRouter()

const company = computed(() => companies.byId(auth.user!.id))
const canPublish = computed(() => company.value?.status === 'ativa' || company.value?.status === 'verificada')

const form = reactive({
  title: '',
  type: 'estagio' as OpportunityType,
  area: areas[0] as string,
  modality: 'presencial' as Modality,
  level: experienceLevels[0] as string,
  description: '',
  requirements: '',
  vacancies: 1,
  deadline: '',
})
const error = ref('')

function submit() {
  error.value = ''
  if (!form.title.trim() || !form.description.trim()) {
    error.value = 'Preenche o título e a descrição.'
    return
  }
  if (!form.deadline || isPast(form.deadline)) {
    error.value = 'Indica um prazo futuro.'
    return
  }
  if (form.vacancies < 1) {
    error.value = 'O número de vagas deve ser pelo menos 1.'
    return
  }
  opps.create({
    title: form.title.trim(),
    companyId: auth.user!.id,
    companyName: company.value?.name ?? auth.user!.name,
    type: form.type,
    area: form.area,
    modality: form.modality,
    level: form.level,
    description: form.description.trim(),
    requirements: form.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
    vacancies: form.vacancies,
    deadline: form.deadline,
  })
  router.push('/app/empresa/oportunidades')
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <PageHeader title="Nova oportunidade" subtitle="Depois de submetida, o NEIRE valida antes de publicar aos estudantes." />

    <div v-if="!canPublish" class="card text-sm text-amber-700">
      A tua empresa ainda não foi verificada pelo NEIRE. Só empresas verificadas podem publicar.
    </div>

    <form class="card grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
      <div class="sm:col-span-2">
        <label class="label" for="title">Título</label>
        <input id="title" v-model="form.title" class="input" />
      </div>
      <div>
        <label class="label" for="type">Tipo</label>
        <select id="type" v-model="form.type" class="input">
          <option v-for="(label, key) in typeLabels" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>
      <div>
        <label class="label" for="area">Área</label>
        <select id="area" v-model="form.area" class="input">
          <option v-for="a in areas" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
      <div>
        <label class="label" for="modality">Modalidade</label>
        <select id="modality" v-model="form.modality" class="input">
          <option v-for="(label, key) in modalityLabels" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>
      <div>
        <label class="label" for="level">Nível de experiência</label>
        <select id="level" v-model="form.level" class="input">
          <option v-for="l in experienceLevels" :key="l" :value="l">{{ l }}</option>
        </select>
      </div>
      <div class="sm:col-span-2">
        <label class="label" for="description">Descrição</label>
        <textarea id="description" v-model="form.description" rows="4" class="input" />
      </div>
      <div class="sm:col-span-2">
        <label class="label" for="requirements">Requisitos (um por linha)</label>
        <textarea id="requirements" v-model="form.requirements" rows="4" class="input" />
      </div>
      <div>
        <label class="label" for="vacancies">Vagas</label>
        <input id="vacancies" v-model.number="form.vacancies" type="number" min="1" class="input" />
      </div>
      <div>
        <label class="label" for="deadline">Prazo</label>
        <input id="deadline" v-model="form.deadline" type="date" class="input" />
      </div>

      <p v-if="error" class="text-sm text-red-600 sm:col-span-2">{{ error }}</p>
      <div class="sm:col-span-2">
        <button type="submit" class="btn-primary" :disabled="!canPublish">Submeter para validação</button>
      </div>
    </form>
  </div>
</template>
