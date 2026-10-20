<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCertificatesStore } from '@/stores/certificates'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import CertificateCard from '@/components/CertificateCard.vue'

const auth = useAuthStore()
const certs = useCertificatesStore()
const mine = computed(() => certs.byStudent(auth.user!.id))
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <PageHeader title="Os meus certificados" subtitle="Cada certificado tem um código e um QR Code que as empresas podem verificar." />
    <EmptyState v-if="mine.length === 0" text="Ainda não tens certificados. Participa em eventos e formações do NEIRE." />
    <CertificateCard v-for="c in mine" :key="c.id" :certificate="c" />
  </div>
</template>
