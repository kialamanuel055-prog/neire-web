<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase, Rocket, GraduationCap, Users,
  ShieldCheck, Zap, Target, TrendingUp,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { homeByRole } from '@/config/navigation'
import NeireLogo from '@/components/NeireLogo.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import type { Role } from '@/types'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const login = ref('')
const password = ref('')
const show = ref(false)
const error = ref('')

const devProfiles: { role: Role; label: string }[] = [
  { role: 'student', label: 'Estudante' },
  { role: 'alumni', label: 'Alumni' },
  { role: 'company', label: 'Empresa' },
  { role: 'admin', label: 'Admin' },
]

const features = [
  { icon: ShieldCheck, title: 'Seguro', text: 'Os teus dados protegidos' },
  { icon: Zap, title: 'Rápido', text: 'Oportunidades em poucos cliques' },
  { icon: Target, title: 'Conectado', text: 'Empresas e profissionais' },
  { icon: TrendingUp, title: 'Transformador', text: 'Desenvolve competências' },
]

function go(role: Role) {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
  router.push(redirect ?? homeByRole[role])
}

function submit() {
  error.value = ''
  if (!login.value.trim() || !password.value) {
    error.value = 'Indica o email e a senha.'
    return
  }
  const role = auth.loginWithEmail(login.value)
  if (!role) {
    error.value = 'Conta não encontrada. Em modo de desenvolvimento usa os perfis abaixo.'
    return
  }
  go(role)
}

function quick(role: Role) {
  auth.loginAs(role)
  go(role)
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-ink">
    <div class="grid flex-1 lg:grid-cols-2">
      <!-- Lado esquerdo -->
      <section class="bg-hero relative hidden overflow-hidden p-10 text-white lg:block">
        <NeireLogo :size="44" subtitle />
        <h1 class="mt-16 text-5xl font-extrabold leading-tight">
          Conectando<br />
          <span class="text-gradient">Talentos ao Futuro</span>
        </h1>
        <p class="mt-5 max-w-sm text-white/70">
          A plataforma que aproxima estudantes, empresas e oportunidades para transformar ideias em impacto real.
        </p>
        <div class="mt-4 h-0.5 w-8 bg-orange-400" />

        <div class="relative mx-auto mt-14 size-80">
          <div class="absolute inset-0 rounded-full border border-violet-400/30" />
          <div class="absolute inset-8 rounded-full border border-pink-400/30" />
          <div class="absolute inset-16 rounded-full bg-linear-to-br from-orange-400/30 via-pink-500/30 to-blue-500/30 blur-2xl" />
          <span class="glass absolute left-2 top-10 flex size-12 items-center justify-center rounded-full"><Briefcase class="size-5 text-violet-300" /></span>
          <span class="glass absolute right-6 top-0 flex size-12 items-center justify-center rounded-full"><Rocket class="size-5 text-pink-300" /></span>
          <span class="glass absolute bottom-10 left-0 flex size-12 items-center justify-center rounded-full"><GraduationCap class="size-5 text-orange-300" /></span>
          <span class="glass absolute bottom-2 right-10 flex size-12 items-center justify-center rounded-full"><Users class="size-5 text-blue-300" /></span>
          <div class="absolute inset-0 flex items-center justify-center"><NeireLogo :size="72" :text="false" /></div>
          <!-- ANCHOR:login-hero-art -->
        </div>
      </section>

      <!-- Lado direito -->
      <section class="flex items-center justify-center bg-slate-50 p-6 sm:p-10">
        <div class="card w-full max-w-md space-y-6 p-8">
          <div class="flex items-center justify-between">
            <span class="lg:hidden"><NeireLogo :size="32" /></span>
            <span class="ml-auto"><ThemeToggle /></span>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-slate-900">Bem-vindo(a) de volta! &#128075;</h2>
            <p class="text-slate-500">Faz login para continuar na plataforma NEIRE</p>
          </div>

          <form class="space-y-4" @submit.prevent="submit">
            <div>
              <label class="label" for="login">Email ou telefone</label>
              <div class="relative">
                <Mail class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input id="login" v-model="login" class="input pl-10" placeholder="exemplo@instic.ao" autocomplete="username" />
              </div>
            </div>
            <div>
              <label class="label" for="password">Senha</label>
              <div class="relative">
                <Lock class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  v-model="password"
                  :type="show ? 'text' : 'password'"
                  class="input px-10"
                  placeholder="••••••••"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  :aria-label="show ? 'Esconder senha' : 'Mostrar senha'"
                  @click="show = !show"
                >
                  <EyeOff v-if="show" class="size-4" />
                  <Eye v-else class="size-4" />
                </button>
              </div>
              <p class="mt-2 text-right text-sm text-brand-600">Esqueceu a senha?</p>
            </div>

            <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

            <button type="submit" class="btn-gradient w-full justify-between">
              <span class="mx-auto">Entrar</span>
              <ArrowRight class="size-4" />
            </button>
          </form>

          <div class="flex items-center gap-3 text-xs text-slate-400">
            <span class="h-px flex-1 bg-slate-200" /> ou continue com <span class="h-px flex-1 bg-slate-200" />
          </div>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="p in ['Google', 'Microsoft', 'LinkedIn', 'Apple']"
              :key="p"
              type="button"
              disabled
              title="Disponível com o backend"
              class="btn-secondary px-1 text-xs"
            >
              {{ p }}
            </button>
          </div>

          <div class="rounded-xl border border-dashed border-slate-300 p-3">
            <p class="text-xs font-medium text-slate-500">Modo de desenvolvimento: entrar como</p>
            <div class="mt-2 flex flex-wrap gap-2">
              <button v-for="p in devProfiles" :key="p.role" type="button" class="btn-secondary px-3 py-1 text-xs" @click="quick(p.role)">
                {{ p.label }}
              </button>
            </div>
          </div>

          <p class="text-center text-sm text-slate-500">
            Ainda não tens conta? <span class="font-medium text-brand-600">Criar conta</span>
          </p>
        </div>
      </section>
    </div>

    <div class="border-t border-white/10 bg-ink px-6 py-5 text-white">
      <div class="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="f in features" :key="f.title" class="flex items-center gap-3">
          <component :is="f.icon" class="size-7 text-violet-400" />
          <div>
            <p class="text-sm font-semibold text-violet-300">{{ f.title }}</p>
            <p class="text-xs text-white/50">{{ f.text }}</p>
          </div>
        </div>
      </div>
      <p class="mt-4 text-center text-xs text-white/40">&copy; 2026 NEIRE. Todos os direitos reservados.</p>
    </div>
  </div>
</template>
