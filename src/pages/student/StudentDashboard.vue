<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Briefcase, FileText, CalendarDays, Award } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useApplicationsStore } from '@/stores/applications'
import { useEventsStore } from '@/stores/events'
import { useProfilesStore } from '@/stores/profiles'
import { useCertificatesStore } from '@/stores/certificates'
import StatCard from '@/components/StatCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import Avatar from '@/components/Avatar.vue'
import { modalityLabels, typeLabels } from '@/config/labels'
import { formatDate, isPast } from '@/utils/format'

const auth = useAuthStore()
const opps = useOpportunitiesStore()
const apps = useApplicationsStore()
const events = useEventsStore()
const profiles = useProfilesStore()
const certs = useCertificatesStore()

const userId = auth.user!.id
profiles.ensure(auth.user!)

const profile = computed(() => profiles.byUser(userId)!)
const percent = computed(() => profiles.completeness(profile.value))
const available = computed(() => opps.published.filter((o) => !apps.find(o.id, userId)))
const recommended = computed(() => available.value.slice(0, 4))
const myApps = computed(() => apps.forStudent(userId))
const inReview = computed(() => myApps.value.filter((a) => a.status === 'em_analise').length)
const myEvents = computed(() => events.items.filter((e) => e.registered.includes(userId)).length)
const myCerts = computed(() => certs.byStudent(userId).length)
const upcoming = computed(() => events.sorted.filter((e) => !isPast(e.date)).slice(0, 3))

function day(iso: string) {
  return new Date(iso + 'T12:00:00').getDate()
}
function month(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-PT', { month: 'short' }).replace('.', '')
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Bem-vindo(a) de volta, {{ auth.user?.name }}! &#128075;</h1>
      <p class="text-slate-500">Aqui está o que acontece contigo hoje.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard :icon="Briefcase" tone="blue" label="Oportunidades" :value="available.length" hint="disponíveis para ti" />
      <StatCard :icon="FileText" tone="pink" label="Candidaturas" :value="myApps.length" :hint="`${inReview} em análise`" />
      <StatCard :icon="CalendarDays" tone="violet" label="Eventos" :value="myEvents" hint="inscrições ativas" />
      <StatCard :icon="Award" tone="green" label="Certificados" :value="myCerts" hint="conquistados" />
    </div>

    <div class="grid gap-6 xl:grid-cols-3">
      <section class="space-y-4 xl:col-span-2">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-slate-900">Oportunidades recomendadas para ti</h2>
          <RouterLink to="/app/estudante/oportunidades" class="text-sm text-brand-600 hover:underline">Ver todas</RouterLink>
        </div>

        <p v-if="recommended.length === 0" class="card text-sm text-slate-500">Sem novas oportunidades por agora.</p>

        <div class="grid gap-4 sm:grid-cols-2">
          <article v-for="o in recommended" :key="o.id" class="card flex flex-col gap-3">
            <div class="flex items-start gap-3">
              <Avatar :name="o.companyName" square />
              <div class="min-w-0">
                <h3 class="font-semibold leading-snug text-slate-900">{{ o.title }}</h3>
                <p class="text-sm text-slate-500">{{ o.companyName }}</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <StatusBadge :label="typeLabels[o.type]" tone="blue" />
              <StatusBadge :label="modalityLabels[o.modality]" />
            </div>
            <p class="text-xs text-slate-500">Prazo: {{ formatDate(o.deadline) }}</p>
            <RouterLink :to="`/app/estudante/oportunidades/${o.id}`" class="btn-primary mt-auto">Candidatar-me</RouterLink>
          </article>
        </div>
      </section>

      <aside class="space-y-4">
        <div class="card">
          <div class="flex justify-between text-sm">
            <span class="font-medium text-slate-700">Perfil</span>
            <span class="text-slate-500">{{ percent }}% completo</span>
          </div>
          <div class="mt-2 h-2 rounded-full bg-slate-100">
            <div class="h-2 rounded-full bg-linear-to-r from-orange-400 via-pink-500 to-violet-500" :style="{ width: percent + '%' }" />
          </div>
          <RouterLink v-if="percent < 100" to="/app/estudante/perfil" class="mt-2 inline-block text-xs text-brand-600 hover:underline">
            Completar perfil
          </RouterLink>
        </div>

        <div class="card space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-slate-900">Próximos eventos</h2>
            <RouterLink to="/app/estudante/eventos" class="text-sm text-brand-600 hover:underline">Ver todos</RouterLink>
          </div>
          <p v-if="upcoming.length === 0" class="text-sm text-slate-500">Sem eventos agendados.</p>
          <ul class="space-y-3">
            <li v-for="e in upcoming" :key="e.id" class="flex items-center gap-3">
              <span class="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <span class="text-lg font-bold leading-none">{{ day(e.date) }}</span>
                <span class="text-[10px] uppercase">{{ month(e.date) }}</span>
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-slate-900">{{ e.title }}</p>
                <p class="text-xs text-slate-500">{{ e.type }} · {{ e.time }} · {{ e.location }}</p>
              </div>
            </li>
          </ul>
        </div>

        <RouterLink to="/app/estudante/mentores" class="card block transition hover:border-brand-500">
          <p class="font-semibold text-slate-900">Precisas de orientação?</p>
          <p class="mt-1 text-sm text-slate-500">Encontra um mentor Alumni na tua área.</p>
        </RouterLink>
      </aside>
    </div>
    <!-- ANCHOR:student-dashboard-sections -->
  </div>
</template>
