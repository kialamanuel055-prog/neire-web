<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { homeByRole } from '@/config/navigation'
import NeireLogo from '@/components/NeireLogo.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const auth = useAuthStore()
const route = useRoute()
const bare = computed(() => route.name === 'login')
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header v-if="!bare" class="sticky top-0 z-30 border-b border-white/10 bg-ink/90 text-white backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <RouterLink to="/" aria-label="NEIRE, início"><NeireLogo :size="32" /></RouterLink>
        <nav class="flex items-center gap-3 text-sm sm:gap-5">
          <RouterLink to="/" class="hidden text-white/70 hover:text-white sm:inline">Início</RouterLink>
          <RouterLink to="/verificar" class="text-white/70 hover:text-white">Verificar certificado</RouterLink>
          <RouterLink to="/noticias" class="hover:underline">Notícias</RouterLink>
          <RouterLink to="/registo" class="hover:underline">Criar conta</RouterLink>
          <!-- ANCHOR:public-nav -->
          <ThemeToggle />
          <RouterLink v-if="auth.user" :to="homeByRole[auth.user.role]" class="btn-gradient px-4 py-2">
            Ir para o painel
          </RouterLink>
          <template v-else>
            <RouterLink to="/entrar" class="hidden rounded-xl border border-white/20 px-4 py-2 font-semibold hover:bg-white/10 sm:inline-block">
              Entrar
            </RouterLink>
            <RouterLink to="/entrar" class="btn-gradient px-4 py-2">Registar</RouterLink>
          </template>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer v-if="!bare" class="border-t border-white/10 bg-ink py-6 text-center text-sm text-white/50">
      NEIRE · Núcleo de Empregabilidade, Inovação e Relações Empresariais do INSTIC
    </footer>
  </div>
</template>
