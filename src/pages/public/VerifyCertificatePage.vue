<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCertificatesStore } from '@/stores/certificates'
import { formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const certs = useCertificatesStore()

const code = computed(() => String(route.params.code ?? '').trim())
const result = computed(() => (code.value ? certs.byCode(code.value) : undefined))
const input = ref(code.value)

function verify() {
  const c = input.value.trim()
  router.push(c ? `/verificar/${encodeURIComponent(c)}` : '/verificar')
}
</script>

<template>
  <div class="mx-auto max-w-xl px-4 py-14">
    <h1 class="text-3xl font-bold text-slate-900">Verificar certificado</h1>
    <p class="mt-2 text-slate-600">Introduz o código do certificado ou lê o QR Code.</p>

    <form class="mt-6 flex gap-2" @submit.prevent="verify">
      <input v-model="input" class="input" placeholder="NEIRE-XXXX-XXXX" />
      <button type="submit" class="btn-primary">Verificar</button>
    </form>

    <div v-if="code && result" class="card mt-6 border-emerald-300 bg-emerald-50">
      <p class="font-semibold text-emerald-800">Certificado válido</p>
      <dl class="mt-3 space-y-1 text-sm text-slate-700">
        <div><dt class="inline font-medium">Nome: </dt><dd class="inline">{{ result.studentName }}</dd></div>
        <div><dt class="inline font-medium">Atividade: </dt><dd class="inline">{{ result.activity }}</dd></div>
        <div><dt class="inline font-medium">Entidade: </dt><dd class="inline">{{ result.issuer }}</dd></div>
        <div><dt class="inline font-medium">Emitido em: </dt><dd class="inline">{{ formatDate(result.issuedAt) }}</dd></div>
        <div><dt class="inline font-medium">Código: </dt><dd class="inline font-mono">{{ result.code }}</dd></div>
      </dl>
    </div>

    <div v-else-if="code" class="card mt-6 border-red-300 bg-red-50 text-sm text-red-700">
      Não foi encontrado nenhum certificado com este código.
    </div>
  </div>
</template>
