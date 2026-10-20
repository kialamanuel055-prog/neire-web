<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMentorshipStore } from '@/stores/mentorship'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'

const auth = useAuthStore()
const store = useMentorshipStore()
const user = auth.user!

const q = ref('')
const openId = ref<string | null>(null)
const form = reactive({ topic: '', message: '' })
const feedback = ref('')

const list = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return store.mentors.filter(
    (m) =>
      m.active &&
      m.userId !== user.id &&
      (!needle || `${m.name} ${m.area} ${m.company}`.toLowerCase().includes(needle)),
  )
})

function send(mentorId: string) {
  feedback.value = ''
  if (!form.topic.trim()) {
    feedback.value = 'Indica o tema em que precisas de apoio.'
    return
  }
  const req = store.request({ id: user.id, name: user.name }, mentorId, form.topic.trim(), form.message.trim())
  if (!req) {
    feedback.value = 'Já tens um pedido pendente para este mentor.'
    return
  }
  form.topic = ''
  form.message = ''
  openId.value = null
  feedback.value = 'Pedido enviado. Acompanha em Mentoria.'
}

const myMentor = computed(() => store.byUser(user.id))
const mentorForm = reactive({ area: '', company: '', bio: '' })
function becomeMentor() {
  if (!mentorForm.area.trim()) return
  store.becomeMentor({ id: user.id, name: user.name }, mentorForm.area.trim(), mentorForm.company.trim(), mentorForm.bio.trim())
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Mentores" subtitle="Alumni e profissionais que podem orientar o teu percurso." />

    <div v-if="user.role === 'alumni'" class="card space-y-3">
      <template v-if="myMentor">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm text-slate-700">
            És mentor em <strong>{{ myMentor.area }}</strong> ({{ myMentor.active ? 'visível' : 'oculto' }}).
          </p>
          <button class="btn-secondary" @click="store.toggleActive(user.id)">
            {{ myMentor.active ? 'Ocultar do diretório' : 'Voltar a aparecer' }}
          </button>
        </div>
      </template>
      <form v-else class="grid gap-3 sm:grid-cols-2" @submit.prevent="becomeMentor">
        <p class="text-sm text-slate-700 sm:col-span-2">Como Alumni, podes tornar-te mentor e apoiar a próxima geração.</p>
        <input v-model="mentorForm.area" class="input" placeholder="Área de mentoria (ex.: Redes)" />
        <input v-model="mentorForm.company" class="input" placeholder="Empresa" />
        <textarea v-model="mentorForm.bio" rows="2" class="input sm:col-span-2" placeholder="Em que podes ajudar?" />
        <div class="sm:col-span-2"><button type="submit" class="btn-primary">Tornar-me mentor</button></div>
      </form>
    </div>

    <input v-model="q" class="input max-w-md" placeholder="Pesquisar por área, nome ou empresa" />
    <p v-if="feedback" class="text-sm text-brand-700">{{ feedback }}</p>

    <EmptyState v-if="list.length === 0" text="Nenhum mentor encontrado." />

    <div class="grid gap-4 lg:grid-cols-2">
      <article v-for="m in list" :key="m.userId" class="card space-y-3">
        <div>
          <h2 class="text-lg font-semibold text-slate-900">{{ m.name }}</h2>
          <p class="text-sm text-brand-700">{{ m.area }}</p>
          <p v-if="m.company" class="text-xs text-slate-500">{{ m.company }}</p>
        </div>
        <p class="text-sm text-slate-700">{{ m.bio }}</p>

        <button v-if="openId !== m.userId" class="btn-primary" @click="openId = m.userId">Pedir mentoria</button>
        <form v-else class="space-y-3" @submit.prevent="send(m.userId)">
          <input v-model="form.topic" class="input" placeholder="Tema (ex.: Quero trabalhar em cibersegurança)" />
          <textarea v-model="form.message" rows="3" class="input" placeholder="Mensagem (opcional)" />
          <div class="flex gap-2">
            <button type="submit" class="btn-primary">Enviar pedido</button>
            <button type="button" class="btn-secondary" @click="openId = null">Cancelar</button>
          </div>
        </form>
      </article>
    </div>
  </div>
</template>
