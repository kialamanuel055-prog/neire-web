<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useArchiveStore } from '@/stores/archive'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { archiveCategories } from '@/config/labels'
import { formatDate } from '@/utils/format'

const store = useArchiveStore()
const form = reactive({ title: '', category: archiveCategories[0] as string, description: '', link: '' })
const error = ref('')
const filter = ref('')

const list = computed(() => store.items.filter((d) => !filter.value || d.category === filter.value))

function submit() {
  error.value = ''
  if (!form.title.trim()) {
    error.value = 'Indica o título do documento.'
    return
  }
  store.add({
    title: form.title.trim(),
    category: form.category,
    description: form.description.trim(),
    link: form.link.trim(),
  })
  form.title = ''
  form.description = ''
  form.link = ''
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Arquivo institucional" subtitle="Memória do NEIRE: estatutos, regulamentos, relatórios, atas e documentos de transição." />

    <form class="card grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
      <h2 class="font-semibold text-slate-900 sm:col-span-2">Arquivar documento</h2>
      <div>
        <label class="label" for="ar-title">Título</label>
        <input id="ar-title" v-model="form.title" class="input" />
      </div>
      <div>
        <label class="label" for="ar-cat">Categoria</label>
        <select id="ar-cat" v-model="form.category" class="input">
          <option v-for="c in archiveCategories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="sm:col-span-2">
        <label class="label" for="ar-link">Link do documento (Drive, OneDrive...)</label>
        <input id="ar-link" v-model="form.link" class="input" placeholder="https://" />
      </div>
      <div class="sm:col-span-2">
        <label class="label" for="ar-desc">Descrição</label>
        <textarea id="ar-desc" v-model="form.description" rows="2" class="input" />
      </div>
      <p v-if="error" class="text-sm text-red-600 sm:col-span-2">{{ error }}</p>
      <div class="sm:col-span-2"><button type="submit" class="btn-primary">Arquivar</button></div>
    </form>

    <section class="space-y-3">
      <select v-model="filter" class="input max-w-xs">
        <option value="">Todas as categorias</option>
        <option v-for="c in archiveCategories" :key="c" :value="c">{{ c }}</option>
      </select>

      <EmptyState v-if="list.length === 0" text="Nenhum documento nesta categoria." />

      <div v-for="d in list" :key="d.id" class="card flex flex-wrap items-start justify-between gap-3">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="font-semibold text-slate-900">{{ d.title }}</p>
            <StatusBadge :label="d.category" tone="blue" />
          </div>
          <p v-if="d.description" class="text-sm text-slate-600">{{ d.description }}</p>
          <p class="text-xs text-slate-500">{{ d.uploadedBy }} · {{ formatDate(d.createdAt) }}</p>
          <a v-if="d.link" :href="d.link" target="_blank" rel="noopener" class="text-sm text-brand-600 hover:underline">Abrir documento</a>
        </div>
        <button class="btn-danger" @click="store.remove(d.id)">Remover</button>
      </div>
    </section>
  </div>
</template>
