<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { Menu, X, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { navByRole } from '@/config/navigation'
import { useDepartment } from '@/composables/useDepartment'
import { moduleForPath } from '@/config/departmentAccess'
import NotificationBell from '@/components/NotificationBell.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import NeireLogo from '@/components/NeireLogo.vue'
import Avatar from '@/components/Avatar.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const open = ref(false)
const { canAccess } = useDepartment()
const items = computed(() => {
  const list = auth.user ? navByRole[auth.user.role] : []
  if (auth.user?.role !== 'admin') return list
  return list.filter((i) => {
    const m = moduleForPath(i.to)
    return !m || canAccess(m)
  })
})

const activeTo = computed(() => {
  const path = route.path.replace(/\/$/, '')
  const matches = items.value
    .filter((i) => path === i.to || path.startsWith(i.to + '/'))
    .sort((a, b) => b.to.length - a.to.length)
  return matches[0]?.to ?? ''
})

const roleLabel: Record<string, string> = {
  student: 'Estudante',
  alumni: 'Alumni',
  company: 'Empresa',
  admin: 'Administração',
}

function sair() {
  auth.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 lg:flex">
    <div v-if="open" class="fixed inset-0 z-30 bg-black/50 lg:hidden" @click="open = false" />

    <aside
      :class="[
        'app-sidebar fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex h-16 shrink-0 items-center justify-between px-5">
        <NeireLogo :size="30" />
        <button class="lg:hidden" aria-label="Fechar menu" @click="open = false">
          <X class="size-5" />
        </button>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        <RouterLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
            activeTo === item.to ? 'bg-brand-500/25 text-white' : 'text-white/65 hover:bg-white/5 hover:text-white',
          ]"
          @click="open = false"
        >
          <component :is="item.icon" class="size-5" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="shrink-0 border-t border-white/10 p-3">
        <button
          class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/65 hover:bg-white/5 hover:text-white"
          @click="sair"
        >
          <LogOut class="size-5" /> Sair
        </button>
      </div>
    </aside>

    <div class="flex min-h-screen min-w-0 flex-1 flex-col">
      <header class="app-header sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 px-4 sm:px-8">
        <button class="lg:hidden" aria-label="Abrir menu" @click="open = true">
          <Menu class="size-6 text-slate-700" />
        </button>
        <div class="ml-auto flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          <NotificationBell />
          <DepartmentBadge />
          <!-- ANCHOR:dashboard-header-tools -->
          <div class="flex items-center gap-3">
            <Avatar v-if="auth.user" :name="auth.user.name" />
            <div class="hidden text-sm leading-tight sm:block">
              <p class="font-semibold text-slate-900">{{ auth.user?.name }}</p>
              <p class="text-xs text-slate-500">{{ auth.user ? roleLabel[auth.user.role] : '' }}</p>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
