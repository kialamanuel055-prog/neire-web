import { useApplicationsStore } from '@/stores/applications'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useCompaniesStore } from '@/stores/companies'
import { useSkillRequestsStore } from '@/stores/skillrequests'
import { useAcademyStore } from '@/stores/academy'
import { useEventsStore } from '@/stores/events'
import { useProfilesStore } from '@/stores/profiles'
import { applicationStatusLabels, companyStatusLabels, skillLevelLabels } from '@/config/labels'
import { issueCertificate, notifyUser } from '@/integrations/adapters'
import type { ApplicationStatus, CompanyStatus, OpportunityStatus, SkillLevel } from '@/types'

// Ajusta aqui se alguma rota tiver outro caminho.
const ADMIN_ID = 'u4'
const LINKS = {
  candidaturasEstudante: '/app/estudante/candidaturas',
  candidaturasEmpresa: '/app/empresa/candidaturas',
  oportunidadesAdmin: '/app/admin/oportunidades',
  perfilEmpresa: '/app/empresa/perfil',
  competenciasEstudante: '/app/estudante/competencias',
  competenciasAdmin: '/app/admin/competencias',
  certificados: '/app/estudante/certificados',
  eventos: '/app/estudante/eventos',
  oportunidade: (id: string) => `/app/estudante/oportunidades/${id}`,
}

let installed = false

export function installIntegrations() {
  if (installed) return
  installed = true

  const apps = useApplicationsStore()
  const opps = useOpportunitiesStore()
  const companies = useCompaniesStore()
  const skillRequests = useSkillRequestsStore()
  const academy = useAcademyStore()
  const events = useEventsStore()
  const profiles = useProfilesStore()

  const everyStudentId = () => profiles.items.map((p) => p.userId)

  // ----- candidaturas -----
  apps.$onAction(({ name, args, after }) => {
    if (name === 'setStatus') {
      const [id, status] = args as unknown as [string, ApplicationStatus]
      const prev = apps.items.find((a) => a.id === id)?.status
      after(() => {
        const a = apps.items.find((x) => x.id === id)
        if (!a || prev === status || a.status !== status) return
        const title = opps.byId(a.opportunityId)?.title ?? 'Oportunidade'
        notifyUser(a.studentId, 'Candidatura atualizada', `${title}: ${applicationStatusLabels[status]}`, LINKS.candidaturasEstudante)
      })
    }
    if (name === 'apply') {
      const [oppId, student] = args as unknown as [string, { id: string; name: string }, string]
      after((result) => {
        if (!result) return
        const o = opps.byId(oppId)
        if (o) notifyUser(o.companyId, 'Nova candidatura', `${student.name} candidatou-se a ${o.title}`, LINKS.candidaturasEmpresa)
      })
    }
  })

  // ----- oportunidades -----
  opps.$onAction(({ name, args, after }) => {
    if (name === 'create') {
      after((result) => {
        const o = result as unknown as { title: string; companyName: string } | undefined
        if (o) notifyUser(ADMIN_ID, 'Nova oportunidade para validar', `${o.title} (${o.companyName})`, LINKS.oportunidadesAdmin)
      })
    }
    if (name === 'setStatus') {
      const [id, status] = args as unknown as [string, OpportunityStatus]
      const prev = opps.byId(id)?.status
      after(() => {
        const o = opps.byId(id)
        if (!o || prev === status || o.status !== status) return
        if (status === 'publicada') {
          notifyUser(o.companyId, 'Oportunidade publicada', `"${o.title}" foi aprovada e já está visível aos estudantes.`, LINKS.candidaturasEmpresa)
          for (const uid of everyStudentId()) {
            notifyUser(uid, 'Nova oportunidade', `${o.title} · ${o.companyName}`, LINKS.oportunidade(o.id))
          }
        } else if (status === 'rejeitada') {
          notifyUser(o.companyId, 'Oportunidade rejeitada', `"${o.title}" não foi aprovada pelo NEIRE.`, LINKS.candidaturasEmpresa)
        }
      })
    }
  })

  // ----- verificacao de empresas -----
  companies.$onAction(({ name, args, after }) => {
    if (name !== 'advance') return
    const [id] = args as unknown as [string]
    const prev: CompanyStatus | undefined = companies.byId(id)?.status
    after(() => {
      const c = companies.byId(id)
      if (!c || c.status === prev) return
      notifyUser(c.id, 'Verificação da empresa', `O estado da tua empresa passou a: ${companyStatusLabels[c.status]}.`, LINKS.perfilEmpresa)
    })
  })

  // ----- verificacao de competencias -----
  skillRequests.$onAction(({ name, args, after }) => {
    if (name === 'create') {
      after((result) => {
        const r = result as unknown as { userName: string; skill: string } | null
        if (r) notifyUser(ADMIN_ID, 'Novo pedido de verificação', `${r.userName}: ${r.skill}`, LINKS.competenciasAdmin)
      })
    }
    if (name === 'decide') {
      const [id, approved, level] = args as unknown as [string, boolean, SkillLevel]
      const prev = skillRequests.items.find((x) => x.id === id)?.status
      after(() => {
        const r = skillRequests.items.find((x) => x.id === id)
        if (!r || prev !== 'pendente' || r.status === 'pendente') return
        if (approved) {
          notifyUser(r.userId, 'Competência verificada', `${r.skill}: ${skillLevelLabels[r.resultLevel ?? level]}`, LINKS.competenciasEstudante)
        } else {
          notifyUser(r.userId, 'Pedido de verificação rejeitado', `${r.skill}: o NEIRE não conseguiu confirmar a evidência.`, LINKS.competenciasEstudante)
        }
      })
    }
  })

  // ----- formacao: concluir emite certificado -----
  academy.$onAction(({ name, args, after }) => {
    if (name !== 'complete') return
    const [courseId, userId] = args as unknown as [string, string]
    const was = academy.items.find((c) => c.id === courseId)?.completed.includes(userId) ?? false
    after(() => {
      const c = academy.items.find((x) => x.id === courseId)
      if (was || !c || !c.completed.includes(userId)) return
      const userName = profiles.byUser(userId)?.name ?? userId
      issueCertificate({
        userId,
        userName,
        title: c.title,
        kind: 'formacao',
        date: new Date().toISOString().slice(0, 10),
      })
      notifyUser(userId, 'Formação concluída', `${c.title}`, LINKS.certificados)
    })
  })

  // ----- eventos -----
  events.$onAction(({ name, after }) => {
    if (name !== 'create') return
    after((result) => {
      const ev = result as unknown as { title: string } | undefined
      if (!ev) return
      for (const uid of everyStudentId()) {
        notifyUser(uid, 'Novo evento', ev.title, LINKS.eventos)
      }
    })
  })

  // ANCHOR:hooks
}
