import { useAuthStore } from '@/stores/auth'
import { useProfilesStore } from '@/stores/profiles'
import { useCompaniesStore } from '@/stores/companies'
import { startSession } from '@/composables/useSession'
import { notifyUnauthorized } from '@/composables/sessionEvents'
import { api, ApiError, apiEnabled, getToken, setToken } from '@/api/client'
import type { User } from '@/types'

interface Session {
  token: string
  user: User
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  role: 'student' | 'company'
  course?: string
  year?: string
  sector?: string
  website?: string
}

// Enquanto os modulos nao passam para a API, garante os registos locais que as paginas esperam.
function syncLocal(user: User) {
  if (user.role === 'student' || user.role === 'alumni') {
    useProfilesStore().ensure({ id: user.id, name: user.name })
  } else if (user.role === 'company') {
    const companies = useCompaniesStore()
    if (!companies.byId(user.id)) {
      companies.items.push({ id: user.id, name: user.name, sector: '', website: '', status: 'pendente' })
    }
  }
}

function begin(session: Session) {
  setToken(session.token)
  startSession(session.user)
  syncLocal(session.user)
}

export async function apiLogin(email: string, password: string): Promise<User> {
  const session = await api<Session>('/auth/login', { method: 'POST', body: { email, password }, auth: false })
  begin(session)
  return session.user
}

export async function apiRegister(input: RegisterInput): Promise<User> {
  const session = await api<Session>('/auth/register', { method: 'POST', body: input, auth: false })
  begin(session)
  return session.user
}

export async function restoreSession(): Promise<void> {
  if (!apiEnabled) return
  const auth = useAuthStore()

  if (!getToken()) {
    if (auth.user) auth.logout() // sessao de demonstracao nao vale em modo API
    return
  }

  try {
    const user = await api<User>('/auth/me')
    startSession(user)
    syncLocal(user)
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
      setToken(null)
      auth.logout()
      notifyUnauthorized()
    }
    // erros de rede: mantem a sessao local e tenta de novo mais tarde
  }
}

export function installApiSession() {
  if (!apiEnabled) return
  const auth = useAuthStore()
  auth.$onAction(({ name }) => {
    if (name === 'logout') setToken(null)
  })
  void restoreSession()
}
