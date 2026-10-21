<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { homeByRole } from '@/config/navigation'
import NeireLogo from '@/components/NeireLogo.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const auth = useAuthStore()
const route = useRoute()
const bare = computed(() => route.name === 'login')

const open = ref(false)
watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)
</script>

<template>
  <div class="flex min-h-screen flex-col overflow-x-clip">
    <header v-if="!bare" class="sticky top-0 z-30 border-b border-white/10 bg-ink/90 text-white backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <RouterLink to="/" aria-label="NEIRE, início" class="shrink-0"><NeireLogo :size="32" /></RouterLink>

        <!-- ecras largos -->
        <nav class="hidden items-center gap-5 text-sm lg:flex">
          <RouterLink to="/" class="text-white/70 hover:text-white">Início</RouterLink>
          <RouterLink to="/verificar" class="text-white/70 hover:text-white">Verificar certificado</RouterLink>
          <RouterLink to="/noticias" class="hover:underline">Notícias</RouterLink>
          <RouterLink to="/registo" class="hover:underline">Criar conta</RouterLink>
          <!-- ANCHOR:public-nav -->
          <ThemeToggle />
          <RouterLink v-if="auth.user" :to="homeByRole[auth.user.role]" class="btn-gradient px-4 py-2">
            Ir para o painel
          </RouterLink>
          <template v-else>
            <RouterLink to="/entrar" class="rounded-xl border border-white/20 px-4 py-2 font-semibold hover:bg-white/10">
              Entrar
            </RouterLink>
            <RouterLink to="/entrar" class="btn-gradient px-4 py-2">Registar</RouterLink>
          </template>
        </nav>

        <!-- telemovel e tablet -->
        <div class="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            class="flex size-11 items-center justify-center rounded-xl border border-white/20 hover:bg-white/10"
            :aria-label="open ? 'Fechar menu' : 'Abrir menu'"
            :aria-expanded="open"
            @click="open = !open"
          >
            <X v-if="open" class="size-5" />
            <Menu v-else class="size-5" />
          </button>
        </div>
      </div>

      <nav v-if="open" class="border-t border-white/10 bg-ink px-4 pb-5 pt-2 lg:hidden">
        <div class="mx-auto flex max-w-6xl flex-col">
          <RouterLink to="/" class="border-b border-white/10 py-3.5 text-base text-white/90">Início</RouterLink>
          <RouterLink to="/verificar" class="border-b border-white/10 py-3.5 text-base text-white/90">
            Verificar certificado
          </RouterLink>
          <RouterLink to="/noticias" class="border-b border-white/10 py-3.5 text-base text-white/90">Notícias</RouterLink>

          <div class="mt-4 flex flex-col gap-3">
            <RouterLink
              v-if="auth.user"
              :to="homeByRole[auth.user.role]"
              class="btn-gradient justify-center px-4 py-3 text-center"
            >
              Ir para o painel
            </RouterLink>
            <template v-else>
              <RouterLink to="/registo" class="btn-gradient justify-center px-4 py-3 text-center">Criar conta</RouterLink>
              <RouterLink
                to="/entrar"
                class="rounded-xl border border-white/20 px-4 py-3 text-center font-semibold hover:bg-white/10"
              >
                Entrar
              </RouterLink>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer v-if="!bare" class="border-t border-white/10 bg-ink px-4 py-6 text-center text-sm text-white/50">
      NEIRE · Núcleo de Empregabilidade, Inovação e Relações Empresariais do INSTIC
    </footer>
  </div>
</template>
