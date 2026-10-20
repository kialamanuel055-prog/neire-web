<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProfilesStore } from '@/stores/profiles'
import { useSkillRequestsStore } from '@/stores/skillrequests'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { skillLevelLabels, skillTone } from '@/config/labels'
import { evidenceTypes } from '@/config/content'
import { formatDate } from '@/utils/format'

const auth = useAuthStore()
const profiles = useProfilesStore()
const requests = useSkillRequestsStore()
const userId = auth.user!.id

const profile = computed(() => profiles.byUser(userId))
const eligible = computed(() => (profile.value?.skills ?? []).filter((s) => s.level !== 'validada'))
const mine = computed(() => requests.items.filter((r) => r.userId === userId))

const form = reactive({ skill: '', evidenceType: evidenceTypes[0] as string, evidence: '' })
const message = ref('')

const statusLabel = { pendente: 'Pendente', aprovada: 'Aprovada', rejeitada: 'Rejeitada' } as const
const statusTone = { pendente: 'amber', aprovada: 'green', rejeitada: 'red' } as const

function submit() {
  message.value = ''
  if (!form.skill || !form.evidence.trim()) {
    message.value = 'Escolhe a competência e descreve a evidência.'
    return
  }
  const r = requests.create({
    userId,
    userName: auth.user!.name,
    skill: form.skill,
    evidenceType: form.evidenceType,
    evidence: form.evidence.trim(),
  })
  message.value = r ? 'Pedido enviado ao NEIRE.' : 'Já tens um pedido pendente para esta competência.'
  if (r) form.evidence = ''
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-8">
    <PageHeader title="Verificação de competências" subtitle="Declarada → Comprovada → Validada. Aumenta a confiança das empresas." />

    <section class="card space-y-3">
      <h2 class="font-semibold text-slate-900">As minhas competências</h2>
      <ul class="flex flex-wrap gap-2">
        <li v-for="s in profile?.skills ?? []" :key="s.name" class="flex items-center gap-2 text-sm">
          {{ s.name }} <StatusBadge :label="skillLevelLabels[s.level]" :tone="skillTone[s.level]" />
        </li>
        <li v-if="!profile || profile.skills.length === 0" class="text-sm text-slate-500">
          Ainda não tens competências. Adiciona-as no teu perfil.
        </li>
      </ul>
    </section>

    <form v-if="eligible.length > 0" class="card space-y-4" @submit.prevent="submit">
      <h2 class="font-semibold text-slate-900">Pedir verificação</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="label" for="sv-skill">Competência</label>
          <select id="sv-skill" v-model="form.skill" class="input">
            <option value="" disabled>Escolhe...</option>
            <option v-for="s in eligible" :key="s.name" :value="s.name">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label class="label" for="sv-type">Tipo de evidência</label>
          <select id="sv-type" v-model="form.evidenceType" class="input">
            <option v-for="t in evidenceTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div class="sm:col-span-2">
          <label class="label" for="sv-evidence">Evidência (descrição ou link)</label>
          <textarea id="sv-evidence" v-model="form.evidence" rows="3" class="input" />
        </div>
      </div>
      <p v-if="message" class="text-sm text-slate-600">{{ message }}</p>
      <button type="submit" class="btn-primary">Enviar pedido</button>
    </form>

    <section class="space-y-3">
      <h2 class="font-semibold text-slate-900">Os meus pedidos</h2>
      <EmptyState v-if="mine.length === 0" text="Ainda não fizeste pedidos de verificação." />
      <div v-for="r in mine" :key="r.id" class="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="font-medium text-slate-900">{{ r.skill }} · {{ r.evidenceType }}</p>
          <p class="text-sm text-slate-500">
            {{ formatDate(r.at) }}
            <template v-if="r.resultLevel"> · Nível atribuído: {{ skillLevelLabels[r.resultLevel] }}</template>
          </p>
        </div>
        <StatusBadge :label="statusLabel[r.status]" :tone="statusTone[r.status]" />
      </div>
    </section>
  </div>
</template>
