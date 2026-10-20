<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { apiRegister } from '@/composables/useApiAuth'
import { ApiError } from '@/api/client'
import { homeByRole } from '@/config/navigation'
import { areas } from '@/config/labels'

const router = useRouter()

const kind = ref<'student' | 'company'>('student')
const form = reactive({
  name: '',
  email: '',
  password: '',
  course: '',
  year: '',
  sector: areas[0] as string,
  website: '',
})
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  if (!form.name.trim()) {
    error.value = 'Indica o nome.'
    return
  }
  if (form.password.length < 8) {
    error.value = 'A palavra-passe deve ter pelo menos 8 caracteres.'
    return
  }
  loading.value = true
  try {
    const user = await apiRegister({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: kind.value,
      ...(kind.value === 'student'
        ? { course: form.course.trim(), year: form.year.trim() }
        : { sector: form.sector, website: form.website.trim() }),
    })
    await router.push(homeByRole[user.role])
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Não foi possível criar a conta.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6 px-4 py-12">
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
        <label class="label" for="ra-name">{{ kind === 'student' ? 'Nome completo' : 'Nome da empresa' }}</label>
        <input id="ra-name" v-model="form.name" class="input" />
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="label" for="ra-email">Email</label>
          <input id="ra-email" v-model="form.email" type="email" autocomplete="username" class="input" />
        </div>
        <div>
          <label class="label" for="ra-pw">Palavra-passe (mínimo 8)</label>
          <input id="ra-pw" v-model="form.password" type="password" autocomplete="new-password" class="input" />
        </div>
      </div>

      <div v-if="kind === 'student'" class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="label" for="ra-course">Curso</label>
          <input id="ra-course" v-model="form.course" class="input" />
        </div>
        <div>
          <label class="label" for="ra-year">Ano académico</label>
          <input id="ra-year" v-model="form.year" class="input" placeholder="Ex.: 2.º ano" />
        </div>
      </div>
      <div v-else class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="label" for="ra-sector">Setor</label>
          <select id="ra-sector" v-model="form.sector" class="input">
            <option v-for="a in areas" :key="a" :value="a">{{ a }}</option>
          </select>
        </div>
        <div>
          <label class="label" for="ra-web">Website</label>
          <input id="ra-web" v-model="form.website" class="input" placeholder="https://" />
        </div>
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button type="submit" class="btn-primary" :disabled="loading">{{ loading ? 'A criar conta...' : 'Criar conta' }}</button>
      <p v-if="loading" class="text-xs text-slate-500">Pode demorar até 1 minuto se o servidor estiver a acordar.</p>
    </form>

    <p class="text-sm text-slate-600">
      Já tens conta?
      <RouterLink to="/entrar" class="text-brand-600 hover:underline">Entrar</RouterLink>
    </p>
  </div>
</template>
