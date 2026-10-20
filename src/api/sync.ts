import { watch } from 'vue'
import { api, ApiError, apiEnabled, setToken } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useApplicationsStore } from '@/stores/applications'
import { useCompaniesStore } from '@/stores/companies'
import { useNotificationsStore } from '@/stores/notifications'
import { useAuditStore } from '@/stores/audit'
import type {
  AppNotification,
  Application,
  ApplicationStatus,
  AuditEntry,
  Company,
  Opportunity,
  OpportunityStatus,
} from '@/types'

function toast(message: string) {
  if (typeof document === 'undefined') return
  const el = document.createElement('div')
  el.textContent = message
  el.setAttribute('role', 'alert')
  el.style.cssText =
    'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);max-width:90vw;padding:12px 16px;border-radius:12px;background:#0f2557;color:#fff;font-size:14px;line-height:1.4;box-shadow:0 8px 24px rgba(0,0,0,.25);z-index:9999'
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 6000)
}

function clearApiData() {
  useOpportunitiesStore().items = []
  useApplicationsStore().items = []
  useCompaniesStore().items = []
  useNotificationsStore().items = []
  useAuditStore().entries = []
}

async function doPull() {
  const auth = useAuthStore()
  const user = auth.user
  if (!user) return

  const opps = useOpportunitiesStore()
  const apps = useApplicationsStore()
  const companies = useCompaniesStore()
  const notifs = useNotificationsStore()
  const audit = useAuditStore()

  const tasks: Promise<unknown>[] = [
    api<Opportunity[]>('/opportunities').then((d) => { opps.items = d }),
    api<Application[]>('/applications').then((d) => { apps.items = d }),
    api<AppNotification[]>('/notifications').then((d) => { notifs.items = d }),
  ]
  if (user.role === 'company' || user.role === 'admin') {
    tasks.push(api<Company[]>('/companies').then((d) => { companies.items = d }))
  }
  if (user.role === 'admin') {
    tasks.push(api<AuditEntry[]>('/audit').then((d) => { audit.entries = d }))
  }

  const results = await Promise.allSettled(tasks)
  const expired = results.some(
    (r) => r.status === 'rejected' && r.reason instanceof ApiError && r.reason.status === 401,
  )
  if (expired) {
    setToken(null)
    auth.logout()
    const { default: router } = await import('@/router')
    await router.replace({ name: 'login' })
  }
}

let chain: Promise<void> = Promise.resolve()
export function pullAll(): Promise<void> {
  chain = chain.then(doPull).catch(() => undefined)
  return chain
}

async function push(run: () => Promise<unknown>) {
  try {
    await run()
  } catch (e) {
    toast(e instanceof ApiError ? e.message : 'Não foi possível guardar no servidor.')
  } finally {
    await pullAll()
  }
}

let installed = false

export function installApiSync() {
  if (!apiEnabled || installed) return
  installed = true

  const auth = useAuthStore()
  const opps = useOpportunitiesStore()
  const apps = useApplicationsStore()
  const companies = useCompaniesStore()
  const notifs = useNotificationsStore()

  // ao entrar ou sair: limpa os dados do utilizador anterior e carrega os do novo
  watch(
    () => auth.user?.id,
    (id) => {
      clearApiData()
      if (id) void pullAll()
    },
    { immediate: true },
  )

  // oportunidades
  opps.$onAction(({ name, args }) => {
    if (name === 'create') {
      const d = args[0] as unknown as Omit<Opportunity, 'id' | 'status' | 'createdAt'>
      void push(() =>
        api('/opportunities', {
          method: 'POST',
          body: {
            title: d.title,
            type: d.type,
            area: d.area,
            modality: d.modality,
            level: d.level,
            description: d.description,
            requirements: d.requirements,
            vacancies: d.vacancies,
            deadline: d.deadline,
          },
        }),
      )
    }
    if (name === 'setStatus') {
      const [id, status] = args as unknown as [string, OpportunityStatus]
      void push(() => api(`/opportunities/${id}/status`, { method: 'PATCH', body: { status } }))
    }
  })

  // candidaturas
  apps.$onAction(({ name, args }) => {
    if (name === 'apply') {
      const [opportunityId, , message] = args as unknown as [string, { id: string; name: string }, string]
      void push(() => api('/applications', { method: 'POST', body: { opportunityId, message } }))
    }
    if (name === 'setStatus') {
      const [id, status] = args as unknown as [string, ApplicationStatus]
      void push(() => api(`/applications/${id}/status`, { method: 'PATCH', body: { status } }))
    }
  })

  // verificacao de empresas
  companies.$onAction(({ name, args }) => {
    if (name === 'advance') {
      const [id] = args as unknown as [string]
      void push(() => api(`/companies/${id}/advance`, { method: 'PATCH' }))
    }
  })

  // notificacoes lidas
  notifs.$onAction(({ name, args }) => {
    if (name === 'markRead') {
      const [id] = args as unknown as [string]
      void api(`/notifications/${id}/read`, { method: 'PATCH' }).catch(() => undefined)
    }
    if (name === 'markAllRead') {
      void api('/notifications/read-all', { method: 'POST' }).catch(() => undefined)
    }
  })

  // atualizacao periodica e ao voltar a janela
  setInterval(() => {
    if (document.visibilityState === 'visible' && auth.user) void pullAll()
  }, 20000)
  window.addEventListener('focus', () => {
    if (auth.user) void pullAll()
  })
}
