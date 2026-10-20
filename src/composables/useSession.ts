import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types'

// Inicia (ou substitui) a sessao atual. Sera trocado pelo login real da API.
export function startSession(user: User) {
  const auth = useAuthStore()
  auth.user = user
  try {
    localStorage.setItem('neire.session', JSON.stringify(user))
  } catch {
    /* ignora */
  }
}
