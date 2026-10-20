<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  Search, Briefcase, Building2, GraduationCap, Award, CalendarDays, Trophy, Rocket, Users,
} from 'lucide-vue-next'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useEventsStore } from '@/stores/events'
import { useCompaniesStore } from '@/stores/companies'
import { useProfilesStore } from '@/stores/profiles'

const router = useRouter()
const opps = useOpportunitiesStore()
const events = useEventsStore()
const companies = useCompaniesStore()
const profiles = useProfilesStore()

const stats = computed(() => [
  { value: opps.published.length, label: 'Oportunidades ativas' },
  { value: profiles.items.length, label: 'Perfis de talentos' },
  { value: companies.items.filter((c) => c.status === 'ativa' || c.status === 'verificada').length, label: 'Empresas parceiras' },
  { value: events.items.length, label: 'Eventos' },
])

const categories = [
  { label: 'Estágios', icon: Briefcase },
  { label: 'Empregos', icon: Building2 },
  { label: 'Formação', icon: GraduationCap },
  { label: 'Bolsas', icon: Award },
  { label: 'Eventos', icon: CalendarDays },
  { label: 'Concursos', icon: Trophy },
  { label: 'Projetos', icon: Rocket },
]

const audiences = [
  { icon: GraduationCap, title: 'Estudantes', text: 'Cria o teu perfil profissional, mostra o teu portfólio e candidata-te a estágios, empregos e formações.' },
  { icon: Building2, title: 'Empresas', text: 'Publica oportunidades, procura talentos e lança desafios aos estudantes do INSTIC.' },
  { icon: Users, title: 'Alumni', text: 'Continua ligado: orienta como mentor, partilha oportunidades e apoia a próxima geração.' },
]

const ciclo = ['Descobrir', 'Desenvolver', 'Conectar', 'Oportunizar', 'Acompanhar', 'Transformar']

function search() {
  router.push({ name: 'login', query: { redirect: '/app/estudante/oportunidades' } })
}
</script>

<template>
  <div>
    <section class="bg-hero text-white">
      <div class="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2">
        <div>
          <p class="text-sm font-semibold uppercase tracking-widest text-violet-300">INSTIC · NEIRE</p>
          <h1 class="font-serif font-medium tracking-tight mt-4 text-4xl leading-tight sm:text-6xl">
            Conectando<br /><span class="text-gradient">Talentos ao Futuro</span>
          </h1>
          <p class="mt-6 max-w-lg text-lg text-white/70">
            Encontra oportunidades, desenvolve competências, constrói projetos e conecta-te com empresas que acreditam no teu potencial.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <RouterLink to="/entrar" class="btn-gradient">Sou estudante</RouterLink>
            <RouterLink to="/entrar" class="rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold hover:bg-white/10">
              Sou empresa
            </RouterLink>
          </div>
          <form class="glass mt-8 flex items-center gap-2 rounded-2xl p-2" @submit.prevent="search">
            <Search class="ml-3 size-5 text-white/50" />
            <input class="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-white placeholder-white/40 outline-none" placeholder="O que estás a procurar?" />
            <button type="submit" class="btn-primary">Pesquisar</button>
          </form>
        </div>

        <div class="relative mx-auto hidden size-96 lg:block">
          <div class="absolute inset-6 rounded-full bg-linear-to-br from-orange-400/40 via-pink-500/30 to-blue-500/40 blur-3xl" />
          <div class="absolute inset-0 rounded-full border border-violet-400/30" />
          <div class="absolute inset-10 rounded-full border border-pink-400/30" />
          <div class="absolute inset-0 flex items-center justify-center text-white">
            <span class="glass rounded-3xl p-10"><Rocket class="size-20 text-violet-300" /></span>
          </div>
          <div class="glass absolute left-0 top-12 rounded-xl px-4 py-2 text-sm font-semibold">Novas oportunidades esperam por ti</div>
          <div class="glass absolute bottom-10 right-0 rounded-xl px-4 py-2 text-sm">
            <span class="font-bold text-orange-300">{{ opps.published.length }}</span> vagas ativas
          </div>
          <!-- ANCHOR:home-hero-art -->
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-14">
      <h2 class="text-xl font-bold text-slate-900">Explora por categoria</h2>
      <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <RouterLink
          v-for="c in categories"
          :key="c.label"
          to="/entrar"
          class="card flex flex-col items-center gap-2 p-4 text-center text-sm font-medium text-slate-700 transition hover:border-brand-500"
        >
          <component :is="c.icon" class="size-6 text-brand-600" />
          {{ c.label }}
        </RouterLink>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-14">
      <div class="grid gap-6 md:grid-cols-3">
        <article v-for="a in audiences" :key="a.title" class="card p-6">
          <component :is="a.icon" class="size-8 text-brand-600" />
          <h2 class="mt-4 text-xl font-bold text-slate-900">{{ a.title }}</h2>
          <p class="mt-2 text-slate-600">{{ a.text }}</p>
        </article>
      </div>
    </section>

    <section class="bg-hero py-14 text-white">
      <div class="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 text-center lg:grid-cols-4">
        <div v-for="s in stats" :key="s.label">
          <p class="text-gradient text-4xl font-extrabold">{{ s.value }}</p>
          <p class="mt-1 text-sm text-white/60">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <section class="py-14">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4">
        <template v-for="(etapa, i) in ciclo" :key="etapa">
          <span class="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">{{ etapa }}</span>
          <span v-if="i < ciclo.length - 1" class="text-brand-500">&rarr;</span>
        </template>
      </div>
      <p class="mt-6 text-center text-slate-500">Nenhuma oportunidade deve depender de quem o estudante conhece.</p>
    </section>

    <!-- ANCHOR:home-sections -->
  </div>
</template>
