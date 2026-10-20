<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useProfilesStore } from '@/stores/profiles'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { skillCategories, skillLevelLabels, skillTone } from '@/config/labels'

const auth = useAuthStore()
const store = useProfilesStore()
const userId = auth.user!.id
store.ensure(auth.user!)

const profile = computed(() => store.byUser(userId)!)
const percent = computed(() => store.completeness(profile.value))

const languagesText = ref(profile.value.languages.join(', '))
function saveLanguages() {
  profile.value.languages = languagesText.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

const newSkill = reactive({ name: '', category: skillCategories[0] as string })
function addSkill() {
  const name = newSkill.name.trim()
  if (!name) return
  store.addSkill(userId, { name, category: newSkill.category, level: 'declarada' })
  newSkill.name = ''
}

const newProject = reactive({ title: '', description: '', link: '' })
function addProject() {
  const title = newProject.title.trim()
  if (!title) return
  store.addProject(userId, {
    title,
    description: newProject.description.trim(),
    link: newProject.link.trim(),
  })
  newProject.title = ''
  newProject.description = ''
  newProject.link = ''
}
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <PageHeader title="Perfil Profissional NEIRE" subtitle="É isto que as empresas veem quando procuram talentos." />

    <div class="card">
      <div class="flex justify-between text-sm">
        <span class="font-medium text-slate-700">Perfil completo</span>
        <span class="text-slate-500">{{ percent }}%</span>
      </div>
      <div class="mt-2 h-2 rounded-full bg-slate-100">
        <div class="h-2 rounded-full bg-brand-600" :style="{ width: percent + '%' }" />
      </div>
      <p class="mt-2 text-xs text-slate-500">
        Para chegar a 100%: título, curso, ano, localização, idiomas, pelo menos 3 competências e 1 projeto.
      </p>
    </div>

    <section class="card space-y-4">
      <h2 class="font-semibold text-slate-900">Informação</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label class="label" for="headline">Título profissional</label>
          <input id="headline" v-model="profile.headline" class="input" placeholder="Ex.: Estudante de Engenharia | Redes" />
        </div>
        <div>
          <label class="label" for="course">Curso</label>
          <input id="course" v-model="profile.course" class="input" />
        </div>
        <div>
          <label class="label" for="year">Ano académico</label>
          <input id="year" v-model="profile.year" class="input" placeholder="Ex.: 3.º ano" />
        </div>
        <div>
          <label class="label" for="location">Localização</label>
          <input id="location" v-model="profile.location" class="input" />
        </div>
        <div>
          <label class="label" for="languages">Idiomas (separados por vírgula)</label>
          <input id="languages" v-model="languagesText" class="input" @change="saveLanguages" @blur="saveLanguages" />
        </div>
      </div>
    </section>

    <section class="card space-y-4">
      <h2 class="font-semibold text-slate-900">Competências</h2>
      <p class="text-xs text-slate-500">
        Declarada → Comprovada → Validada. O NEIRE confirma com certificados, projetos, testes ou recomendações.
      </p>

      <ul class="flex flex-wrap gap-2">
        <li
          v-for="s in profile.skills"
          :key="s.name"
          class="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm"
        >
          {{ s.name }}
          <StatusBadge :label="skillLevelLabels[s.level]" :tone="skillTone[s.level]" />
          <button class="text-slate-400 hover:text-red-600" :aria-label="`Remover ${s.name}`" @click="store.removeSkill(userId, s.name)">
            <Trash2 class="size-4" />
          </button>
        </li>
        <li v-if="profile.skills.length === 0" class="text-sm text-slate-500">Ainda sem competências.</li>
      </ul>

      <form class="flex flex-wrap gap-2" @submit.prevent="addSkill">
        <input v-model="newSkill.name" class="input max-w-xs" placeholder="Ex.: Python" />
        <select v-model="newSkill.category" class="input max-w-xs">
          <option v-for="c in skillCategories" :key="c" :value="c">{{ c }}</option>
        </select>
        <button type="submit" class="btn-primary"><Plus class="size-4" /> Adicionar</button>
      </form>
    </section>

    <section class="card space-y-4">
      <h2 class="font-semibold text-slate-900">Portfólio</h2>

      <ul class="space-y-3">
        <li v-for="p in profile.projects" :key="p.id" class="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-3">
          <div>
            <p class="font-medium text-slate-900">{{ p.title }}</p>
            <p v-if="p.description" class="text-sm text-slate-600">{{ p.description }}</p>
            <a v-if="p.link" :href="p.link" target="_blank" rel="noopener" class="text-sm text-brand-600 hover:underline">{{ p.link }}</a>
          </div>
          <button class="text-slate-400 hover:text-red-600" :aria-label="`Remover ${p.title}`" @click="store.removeProject(userId, p.id)">
            <Trash2 class="size-4" />
          </button>
        </li>
        <li v-if="profile.projects.length === 0" class="text-sm text-slate-500">Ainda sem projetos.</li>
      </ul>

      <form class="grid gap-3 sm:grid-cols-2" @submit.prevent="addProject">
        <input v-model="newProject.title" class="input" placeholder="Título do projeto" />
        <input v-model="newProject.link" class="input" placeholder="Link (GitHub, site, vídeo...)" />
        <textarea v-model="newProject.description" rows="2" class="input sm:col-span-2" placeholder="Descrição breve" />
        <div class="sm:col-span-2">
          <button type="submit" class="btn-primary"><Plus class="size-4" /> Adicionar projeto</button>
        </div>
      </form>
    </section>

    <section class="card space-y-2">
      <h2 class="font-semibold text-slate-900">Privacidade</h2>
      <label class="flex items-start gap-3 text-sm text-slate-700">
        <input v-model="profile.available" type="checkbox" class="mt-1" />
        <span>
          Aparecer no Banco de Talentos. As empresas veem nome, curso, competências e projetos. Telefone, email pessoal e
          documentos ficam privados.
        </span>
      </label>
    </section>
  </div>
</template>
