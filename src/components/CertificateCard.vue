<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import QRCode from 'qrcode'
import type { Certificate } from '@/types'
import { formatDate } from '@/utils/format'

const props = defineProps<{ certificate: Certificate }>()

const qr = ref('')
const verifyUrl = computed(() => `${window.location.origin}/verificar/${props.certificate.code}`)
const copied = ref(false)

onMounted(async () => {
  try {
    qr.value = await QRCode.toDataURL(verifyUrl.value, { margin: 1, width: 160 })
  } catch {
    qr.value = ''
  }
})

async function copy() {
  try {
    await navigator.clipboard.writeText(verifyUrl.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    /* ignora */
  }
}
</script>

<template>
  <article class="card flex flex-col gap-4 sm:flex-row sm:items-center">
    <div class="flex-1 space-y-1">
      <p class="text-xs uppercase tracking-widest text-brand-600">Certificado NEIRE</p>
      <h2 class="text-lg font-bold text-slate-900">{{ certificate.activity }}</h2>
      <p class="text-sm text-slate-600">Atribuído a {{ certificate.studentName }}</p>
      <p class="text-sm text-slate-500">{{ certificate.issuer }} · {{ formatDate(certificate.issuedAt) }}</p>
      <p class="font-mono text-sm text-slate-700">{{ certificate.code }}</p>
      <div class="flex gap-2 pt-2">
        <button class="btn-secondary" @click="copy">{{ copied ? 'Copiado' : 'Copiar link de verificação' }}</button>
      </div>
    </div>
    <img v-if="qr" :src="qr" alt="QR Code de verificação" class="size-32 shrink-0 self-center" />
  </article>
</template>
