<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ShieldAlert } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useComplaintsStore } from '@/stores/complaints'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { complaintCategories, complaintStatusLabels, complaintTone } from '@/config/labels'
import { formatDate } from '@/utils/format'

const auth = useAuthStore()
const store = useComplaintsStore()
const user = auth.user!

const form = reactive({ category: complaintCategories[0] as string, description: '', anonymous: true })
const error = ref('')
const done = ref(false)
const mine = computed(() => store.forAuthor(user.id))

function submit() {
  error.value = ''
  done.value = false
  if (form.description.trim().length < 20) {
    error.value = 'Descreve a situação com algum detalhe (mínimo 20 caracteres).'
    return
  }
  store.submit({
    category: form.category,
    description: form.description.trim(),
    author: form.anonymous ? undefined : { id: user.id, name: user.name },
  })
  form.description = ''
  done.value = true
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <PageHeader title="Denúncias e reclamações" subtitle="Canal confidencial para comunicar situações que afetam a integridade do NEIRE." />

    <form class="card space-y-4" @submit.prevent="submit">
      <div class="flex items-center gap-3">
        <span class="flex size-10 items-center justify-center rounded-xl bg-red-500/15 text-red-500"><ShieldAlert class="size-5" /></span>
        <p class="text-sm text-slate-600">
          Discriminação, favoritismo, assédio, abuso de posição ou irregularidades em processos seletivos.
          As denúncias são encaminhadas aos responsáveis definidos no Código de Ética.
        </p>
      </div>
      <div>
        <label class="label" for="dn-cat">Categoria</label>
        <select id="dn-cat" v-model="form.category" class="input">
          <option v-for="c in complaintCategories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div>
        <label class="label" for="dn-desc">Descrição</label>
        <textarea id="dn-desc" v-model="form.description" rows="6" class="input" placeholder="O que aconteceu, quando e onde?" />
      </div>
      <label class="flex items-start gap-3 text-sm text-slate-700">
        <input v-model="form.anonymous" type="checkbox" class="mt-1" />
        <span>Enviar de forma anónima. A tua identidade não fica associada à denúncia, mas também não poderás acompanhá-la aqui.</span>
      </label>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <p v-if="done" class="text-sm text-emerald-600">Denúncia enviada. Obrigado por ajudares a manter o processo transparente.</p>
      <button type="submit" class="btn-primary">Enviar denúncia</button>
    </form>

    <section v-if="mine.length" class="space-y-3">
      <h2 class="font-semibold text-slate-900">As minhas denúncias identificadas</h2>
      <div v-for="c in mine" :key="c.id" class="card space-y-2">
        <div class="flex items-center justify-between gap-2">
          <p class="font-medium text-slate-900">{{ c.category }} · {{ formatDate(c.createdAt) }}</p>
          <StatusBadge :label="complaintStatusLabels[c.status]" :tone="complaintTone[c.status]" />
        </div>
        <p v-if="c.response" class="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">Resposta: {{ c.response }}</p>
      </div>
    </section>
  </div>
</template>
