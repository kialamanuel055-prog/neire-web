<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProfilesStore } from '@/stores/profiles'
import { useAlumniStore } from '@/stores/alumni'
import { startSession } from '@/composables/useSession'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'

const auth = useAuthStore()
const profiles = useProfilesStore()
const alumni = useAlumniStore()

const isAlumni = computed(() => auth.user?.role === 'alumni')
const mine = computed(() => (auth.user ? alumni.byUser(auth.user.id) : undefined))

if (auth.user && auth.user.role === 'alumni' && !alumni.byUser(auth.user.id)) {
  alumni.upsert({
    userId: auth.user.id,
    name: auth.user.name,
    graduationYear: '',
    company: '',
    position: '',
    bio: '',
    offersMentoring: false,
  })
}

const grad = reactive({ graduationYear: String(new Date().getFullYear()), company: '', position: '' })
const q = ref('')

function graduate() {
  const u = auth.user
  if (!u) return
  alumni.upsert({
    userId: u.id,
    name: u.name,
    graduationYear: grad.graduationYear.trim(),
    company: grad.company.trim(),
    position: grad.position.trim(),
    bio: '',
    offersMentoring: false,
  })
  const p = profiles.ensure({ id: u.id, name: u.name })
  p.year = 'Graduado'
  startSession({ ...u, role: 'alumni' })
}

const directory = computed(() => {
  const term = q.value.trim().toLowerCase()
  return alumni.items.filter(
    (g) =>
      !term ||
      g.name.toLowerCase().includes(term) ||
      g.company.toLowerCase().includes(term) ||
      g.position.toLowerCase().includes(term),
  )
})
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Rede Alumni" subtitle="Quem já passou pelo INSTIC e continua ligado ao NEIRE." />

    <form v-if="!isAlumni" class="card space-y-4" @submit.prevent="graduate">
      <div>
        <h2 class="font-semibold text-slate-900">Já concluíste o curso?</h2>
        <p class="text-sm text-slate-500">Passa o teu estado para Alumni e continua a usar a plataforma como mentor, parceiro ou recrutador.</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <label class="label" for="al-year">Ano de conclusão</label>
          <input id="al-year" v-model="grad.graduationYear" class="input" />
        </div>
        <div>
          <label class="label" for="al-company">Empresa atual</label>
          <input id="al-company" v-model="grad.company" class="input" />
        </div>
        <div>
          <label class="label" for="al-pos">Cargo</label>
          <input id="al-pos" v-model="grad.position" class="input" />
        </div>
      </div>
      <button type="submit" class="btn-primary">Tornar-me Alumni</button>
    </form>

    <section v-else-if="mine" class="card space-y-4">
      <h2 class="font-semibold text-slate-900">O meu perfil Alumni</h2>
      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <label class="label" for="am-year">Ano de conclusão</label>
          <input id="am-year" v-model="mine.graduationYear" class="input" />
        </div>
        <div>
          <label class="label" for="am-company">Empresa atual</label>
          <input id="am-company" v-model="mine.company" class="input" />
        </div>
        <div>
          <label class="label" for="am-pos">Cargo</label>
          <input id="am-pos" v-model="mine.position" class="input" />
        </div>
        <div class="sm:col-span-3">
          <label class="label" for="am-bio">Sobre mim</label>
          <textarea id="am-bio" v-model="mine.bio" rows="3" class="input" />
        </div>
      </div>
      <label class="flex items-center gap-3 text-sm text-slate-700">
        <input v-model="mine.offersMentoring" type="checkbox" />
        Disponível para mentoria
      </label>
    </section>

    <section class="space-y-3">
      <h2 class="font-semibold text-slate-900">Diretório</h2>
      <input v-model="q" class="input max-w-md" placeholder="Pesquisar por nome, empresa ou cargo" />
      <EmptyState v-if="directory.length === 0" text="Nenhum Alumni encontrado." />
      <div class="grid gap-4 lg:grid-cols-2">
        <article v-for="g in directory" :key="g.userId" class="card space-y-2">
          <div class="flex items-center justify-between gap-2">
            <h3 class="font-semibold text-slate-900">{{ g.name }}</h3>
            <StatusBadge v-if="g.offersMentoring" label="Mentoria" tone="green" />
          </div>
          <p class="text-sm text-slate-500">
            {{ [g.position, g.company].filter(Boolean).join(' · ') || 'Sem cargo indicado' }}
            <template v-if="g.graduationYear"> · Turma {{ g.graduationYear }}</template>
          </p>
          <p v-if="g.bio" class="text-sm text-slate-700">{{ g.bio }}</p>
        </article>
      </div>
    </section>
  </div>
</template>
