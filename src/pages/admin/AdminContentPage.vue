<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useContentStore } from '@/stores/content'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { newsCategories } from '@/config/content'
import { formatDate } from '@/utils/format'

const content = useContentStore()
const error = ref('')

const today = () => new Date().toISOString().slice(0, 10)

const news = reactive({ title: '', category: newsCategories[0] as string, summary: '', body: '', published: true })
const story = reactive({ title: '', personName: '', role: '', story: '', published: true })

function addNews() {
  error.value = ''
  if (!news.title.trim() || !news.summary.trim()) {
    error.value = 'A notícia precisa de título e resumo.'
    return
  }
  content.addNews({ ...news, title: news.title.trim(), summary: news.summary.trim(), body: news.body.trim(), date: today() })
  news.title = ''
  news.summary = ''
  news.body = ''
}

function addStory() {
  error.value = ''
  if (!story.title.trim() || !story.story.trim()) {
    error.value = 'A história precisa de título e texto.'
    return
  }
  content.addStory({
    title: story.title.trim(),
    personName: story.personName.trim(),
    role: story.role.trim(),
    story: story.story.trim(),
    published: story.published,
    date: today(),
  })
  story.title = ''
  story.personName = ''
  story.role = ''
  story.story = ''
}
</script>

<template>
  <div class="space-y-10">
    <PageHeader title="Conteúdo" subtitle="Notícias e histórias de impacto que aparecem na página pública." />
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

    <section class="space-y-4">
      <h2 class="font-semibold text-slate-900">Notícias</h2>
      <form class="card grid gap-4 sm:grid-cols-2" @submit.prevent="addNews">
        <div>
          <label class="label" for="n-title">Título</label>
          <input id="n-title" v-model="news.title" class="input" />
        </div>
        <div>
          <label class="label" for="n-cat">Categoria</label>
          <select id="n-cat" v-model="news.category" class="input">
            <option v-for="c in newsCategories" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="sm:col-span-2">
          <label class="label" for="n-sum">Resumo</label>
          <input id="n-sum" v-model="news.summary" class="input" />
        </div>
        <div class="sm:col-span-2">
          <label class="label" for="n-body">Texto</label>
          <textarea id="n-body" v-model="news.body" rows="3" class="input" />
        </div>
        <label class="flex items-center gap-2 text-sm sm:col-span-2"><input v-model="news.published" type="checkbox" /> Publicar já</label>
        <div class="sm:col-span-2"><button type="submit" class="btn-primary">Criar notícia</button></div>
      </form>

      <div v-for="n in content.news" :key="n.id" class="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="font-medium text-slate-900">{{ n.title }}</p>
          <p class="text-sm text-slate-500">{{ n.category }} · {{ formatDate(n.date) }}</p>
        </div>
        <div class="flex items-center gap-2">
          <StatusBadge :label="n.published ? 'Publicada' : 'Oculta'" :tone="n.published ? 'green' : 'gray'" />
          <button class="btn-secondary" @click="content.toggleNews(n.id)">{{ n.published ? 'Ocultar' : 'Publicar' }}</button>
          <button class="btn-danger" @click="content.removeNews(n.id)">Apagar</button>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="font-semibold text-slate-900">Histórias de impacto</h2>
      <form class="card grid gap-4 sm:grid-cols-2" @submit.prevent="addStory">
        <div class="sm:col-span-2">
          <label class="label" for="h-title">Título</label>
          <input id="h-title" v-model="story.title" class="input" placeholder="Ex.: Da sala de aula ao primeiro emprego" />
        </div>
        <div>
          <label class="label" for="h-person">Pessoa</label>
          <input id="h-person" v-model="story.personName" class="input" />
        </div>
        <div>
          <label class="label" for="h-role">Cargo / curso</label>
          <input id="h-role" v-model="story.role" class="input" />
        </div>
        <div class="sm:col-span-2">
          <label class="label" for="h-text">História</label>
          <textarea id="h-text" v-model="story.story" rows="4" class="input" />
        </div>
        <label class="flex items-center gap-2 text-sm sm:col-span-2"><input v-model="story.published" type="checkbox" /> Publicar já</label>
        <div class="sm:col-span-2"><button type="submit" class="btn-primary">Criar história</button></div>
      </form>

      <div v-for="s in content.stories" :key="s.id" class="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="font-medium text-slate-900">{{ s.title }}</p>
          <p class="text-sm text-slate-500">{{ s.personName }} · {{ formatDate(s.date) }}</p>
        </div>
        <div class="flex items-center gap-2">
          <StatusBadge :label="s.published ? 'Publicada' : 'Oculta'" :tone="s.published ? 'green' : 'gray'" />
          <button class="btn-secondary" @click="content.toggleStory(s.id)">{{ s.published ? 'Ocultar' : 'Publicar' }}</button>
          <button class="btn-danger" @click="content.removeStory(s.id)">Apagar</button>
        </div>
      </div>
    </section>
  </div>
</template>
