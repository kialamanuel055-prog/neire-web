import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { seedApplications } from '@/mocks/seed'
import { applicationStatusLabels } from '@/config/labels'
import { useAuditStore } from '@/stores/audit'
import { useNotificationsStore } from '@/stores/notifications'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { uid } from '@/utils/format'
import type { Application, ApplicationStatus } from '@/types'

export const useApplicationsStore = defineStore('applications', () => {
  const items = usePersistedRef<Application[]>('neire.v1.applications', () => structuredClone(seedApplications))
  const audit = useAuditStore()
  const notifications = useNotificationsStore()
  const opps = useOpportunitiesStore()

  function forStudent(studentId: string) {
    return items.value.filter((a) => a.studentId === studentId)
  }

  function forOpportunity(opportunityId: string) {
    return items.value.filter((a) => a.opportunityId === opportunityId)
  }

  function find(opportunityId: string, studentId: string) {
    return items.value.find((a) => a.opportunityId === opportunityId && a.studentId === studentId)
  }

  function apply(opportunityId: string, student: { id: string; name: string }, message: string) {
    if (find(opportunityId, student.id)) return null
    const now = new Date().toISOString()
    const app: Application = {
      id: uid('a'),
      opportunityId,
      studentId: student.id,
      studentName: student.name,
      status: 'enviada',
      message,
      createdAt: now,
      history: [{ status: 'enviada', at: now }],
    }
    items.value.unshift(app)
    const opp = opps.byId(opportunityId)
    if (opp) {
      notifications.notify(opp.companyId, 'Nova candidatura', `${student.name} candidatou-se a "${opp.title}".`, '/app/empresa/candidaturas')
    }
    return app
  }

  function setStatus(id: string, status: ApplicationStatus) {
    const app = items.value.find((a) => a.id === id)
    if (!app || app.status === status) return
    app.status = status
    app.history.push({ status, at: new Date().toISOString() })
    audit.log('Estado de candidatura alterado', `${app.studentName} → ${applicationStatusLabels[status]}`)
    const title = opps.byId(app.opportunityId)?.title ?? 'a oportunidade'
    notifications.notify(app.studentId, 'Candidatura atualizada', `${title}: ${applicationStatusLabels[status]}`, '/app/estudante/candidaturas')
  }

  return { items, forStudent, forOpportunity, find, apply, setStatus }
})
