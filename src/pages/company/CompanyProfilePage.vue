<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCompaniesStore } from '@/stores/companies'
import { useCompanyProfilesStore } from '@/stores/companyprofiles'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { companyStatusLabels, companyTone } from '@/config/labels'

const auth = useAuthStore()
const companies = useCompaniesStore()
const profiles = useCompanyProfilesStore()

const userId = auth.user!.id
const company = computed(() => companies.byId(userId))
const profile = profiles.ensure(userId)
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <PageHeader title="Perfil da empresa" subtitle="É assim que os estudantes veem a tua empresa." />

    <div v-if="!company" class="card text-sm text-slate-600">Não encontrámos o registo desta empresa.</div>

    <template v-else>
      <div class="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-sm text-slate-500">Estado de verificação</p>
          <p class="text-xs text-slate-500">Pendente → Em análise → Verificada → Ativa</p>
        </div>
        <StatusBadge :label="companyStatusLabels[company.status]" :tone="companyTone[company.status]" />
      </div>

      <form class="card grid gap-4 sm:grid-cols-2" @submit.prevent>
        <div>
          <label class="label" for="cp-name">Nome</label>
          <input id="cp-name" v-model="company.name" class="input" />
        </div>
        <div>
          <label class="label" for="cp-sector">Setor</label>
          <input id="cp-sector" v-model="company.sector" class="input" />
        </div>
        <div>
          <label class="label" for="cp-web">Website</label>
          <input id="cp-web" v-model="company.website" class="input" />
        </div>
        <div>
          <label class="label" for="cp-loc">Localização</label>
          <input id="cp-loc" v-model="profile.location" class="input" />
        </div>
        <div class="sm:col-span-2">
          <label class="label" for="cp-desc">Descrição</label>
          <textarea id="cp-desc" v-model="profile.description" rows="4" class="input" />
        </div>
        <div class="sm:col-span-2">
          <label class="label" for="cp-areas">Áreas de atuação</label>
          <input id="cp-areas" v-model="profile.areas" class="input" placeholder="Ex.: Redes, Cloud, Desenvolvimento" />
        </div>
        <div>
          <label class="label" for="cp-mail">Email institucional</label>
          <input id="cp-mail" v-model="profile.contactEmail" type="email" class="input" />
        </div>
        <div>
          <label class="label" for="cp-phone">Telefone institucional</label>
          <input id="cp-phone" v-model="profile.contactPhone" class="input" />
        </div>
        <p class="text-xs text-slate-500 sm:col-span-2">As alterações são guardadas automaticamente.</p>
      </form>
    </template>
  </div>
</template>
