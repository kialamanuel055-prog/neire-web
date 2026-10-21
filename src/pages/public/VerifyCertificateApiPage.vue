<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { api, ApiError } from '@/api/client'
import { formatDate } from '@/utils/format'

interface Verified {
  code: string
  studentName: string
  activity: string
  issuer: string
  issuedAt: string
}

const route = useRoute()
const code = ref('')
const result = ref<Verified | null>(null)
const error = ref('')
const loading = ref(false)

async function verify() {
  const c = code.value.trim()
  result.value = null
  error.value = ''
  if (!c) {
    error.value = 'Escreve o código do certificado.'
    return
  }
  loading.value = true
  try {
    result.value = await api<Verified>(`/certificates/verify/${encodeURIComponent(c)}`, { auth: false })
  } catch (e) {
    error.value =
      e instanceof ApiError && e.status === 404
        ? 'Não encontrámos nenhum certificado com este código.'
        : e instanceof ApiError
          ? e.message
          : 'Não foi possível verificar agora.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const raw = route.params.code ?? route.query.code
  const fromRoute = Array.isArray(raw) ? raw[0] : raw
  if (typeof fromRoute === 'string' && fromRoute) {
    code.value = fromRoute
    void verify()
  }
})
</script>

<template>
  <div class="mx-auto max-w-xl space-y-6 px-4 py-14">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Verificar certificado</h1>
      <p class="mt-2 text-slate-600">Confirma se um certificado NEIRE é autêntico, com o código impresso no documento.</p>
    </div>

    <form class="card space-y-4" @submit.prevent="verify">
      <div>
        <label class="label" for="vc-code">Código</label>
        <input id="vc-code" v-model="code" class="input uppercase" placeholder="NEIRE-XXXX-XXXX" autocomplete="off" />
      </div>
      <button type="submit" class="btn-primary" :disabled="loading">{{ loading ? 'A verificar...' : 'Verificar' }}</button>
    </form>

    <p v-if="error" class="card text-sm text-red-600">{{ error }}</p>

    <div v-if="result" class="card space-y-2 border-emerald-300">
      <p class="font-semibold text-emerald-700">Certificado válido</p>
      <p class="text-lg font-semibold text-slate-900">{{ result.studentName }}</p>
      <p class="text-slate-700">{{ result.activity }}</p>
      <p class="text-sm text-slate-500">{{ result.issuer }} · emitido em {{ formatDate(result.issuedAt) }}</p>
      <p class="text-xs text-slate-400">Código {{ result.code }}</p>
    </div>
  </div>
</template>
