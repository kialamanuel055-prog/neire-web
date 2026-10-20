import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Role, User } from '@/types'

const KEY = 'neire.session'

// Utilizadores de exemplo. Serão substituídos pela API na fase do backend.
const MOCK_USERS: Record<Role, User> = {
  student: { id: 'u1', name: 'Nádio', email: 'estudante@neire.ao', role: 'student' },
  alumni: { id: 'u2', name: 'Alumni Demo', email: 'alumni@neire.ao', role: 'alumni' },
  company: { id: 'u3', name: 'Empresa Demo', email: 'empresa@neire.ao', role: 'company' },
  admin: { id: 'u4', name: 'Admin NEIRE', email: 'admin@neire.ao', role: 'admin' },
}

function load(): User | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(load())
  const isAuthenticated = computed(() => user.value !== null)

  function loginAs(role: Role) {
    user.value = MOCK_USERS[role]
    try { localStorage.setItem(KEY, JSON.stringify(user.value)) } catch { /* ignora */ }
  }

  // Modo desenvolvimento: reconhece os emails de exemplo, com qualquer senha.
  function loginWithEmail(identifier: string): Role | null {
    const id = identifier.trim().toLowerCase()
    const found = (Object.values(MOCK_USERS) as User[]).find((u) => u.email === id)
    if (!found) return null
    loginAs(found.role)
    return found.role
  }

  function logout() {
    user.value = null
    try { localStorage.removeItem(KEY) } catch { /* ignora */ }
  }

  // ANCHOR:auth-actions
  return { user, isAuthenticated, loginAs, loginWithEmail, logout }
})
