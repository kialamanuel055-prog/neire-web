<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Bell } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import { formatDateTime } from '@/utils/format'

const auth = useAuthStore()
const store = useNotificationsStore()
const open = ref(false)

const mine = computed(() => (auth.user ? store.forUser(auth.user.id) : []))
const unread = computed(() => mine.value.filter((n) => !n.read).length)
const latest = computed(() => mine.value.slice(0, 5))

function go(id: string) {
  store.markRead(id)
  open.value = false
}
</script>

<template>
  <div class="relative">
    <div v-if="open" class="fixed inset-0 z-40" @click="open = false" />
    <button
      class="relative rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
      aria-label="Notificações"
      @click="open = !open"
    >
      <Bell class="size-5" />
      <span
        v-if="unread > 0"
        class="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white"
      >
        {{ unread > 9 ? '9+' : unread }}
      </span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 z-50 mt-2 w-80 max-w-[85vw] rounded-xl border border-slate-200 bg-white shadow-lg"
    >
      <div class="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">Notificações</div>
      <p v-if="latest.length === 0" class="px-4 py-6 text-center text-sm text-slate-500">Sem notificações.</p>
      <RouterLink
        v-for="n in latest"
        :key="n.id"
        :to="n.link ?? '/app/notificacoes'"
        :class="['block border-b border-slate-100 px-4 py-3 text-sm hover:bg-slate-50', n.read ? '' : 'bg-brand-50']"
        @click="go(n.id)"
      >
        <p class="font-medium text-slate-900">{{ n.title }}</p>
        <p class="text-slate-600">{{ n.text }}</p>
        <p class="mt-1 text-xs text-slate-400">{{ formatDateTime(n.at) }}</p>
      </RouterLink>
      <RouterLink to="/app/notificacoes" class="block px-4 py-3 text-center text-sm text-brand-600 hover:underline" @click="open = false">
        Ver todas
      </RouterLink>
    </div>
  </div>
</template>
