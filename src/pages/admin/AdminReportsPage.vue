<script setup lang="ts">
import { computed } from 'vue'
import { useProfilesStore } from '@/stores/profiles'
import { useCompaniesStore } from '@/stores/companies'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useApplicationsStore } from '@/stores/applications'
import { useEventsStore } from '@/stores/events'
import { useCertificatesStore } from '@/stores/certificates'
import { useMentorshipStore } from '@/stores/mentorship'
import { useChallengesStore } from '@/stores/challenges'
import { useDebatesStore } from '@/stores/debates'
import { useComplaintsStore } from '@/stores/complaints'
import { useAuditStore } from '@/stores/audit'
import PageHeader from '@/components/PageHeader.vue'

const profiles = useProfilesStore()
const companies = useCompaniesStore()
const opps = useOpportunitiesStore()
const apps = useApplicationsStore()
const events = useEventsStore()
const certs = useCertificatesStore()
const mentorship = useMentorshipStore()
const challenges = useChallengesStore()
const debates = useDebatesStore()
const complaints = useComplaintsStore()
const audit = useAuditStore()

interface Section {
  title: string
  items: { label: string; value: string | number }[]
}

const sections = computed<Section[]>(() => {
  const selected = apps.items.filter((a) => a.status === 'selecionado').length
  const rate = apps.items.length ? `${Math.round((selected / apps.items.length) * 100)}%` : '0%'
  return [
    {
      title: 'Estudantes e Alumni',
      items: [
        { label: 'Perfis registados', value: profiles.items.length },
        { label: 'Alumni', value: profiles.items.filter((p) => p.year === 'Graduado').length },
        { label: 'Visíveis no Banco de Talentos', value: profiles.items.filter((p) => p.available).length },
        { label: 'Competências validadas', value: profiles.items.reduce((n, p) => n + p.skills.filter((s) => s.level === 'validada').length, 0) },
      ],
    },
    {
      title: 'Empresas',
      items: [
        { label: 'Empresas registadas', value: companies.items.length },
        { label: 'Verificadas ou ativas', value: companies.items.filter((c) => c.status === 'ativa' || c.status === 'verificada').length },
      ],
    },
    {
      title: 'Empregabilidade',
      items: [
        { label: 'Oportunidades publicadas', value: opps.published.length },
        { label: 'Oportunidades encerradas', value: opps.items.filter((o) => o.status === 'encerrada').length },
        { label: 'Candidaturas', value: apps.items.length },
        { label: 'Selecionados', value: selected },
        { label: 'Taxa de seleção', value: rate },
      ],
    },
    {
      title: 'Eventos e formação',
      items: [
        { label: 'Eventos', value: events.items.length },
        { label: 'Inscrições em eventos', value: events.items.reduce((n, e) => n + e.registered.length, 0) },
        { label: 'Certificados emitidos', value: certs.items.length },
      ],
    },
    {
      title: 'Mentoria e inovação',
      items: [
        { label: 'Mentores ativos', value: mentorship.activeMentors.length },
        { label: 'Mentorias aceites', value: mentorship.requests.filter((r) => r.status === 'aceite').length },
        { label: 'Desafios ativos', value: challenges.active.length },
        { label: 'Desafios encerrados', value: challenges.items.filter((c) => c.status === 'encerrado').length },
        { label: 'Equipas em desafios', value: challenges.teams.length },
        { label: 'Concursos de debates', value: debates.contests.length },
        { label: 'Equipas de debate', value: debates.teams.length },
      ],
    },
    {
      title: 'Transparência',
      items: [
        { label: 'Denúncias recebidas', value: complaints.items.length },
        { label: 'Denúncias resolvidas', value: complaints.items.filter((c) => c.status === 'resolvida').length },
        { label: 'Registos de auditoria', value: audit.entries.length },
      ],
    },
  ]
})

const today = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })

function printPage() {
  window.print()
}

function exportCsv() {
  const rows: string[][] = [['Indicador', 'Valor']]
  for (const s of sections.value) {
    for (const i of s.items) rows.push([`${s.title} - ${i.label}`, String(i.value)])
  }
  const csv = '\uFEFF' + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(';')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'relatorio-neire.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Relatório de impacto" :subtitle="`NEIRE · INSTIC · ${today}`">
      <div class="no-print flex gap-2">
        <button class="btn-secondary" @click="exportCsv">Exportar CSV</button>
        <button class="btn-primary" @click="printPage">Imprimir / guardar PDF</button>
      </div>
    </PageHeader>

    <div class="grid gap-4 lg:grid-cols-2">
      <section v-for="s in sections" :key="s.title" class="card space-y-3">
        <h2 class="font-semibold text-slate-900">{{ s.title }}</h2>
        <dl class="divide-y divide-slate-100">
          <div v-for="i in s.items" :key="i.label" class="flex items-center justify-between py-2 text-sm">
            <dt class="text-slate-600">{{ i.label }}</dt>
            <dd class="font-semibold text-slate-900">{{ i.value }}</dd>
          </div>
        </dl>
      </section>
    </div>
  </div>
</template>
