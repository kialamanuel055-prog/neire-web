<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { apiLogin } from '@/composables/useApiAuth'
import { ApiError } from '@/api/client'
import { homeByRole } from '@/config/navigation'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  if (!email.value.trim() || !password.value) {
    error.value = 'Indica o email e a palavra-passe.'
    return
  }
  loading.value = true
  try {
    const user = await apiLogin(email.value.trim(), password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    await router.push(redirect ?? homeByRole[user.role])
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Não foi possível entrar.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-md space-y-6 px-4 py-14">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Entrar</h1>
      <p class="mt-2 text-slate-600">Acede ao teu espaço NEIRE.</p>
    </div>

    <form class="card space-y-4" @submit.prevent="submit">
      <div>
        <label class="label" for="si-email">Email</label>
        <input id="si-email" v-model="email" type="email" autocomplete="username" class="input" />
      </div>
      <div>
        <label class="label" for="si-pw">Palavra-passe</label>
        <input id="si-pw" v-model="password" type="password" autocomplete="current-password" class="input" />
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button type="submit" class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'A entrar...' : 'Entrar' }}
      </button>
      <p v-if="loading" class="text-xs text-slate-500">
        O primeiro acesso depois de algum tempo parado pode demorar até 1 minuto.
      </p>
    </form>

    <p class="text-sm text-slate-600">
      Ainda não tens conta?
      <RouterLink to="/registo" class="text-brand-600 hover:underline">Criar conta</RouterLink>
    </p>
  </div>
</template>
