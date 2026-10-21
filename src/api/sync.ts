import { watch } from 'vue'
import { api, ApiError, apiEnabled, setToken } from '@/api/client'
import { startSession } from '@/composables/useSession'
import { useAuthStore } from '@/stores/auth'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useApplicationsStore } from '@/stores/applications'
import { useCompaniesStore } from '@/stores/companies'
import { useNotificationsStore } from '@/stores/notifications'
import { useAuditStore } from '@/stores/audit'
import { useProfilesStore } from '@/stores/profiles'
import { useSkillRequestsStore } from '@/stores/skillrequests'
import { useAlumniStore } from '@/stores/alumni'
import { useEventsStore } from '@/stores/events'
import { useAcademyStore } from '@/stores/academy'
import { useCertificatesStore } from '@/stores/certificates'
import type { Certificate, Course, EventItem } from '@/types'
// b24-imports
import { useContentStore } from '@/stores/content'
import { useFeedbackStore } from '@/stores/feedback'
import type { FeedbackEntry, ImpactStory, NewsItem } from '@/types'
// b25a-imports
import { useMentorshipStore } from '@/stores/mentorship'
import { useComplaintsStore } from '@/stores/complaints'
import { useArchiveStore } from '@/stores/archive'
import type { ArchiveDoc, Complaint, ComplaintStatus, Mentor, MentorshipRequest } from '@/types'
// b25b-A-imports
import { useChallengesStore } from '@/stores/challenges'
import { useDebatesStore } from '@/stores/debates'
import type { Challenge, ChallengeSubmission, ChallengeTeam, DebateContest, DebateMatch, DebateTeam } from '@/types'
// b25c-A-imports
import { watch as vueWatch } from 'vue'
import { useCompanyProfilesStore } from '@/stores/companyprofiles'
import type { CompanyProfile } from '@/types'
// ANCHOR:sync-imports
import type {
  AppNotification,
  Application,
  ApplicationStatus,
  AuditEntry,
  Company,
  GraduateProfile,
  Opportunity,
  OpportunityStatus,
  SkillLevel,
  SkillRequest,
  StudentProfile,
  User,
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

// ---------- estado partilhado ----------
let profileLoaded = false
let alumniLoaded = false
let becoming: Promise<void> | null = null

interface Autosave {
  dirty: () => boolean
  markSynced: () => void
}
let profileAuto: Autosave | null = null
let alumniAuto: Autosave | null = null

// Envia alteracoes feitas diretamente nos campos (v-model) com um pequeno atraso.
function createAutosave(getSnap: () => string, send: () => Promise<unknown>, failMsg: string): Autosave {
  let last = getSnap()
  let dirty = false
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(getSnap, (snap) => {
    if (!snap || snap === last) return
    dirty = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(async () => {
      const sent = getSnap()
      try {
        await send()
      } catch (e) {
        toast(e instanceof ApiError ? e.message : failMsg)
      }
      last = sent
      dirty = getSnap() !== sent
    }, 800)
  })

  return {
    dirty: () => dirty,
    markSynced: () => {
      if (timer) clearTimeout(timer)
      last = getSnap()
      dirty = false
    },
  }
}

function clearApiData() {
  profileLoaded = false
  alumniLoaded = false
  useOpportunitiesStore().items = []
  useApplicationsStore().items = []
  useCompaniesStore().items = []
  useNotificationsStore().items = []
  useAuditStore().entries = []
  useProfilesStore().items = []
  useSkillRequestsStore().items = []
  useAlumniStore().items = []
  useEventsStore().items = []
  useAcademyStore().items = []
  useCertificatesStore().items = []
  // b24-clear
  useFeedbackStore().items = []
  // b25a-clear
  useMentorshipStore().mentors = []
  useMentorshipStore().requests = []
  useComplaintsStore().items = []
  useArchiveStore().items = []
  // b25b-B-clear
  useChallengesStore().items = []
  useChallengesStore().teams = []
  useChallengesStore().submissions = []
  useDebatesStore().contests = []
  useDebatesStore().teams = []
  useDebatesStore().matches = []
  // b25c-B-clear
  useCompanyProfilesStore().items = []
  // ANCHOR:sync-clear
}

async function doPull() {
  const auth = useAuthStore()
  const user = auth.user
  if (!user) return
  const uid = user.id
  const still = () => auth.user?.id === uid

  const opps = useOpportunitiesStore()
  const apps = useApplicationsStore()
  const companies = useCompaniesStore()
  const notifs = useNotificationsStore()
  const audit = useAuditStore()
  const profiles = useProfilesStore()
  const skillReq = useSkillRequestsStore()
  const alumni = useAlumniStore()
  const events = useEventsStore()
  const academy = useAcademyStore()
  const certs = useCertificatesStore()
  // b24-pull-stores
  const content = useContentStore()
  const feedback = useFeedbackStore()
  // b25a-pull-stores
  const mentorship = useMentorshipStore()
  const complaints = useComplaintsStore()
  const archive = useArchiveStore()
  // b25b-C-stores-pull
  const challengesStore = useChallengesStore()
  const debatesStore = useDebatesStore()
  // ANCHOR:sync-pull-stores

  const tasks: Promise<unknown>[] = [
    api<Opportunity[]>('/opportunities').then((d) => {
      if (still()) opps.items = d
    }),
    api<Application[]>('/applications').then((d) => {
      if (still()) apps.items = d
    }),
    api<AppNotification[]>('/notifications').then((d) => {
      if (still()) notifs.items = d
    }),
    api<GraduateProfile[]>('/alumni').then((d) => {
      if (!still() || alumniAuto?.dirty()) return
      alumniLoaded = true
      alumni.items = d
      alumniAuto?.markSynced()
    }),
  ]

  if (user.role === 'student' || user.role === 'alumni') {
    tasks.push(
      api<StudentProfile>('/profiles/me').then((d) => {
        if (!still() || profileAuto?.dirty()) return
        profileLoaded = true
        profiles.items = [d]
        profileAuto?.markSynced()
      }),
      api<SkillRequest[]>('/skill-requests').then((d) => {
        if (still()) skillReq.items = d
      }),
    )
  }
  if (user.role === 'company' || user.role === 'admin') {
    tasks.push(
      api<Company[]>('/companies').then((d) => {
        if (still()) companies.items = d
      }),
      api<StudentProfile[]>('/profiles').then((d) => {
        if (still()) profiles.items = d
      }),
    )
  }
  if (user.role === 'admin') {
    tasks.push(
      api<AuditEntry[]>('/audit').then((d) => {
        if (still()) audit.entries = d
      }),
      api<SkillRequest[]>('/skill-requests').then((d) => {
        if (still()) skillReq.items = d
      }),
    )
  }
  tasks.push(
    api<EventItem[]>('/events').then((d) => {
      if (still()) events.items = d
    }),
    api<Course[]>('/courses').then((d) => {
      if (still()) academy.items = d
    }),
  )
  if (user.role !== 'company') {
    tasks.push(
      api<Certificate[]>('/certificates').then((d) => {
        if (still()) certs.items = d
      }),
    )
  }
  // b25a-pull-data
  tasks.push(
    api<Mentor[]>('/mentors').then((d) => {
      if (still()) mentorship.mentors = d
    }),
    api<Complaint[]>('/complaints').then((d) => {
      if (still()) complaints.items = d
    }),
  )
  if (user.role !== 'company') {
    tasks.push(
      api<MentorshipRequest[]>('/mentorship-requests').then((d) => {
        if (still()) mentorship.requests = d
      }),
    )
  }
  if (user.role === 'admin') {
    tasks.push(
      api<ArchiveDoc[]>('/archive').then((d) => {
        if (still()) archive.items = d
      }),
    )
  }
  // b25b-D-pulldata
  tasks.push(
    api<Challenge[]>('/challenges').then((d) => {
      if (still()) challengesStore.items = d
    }),
    api<ChallengeTeam[]>('/challenge-teams').then((d) => {
      if (still()) challengesStore.teams = d
    }),
    api<ChallengeSubmission[]>('/challenge-submissions').then((d) => {
      if (still()) challengesStore.submissions = d
    }),
    api<DebateContest[]>('/debates').then((d) => {
      if (still()) debatesStore.contests = d
    }),
    api<DebateTeam[]>('/debate-teams').then((d) => {
      if (still()) debatesStore.teams = d
    }),
    api<DebateMatch[]>('/debate-matches').then((d) => {
      if (still()) debatesStore.matches = d
    }),
  )
  // ANCHOR:sync-pull

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

// Para remocoes: ignora erros (ex.: item ainda nao chegou ao servidor); a atualizacao repoe o estado real.
async function pushQuiet(run: () => Promise<unknown>) {
  try {
    await run()
  } catch {
    /* ignora */
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
  const profiles = useProfilesStore()
  const skillReq = useSkillRequestsStore()
  const alumni = useAlumniStore()
  const events = useEventsStore()
  const academy = useAcademyStore()
  const certs = useCertificatesStore()
  // b24-hooks-stores
  const content = useContentStore()
  const feedback = useFeedbackStore()
  // b25a-hooks-stores
  const mentorship = useMentorshipStore()
  const complaints = useComplaintsStore()
  const archive = useArchiveStore()
  // b25b-E-stores-hooks
  const challengesStore = useChallengesStore()
  const debatesStore = useDebatesStore()
  // b25c-C-stores
  const companyProfilesStore = useCompanyProfilesStore()
  // ANCHOR:sync-hooks-stores

  // ----- guardar automaticamente: perfil -----
  const profileSnap = () => {
    const u = auth.user
    if (!profileLoaded || !u || (u.role !== 'student' && u.role !== 'alumni')) return ''
    const p = profiles.byUser(u.id)
    return p ? JSON.stringify([p.headline, p.course, p.year, p.location, p.languages, p.available]) : ''
  }
  const sendProfile = async () => {
    const u = auth.user
    const p = u ? profiles.byUser(u.id) : undefined
    if (!p) return
    await api('/profiles/me', {
      method: 'PUT',
      body: {
        headline: p.headline,
        course: p.course,
        year: p.year,
        location: p.location,
        languages: p.languages,
        available: p.available,
      },
    })
  }
  profileAuto = createAutosave(profileSnap, sendProfile, 'Não foi possível guardar o perfil.')

  // ----- guardar automaticamente: perfil Alumni -----
  const alumniSnap = () => {
    const u = auth.user
    if (!alumniLoaded || !u || u.role !== 'alumni') return ''
    const g = alumni.byUser(u.id)
    return g ? JSON.stringify([g.graduationYear, g.company, g.position, g.bio, g.offersMentoring]) : ''
  }
  const sendAlumni = async () => {
    if (becoming) await becoming
    const u = auth.user
    const g = u ? alumni.byUser(u.id) : undefined
    if (!g) return
    await api('/alumni/me', {
      method: 'PUT',
      body: {
        graduationYear: g.graduationYear,
        company: g.company,
        position: g.position,
        bio: g.bio,
        offersMentoring: g.offersMentoring,
      },
    })
  }
  alumniAuto = createAutosave(alumniSnap, sendAlumni, 'Não foi possível guardar o perfil Alumni.')

  // ----- ao entrar ou sair: limpa os dados do utilizador anterior e carrega os do novo -----
  watch(
    () => auth.user?.id,
    (id) => {
      clearApiData()
      profileAuto?.markSynced()
      alumniAuto?.markSynced()
      if (id) void pullAll()
    },
    { immediate: true },
  )

  // ----- estudante passa a Alumni: confirma no servidor e troca o token -----
  async function becomeAlumni(id: string) {
    const g = alumni.byUser(id)
    try {
      const res = await api<{ token: string; user: User }>('/alumni/become', {
        method: 'POST',
        body: {
          graduationYear: g?.graduationYear ?? '',
          company: g?.company ?? '',
          position: g?.position ?? '',
        },
      })
      setToken(res.token)
    } catch (e) {
      toast(e instanceof ApiError ? e.message : 'Não foi possível concluir a mudança para Alumni.')
      const u = auth.user
      if (u && u.id === id) startSession({ ...u, role: 'student' })
    } finally {
      becoming = null
      await pullAll()
    }
  }
  watch(
    () => (auth.user ? `${auth.user.id}:${auth.user.role}` : ''),
    (cur, prev) => {
      if (!cur || !prev) return
      const [id, role] = cur.split(':')
      const [prevId, prevRole] = prev.split(':')
      if (id && id === prevId && prevRole === 'student' && role === 'alumni') {
        becoming = becomeAlumni(id)
      }
    },
  )

  // ----- oportunidades -----
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

  // ----- candidaturas -----
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

  // ----- verificacao de empresas -----
  companies.$onAction(({ name, args }) => {
    if (name === 'advance') {
      const [id] = args as unknown as [string]
      void push(() => api(`/companies/${id}/advance`, { method: 'PATCH' }))
    }
  })

  // ----- notificacoes lidas -----
  notifs.$onAction(({ name, args }) => {
    if (name === 'markRead') {
      const [id] = args as unknown as [string]
      void api(`/notifications/${id}/read`, { method: 'PATCH' }).catch(() => undefined)
    }
    if (name === 'markAllRead') {
      void api('/notifications/read-all', { method: 'POST' }).catch(() => undefined)
    }
  })

  // ----- perfil: competencias e portfolio -----
  profiles.$onAction(({ name, args }) => {
    const a = args as unknown[]
    if (!auth.user || a[0] !== auth.user.id) return
    if (name === 'addSkill') {
      const s = a[1] as { name: string; category: string }
      void push(() => api('/profiles/me/skills', { method: 'POST', body: { name: s.name, category: s.category } }))
    }
    if (name === 'removeSkill') {
      const skillName = a[1] as string
      void pushQuiet(() => api(`/profiles/me/skills?name=${encodeURIComponent(skillName)}`, { method: 'DELETE' }))
    }
    if (name === 'addProject') {
      const p = a[1] as { title: string; description: string; link?: string }
      void push(() =>
        api('/profiles/me/projects', {
          method: 'POST',
          body: { title: p.title, description: p.description, link: p.link ?? '' },
        }),
      )
    }
    if (name === 'removeProject') {
      const projectId = a[1] as string
      void pushQuiet(() => api(`/profiles/me/projects/${encodeURIComponent(projectId)}`, { method: 'DELETE' }))
    }
  })

  // ----- verificacao de competencias -----
  skillReq.$onAction(({ name, args, after }) => {
    if (name === 'create') {
      const d = args[0] as unknown as { skill: string; evidenceType: string; evidence: string }
      after((result) => {
        if (!result) return
        void push(() =>
          api('/skill-requests', {
            method: 'POST',
            body: { skill: d.skill, evidenceType: d.evidenceType, evidence: d.evidence },
          }),
        )
      })
    }
    if (name === 'decide') {
      const [id, approved, level] = args as unknown as [string, boolean, SkillLevel]
      void push(() => api(`/skill-requests/${id}/decide`, { method: 'PATCH', body: { approved, level } }))
    }
  })
  // ----- eventos -----
  events.$onAction(({ name, args, after }) => {
    if (name === 'create') {
      const d = args[0] as unknown as Omit<EventItem, 'id' | 'registered'>
      void push(() =>
        api('/events', {
          method: 'POST',
          body: {
            title: d.title,
            type: d.type,
            description: d.description,
            date: d.date,
            time: d.time,
            location: d.location,
            capacity: d.capacity,
          },
        }),
      )
    }
    if (name === 'toggle') {
      const [eventId] = args as unknown as [string, string]
      after((result) => {
        if (result !== 'inscrito' && result !== 'cancelado') return
        void push(() =>
          api(`/events/${eventId}/registration`, { method: 'PUT', body: { registered: result === 'inscrito' } }),
        )
      })
    }
  })

  // ----- academia -----
  academy.$onAction(({ name, args, after }) => {
    if (name === 'create') {
      const d = args[0] as unknown as Omit<Course, 'id' | 'enrolled' | 'completed'>
      void push(() =>
        api('/courses', {
          method: 'POST',
          body: {
            title: d.title,
            kind: d.kind,
            description: d.description,
            instructor: d.instructor,
            startDate: d.startDate,
            hours: d.hours,
            capacity: d.capacity,
          },
        }),
      )
    }
    if (name === 'toggleEnroll') {
      const [courseId] = args as unknown as [string, string]
      after((result) => {
        if (result !== 'inscrito' && result !== 'cancelado') return
        void push(() =>
          api(`/courses/${courseId}/enrollment`, { method: 'PUT', body: { enrolled: result === 'inscrito' } }),
        )
      })
    }
    if (name === 'complete') {
      const [courseId, userId] = args as unknown as [string, string]
      void push(() => api(`/courses/${courseId}/complete`, { method: 'POST', body: { userId } }))
    }
  })

  // ----- certificados emitidos manualmente pelo admin -----
  certs.$onAction(({ name, args }) => {
    if (name === 'issue') {
      const [student, activity] = args as unknown as [{ id: string; name: string }, string]
      void push(() => api('/certificates', { method: 'POST', body: { studentId: student.id, activity } }))
    }
  })
  // b25a-hooks-actions
  // ----- mentoria -----
  mentorship.$onAction(({ name, args, after }) => {
    if (name === 'becomeMentor') {
      const [, area, company, bio] = args as unknown as [unknown, string, string, string]
      void push(() => api('/mentors/me', { method: 'POST', body: { area, company, bio } }))
    }
    if (name === 'toggleActive') {
      const [userId] = args as unknown as [string]
      after(() => {
        if (!auth.user || auth.user.id !== userId) return
        const m = mentorship.mentors.find((x) => x.userId === userId)
        if (m) void push(() => api('/mentors/me/active', { method: 'PATCH', body: { active: m.active } }))
      })
    }
    if (name === 'request') {
      const [, mentorId, topic, message] = args as unknown as [unknown, string, string, string]
      after((result) => {
        if (!result) return
        void push(() => api('/mentorship-requests', { method: 'POST', body: { mentorId, topic, message } }))
      })
    }
    if (name === 'respond') {
      const [id, status] = args as unknown as [string, 'aceite' | 'recusada']
      void push(() => api(`/mentorship-requests/${id}/respond`, { method: 'PATCH', body: { status } }))
    }
  })

  // ----- denuncias (as anonimas nao levam identificacao) -----
  complaints.$onAction(({ name, args, after }) => {
    if (name === 'submit') {
      const d = args[0] as unknown as { category: string; description: string; author?: { id: string; name: string } }
      after((result) => {
        if (!result) return
        void push(() =>
          api('/complaints', {
            method: 'POST',
            body: { category: d.category, description: d.description, anonymous: !d.author },
          }),
        )
      })
    }
    if (name === 'setStatus') {
      const [id, status, response] = args as unknown as [string, ComplaintStatus, string]
      void push(() => api(`/complaints/${id}/status`, { method: 'PATCH', body: { status, response } }))
    }
  })

  // ----- arquivo institucional (admin) -----
  archive.$onAction(({ name, args }) => {
    if (name === 'add') {
      const d = args[0] as unknown as { title: string; category: string; description: string; link: string }
      void push(() =>
        api('/archive', {
          method: 'POST',
          body: { title: d.title, category: d.category, description: d.description, link: d.link },
        }),
      )
    }
    if (name === 'remove') {
      const [id] = args as unknown as [string]
      void pushQuiet(() => api(`/archive/${id}`, { method: 'DELETE' }))
    }
  })
  // b25b-F-hookactions
  // ----- desafios empresariais -----
  challengesStore.$onAction(({ name, args, after }) => {
    if (name === 'create') {
      const d = args[0] as unknown as {
        title: string
        problem: string
        requirements: string[]
        skills: string[]
        deadline: string
        prize: string
      }
      void push(() =>
        api('/challenges', {
          method: 'POST',
          body: {
            title: d.title,
            problem: d.problem,
            requirements: d.requirements,
            skills: d.skills,
            deadline: d.deadline,
            prize: d.prize,
          },
        }),
      )
    }
    if (name === 'setStatus') {
      const [id, status] = args as unknown as [string, 'ativo' | 'rejeitado']
      void push(() => api(`/challenges/${id}/status`, { method: 'PATCH', body: { status } }))
    }
    if (name === 'createTeam') {
      const [challengeId, , teamName] = args as unknown as [string, unknown, string]
      after((result) => {
        if (!result) return
        void push(() => api('/challenge-teams', { method: 'POST', body: { challengeId, name: teamName } }))
      })
    }
    if (name === 'joinTeam') {
      const [teamId] = args as unknown as [string]
      after((result) => {
        if (!result) return
        void push(() => api(`/challenge-teams/${teamId}/join`, { method: 'POST' }))
      })
    }
    if (name === 'leaveTeam') {
      const [teamId, userId] = args as unknown as [string, string]
      if (auth.user?.id !== userId) return
      void push(() => api(`/challenge-teams/${teamId}/leave`, { method: 'POST' }))
    }
    if (name === 'submit') {
      const [teamId, , summary, link] = args as unknown as [string, unknown, string, string]
      after((result) => {
        if (!result) return
        void push(() => api(`/challenge-teams/${teamId}/submission`, { method: 'PUT', body: { summary, link } }))
      })
    }
    if (name === 'score') {
      const [submissionId, value, feedback] = args as unknown as [string, number, string]
      void push(() =>
        api(`/challenge-submissions/${submissionId}/score`, { method: 'PATCH', body: { score: value, feedback } }),
      )
    }
    if (name === 'declareWinner') {
      const [challengeId] = args as unknown as [string]
      after((result) => {
        if (!result) return
        void push(() => api(`/challenges/${challengeId}/winner`, { method: 'POST' }))
      })
    }
  })

  // ----- concurso de debates -----
  debatesStore.$onAction(({ name, args, after }) => {
    if (name === 'createContest') {
      const [title, description, topics] = args as unknown as [string, string, string[]]
      void push(() => api('/debates', { method: 'POST', body: { title, description, topics } }))
    }
    if (name === 'createTeam') {
      const [contestId, , teamName] = args as unknown as [string, unknown, string]
      after((result) => {
        if (!result) return
        void push(() => api('/debate-teams', { method: 'POST', body: { contestId, name: teamName } }))
      })
    }
    if (name === 'joinTeam') {
      const [teamId] = args as unknown as [string]
      after((result) => {
        if (!result) return
        void push(() => api(`/debate-teams/${teamId}/join`, { method: 'POST' }))
      })
    }
    if (name === 'leaveTeam') {
      const [teamId, userId] = args as unknown as [string, string]
      if (auth.user?.id !== userId) return
      void push(() => api(`/debate-teams/${teamId}/leave`, { method: 'POST' }))
    }
    if (name === 'start') {
      const [contestId] = args as unknown as [string]
      after((result) => {
        if ((result as number) > 0) void push(() => api(`/debates/${contestId}/start`, { method: 'POST' }))
      })
    }
    if (name === 'drawRound') {
      const [contestId] = args as unknown as [string]
      after((result) => {
        if ((result as number) > 0) void push(() => api(`/debates/${contestId}/draw`, { method: 'POST' }))
      })
    }
    if (name === 'setResult') {
      const [matchId, scoreA, scoreB] = args as unknown as [string, number, number]
      void push(() => api(`/debate-matches/${matchId}/result`, { method: 'PATCH', body: { scoreA, scoreB } }))
    }
    if (name === 'finish') {
      const [contestId] = args as unknown as [string]
      void push(() => api(`/debates/${contestId}/finish`, { method: 'POST' }))
    }
  })
  // b25c-D-profile
  // Perfil da empresa: carrega do servidor e so depois comeca a enviar alteracoes.
  let companyProfileLoaded = false
  let profileTimer: ReturnType<typeof setTimeout> | undefined
  vueWatch(
    () => auth.user?.id,
    async (id) => {
      companyProfileLoaded = false
      if (!id || auth.user?.role !== 'company') return
      try {
        const d = await api<CompanyProfile>('/companies/me')
        if (auth.user?.id !== id) return
        companyProfilesStore.items = [d]
        companyProfileLoaded = true
      } catch {
        /* sem ligacao: nao envia nada para nao apagar dados */
      }
    },
    { immediate: true },
  )
  vueWatch(
    () => JSON.stringify(companyProfilesStore.items),
    () => {
      if (!companyProfileLoaded || auth.user?.role !== 'company') return
      clearTimeout(profileTimer)
      profileTimer = setTimeout(() => {
        const p = companyProfilesStore.items.find((x) => x.companyId === auth.user?.id)
        if (!p) return
        void push(() =>
          api('/companies/me', {
            method: 'PATCH',
            body: {
              description: p.description,
              location: p.location,
              areas: p.areas,
              contactEmail: p.contactEmail,
              contactPhone: p.contactPhone,
            },
          }),
        )
      }, 800)
    },
  )
  // ANCHOR:sync-hooks

  // ----- atualizacao periodica e ao voltar a janela -----
  setInterval(() => {
    if (document.visibilityState === 'visible' && auth.user) void pullAll()
  }, 20000)
  window.addEventListener('focus', () => {
    if (auth.user) void pullAll()
  })
}
