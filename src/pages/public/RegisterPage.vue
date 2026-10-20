<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountsStore } from '@/stores/accounts'
import { useProfilesStore } from '@/stores/profiles'
import { useCompaniesStore } from '@/stores/companies'
import { startSession } from '@/composables/useSession'
import { homeByRole } from '@/config/navigation'
import { areas } from '@/config/labels'
import type { Account, Company } from '@/types'

const router = useRouter()
const accounts = useAccountsStore()
const profiles = useProfilesStore()
const companies = useCompaniesStore()

const kind = ref<'student' | 'company'>('student')
const error = ref('')
const form = reactive({ name: '', email: '', course: '', year: '', sector: areas[0] as string, website: '' })

function enter(acc: Account) {
  startSession({ id: acc.id, name: acc.name, email: acc.email, role: acc.role })
  router.push(homeByRole[acc.role])
}

function submit() {
  error.value = ''
  const name = form.name.trim()
  const email = form.email.trim()
  if (!name) {
    error.value = 'Indica o nome.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error.value = 'Indica um email válido.'
    return
  }
  if (accounts.byEmail(email)) {
    error.value = 'Já existe uma conta com este email.'
    return
  }
  const acc = accounts.create({ name, email, role: kind.value })
  if (kind.value === 'student') {
    const p = profiles.ensure({ id: acc.id, name: acc.name })
    p.course = form.course.trim()
    p.year = form.year.trim()
  } else {
    companies.items.push({
      id: acc.id,
      name,
      sector: form.sector,
      website: form.website.trim(),
      status: 'pendente',
    } as Company)
  }
  enter(acc)
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-8 px-4 py-12">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Criar conta</h1>
      <p class="mt-2 text-slate-600">
        Estudantes entram logo. Empresas ficam em verificação (Pendente → Em análise → Verificada → Ativa) antes de publicar.
      </p>
    </div>

    <form class="card space-y-4" @submit.prevent="submit">
      <div class="flex gap-4 text-sm">
        <label class="flex items-center gap-2"><input v-model="kind" type="radio" value="student" /> Estudante</label>
        <label class="flex items-center gap-2"><input v-model="kind" type="radio" value="company" /> Empresa</label>
      </div>

      <div>
        <label class="label" for="r-name">{{ kind === 'student' ? 'Nome completo' : 'Nome da empresa' }}</label>
        <input id="r-name" v-model="form.name" class="input" />
      </div>
      <div>
        <label class="label" for="r-email">Email</label>
        <input id="r-email" v-model="form.email" type="email" class="input" />
      </div>

      <template v-if="kind === 'student'">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label" for="r-course">Curso</label>
            <input id="r-course" v-model="form.course" class="input" />
          </div>
          <div>
            <label class="label" for="r-year">Ano académico</label>
            <input id="r-year" v-model="form.year" class="input" placeholder="Ex.: 2.º ano" />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label" for="r-sector">Setor</label>
            <select id="r-sector" v-model="form.sector" class="input">
              <option v-for="a in areas" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div>
            <label class="label" for="r-web">Website</label>
            <input id="r-web" v-model="form.website" class="input" placeholder="https://" />
          </div>
        </div>
      </template>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button type="submit" class="btn-primary">Criar conta</button>
      <p class="text-xs text-slate-500">
        Modo de desenvolvimento: sem palavra-passe. O registo real, com autenticação segura, chega com o backend.
      </p>
    </form>

    <section v-if="accounts.items.length > 0" class="space-y-3">
      <h2 class="font-semibold text-slate-900">Contas criadas neste dispositivo</h2>
      <div v-for="a in accounts.items" :key="a.id" class="card flex items-center justify-between gap-3">
        <div>
          <p class="font-medium text-slate-900">{{ a.name }}</p>
          <p class="text-sm text-slate-500">{{ a.email }} · {{ a.role === 'company' ? 'Empresa' : a.role === 'alumni' ? 'Alumni' : 'Estudante' }}</p>
        </div>
        <button class="btn-secondary" @click="enter(a)">Entrar</button>
      </div>
    </section>
  </div>
</template>
