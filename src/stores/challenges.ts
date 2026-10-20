import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { useAuditStore } from '@/stores/audit'
import { useNotificationsStore } from '@/stores/notifications'
import { useProfilesStore } from '@/stores/profiles'
import { useCertificatesStore } from '@/stores/certificates'
import { isPast, uid } from '@/utils/format'
import type { Challenge, ChallengeSubmission, ChallengeTeam } from '@/types'

const MAX_TEAM = 4

const seedChallenges: Challenge[] = [
  {
    id: 'ch1',
    title: 'Reduzir o tempo de atendimento ao cliente',
    companyId: 'u3',
    companyName: 'Empresa Demo',
    problem:
      'Os clientes esperam demasiado tempo no atendimento presencial e telefónico. Propõe uma solução digital que reduza o tempo médio de atendimento sem perder qualidade.',
    requirements: ['Equipas de 2 a 4 estudantes', 'Protótipo ou descrição detalhada da solução', 'Apresentação de 5 minutos'],
    skills: ['Programação', 'Design de interfaces', 'Análise de dados'],
    deadline: '2026-12-15',
    prize: 'Estágio remunerado + mentoria',
    status: 'ativo',
    createdAt: '2026-10-12T09:00:00.000Z',
  },
]

export const useChallengesStore = defineStore('challenges', () => {
  const items = usePersistedRef<Challenge[]>('neire.v1.challenges', () => structuredClone(seedChallenges))
  const teams = usePersistedRef<ChallengeTeam[]>('neire.v1.challenge-teams', () => [])
  const submissions = usePersistedRef<ChallengeSubmission[]>('neire.v1.challenge-subs', () => [])
  const audit = useAuditStore()
  const notifications = useNotificationsStore()
  const profiles = useProfilesStore()
  const certificates = useCertificatesStore()

  const active = computed(() => items.value.filter((c) => c.status === 'ativo'))
  const pending = computed(() => items.value.filter((c) => c.status === 'pendente'))

  function byId(id: string) {
    return items.value.find((c) => c.id === id)
  }
  function byCompany(companyId: string) {
    return items.value.filter((c) => c.companyId === companyId)
  }
  function teamsOf(challengeId: string) {
    return teams.value.filter((t) => t.challengeId === challengeId)
  }
  function teamOf(challengeId: string, userId: string) {
    return teams.value.find((t) => t.challengeId === challengeId && t.members.some((m) => m.id === userId))
  }
  function submissionsOf(challengeId: string) {
    return submissions.value.filter((s) => s.challengeId === challengeId)
  }
  function submissionOf(teamId: string) {
    return submissions.value.find((s) => s.teamId === teamId)
  }
  function canParticipate(ch: Challenge) {
    return ch.status === 'ativo' && !isPast(ch.deadline)
  }

  function create(data: Omit<Challenge, 'id' | 'status' | 'createdAt' | 'winnerTeamId'>) {
    const ch: Challenge = { ...data, id: uid('ch'), status: 'pendente', createdAt: new Date().toISOString() }
    items.value.unshift(ch)
    audit.log('Desafio submetido', `${ch.title} (${ch.companyName})`)
    notifications.notify('u4', 'Novo desafio para validar', `${ch.companyName}: ${ch.title}`, '/app/admin/desafios')
    return ch
  }

  function setStatus(id: string, status: 'ativo' | 'rejeitado') {
    const ch = byId(id)
    if (!ch || ch.status !== 'pendente') return
    ch.status = status
    audit.log(status === 'ativo' ? 'Desafio publicado' : 'Desafio rejeitado', ch.title)
    if (status === 'ativo') {
      notifications.notify(ch.companyId, 'Desafio aprovado', `"${ch.title}" já está visível aos estudantes.`, '/app/empresa/desafios')
      for (const p of profiles.items) {
        notifications.notify(p.userId, 'Novo desafio empresarial', `${ch.title} · ${ch.companyName}`, `/app/estudante/desafios/${ch.id}`)
      }
    } else {
      notifications.notify(ch.companyId, 'Desafio rejeitado', `"${ch.title}" não foi aprovado pelo NEIRE.`, '/app/empresa/desafios')
    }
  }

  function createTeam(challengeId: string, user: { id: string; name: string }, name: string) {
    const ch = byId(challengeId)
    if (!ch || !canParticipate(ch) || teamOf(challengeId, user.id)) return null
    const team: ChallengeTeam = { id: uid('ct'), challengeId, name, members: [{ id: user.id, name: user.name }] }
    teams.value.unshift(team)
    return team
  }

  function joinTeam(teamId: string, user: { id: string; name: string }) {
    const t = teams.value.find((x) => x.id === teamId)
    const ch = t ? byId(t.challengeId) : undefined
    if (!t || !ch || !canParticipate(ch)) return false
    if (teamOf(t.challengeId, user.id) || t.members.length >= MAX_TEAM) return false
    t.members.push({ id: user.id, name: user.name })
    return true
  }

  function leaveTeam(teamId: string, userId: string) {
    const t = teams.value.find((x) => x.id === teamId)
    const ch = t ? byId(t.challengeId) : undefined
    if (!t || !ch || ch.status === 'encerrado') return
    t.members = t.members.filter((m) => m.id !== userId)
    if (t.members.length === 0) {
      teams.value = teams.value.filter((x) => x.id !== teamId)
      submissions.value = submissions.value.filter((s) => s.teamId !== teamId)
    }
  }

  function submit(teamId: string, userId: string, summary: string, link: string) {
    const t = teams.value.find((x) => x.id === teamId)
    const ch = t ? byId(t.challengeId) : undefined
    if (!t || !ch || !canParticipate(ch) || !t.members.some((m) => m.id === userId)) return false
    const now = new Date().toISOString()
    const existing = submissionOf(teamId)
    if (existing) {
      existing.summary = summary
      existing.link = link
      existing.submittedAt = now
      delete existing.score
      delete existing.feedback
    } else {
      submissions.value.push({
        id: uid('cs'),
        challengeId: ch.id,
        teamId,
        teamName: t.name,
        summary,
        link,
        submittedAt: now,
      })
    }
    notifications.notify(ch.companyId, 'Nova submissão', `A equipa ${t.name} submeteu uma solução para "${ch.title}".`, '/app/empresa/desafios')
    return true
  }

  function score(submissionId: string, value: number, feedback: string) {
    const s = submissions.value.find((x) => x.id === submissionId)
    if (!s) return
    s.score = Math.min(10, Math.max(0, Math.round(value * 10) / 10))
    s.feedback = feedback.trim()
    audit.log('Submissão avaliada', `${s.teamName}: ${s.score}/10`)
    const t = teams.value.find((x) => x.id === s.teamId)
    for (const m of t?.members ?? []) {
      notifications.notify(m.id, 'Submissão avaliada', `${s.teamName} recebeu ${s.score}/10.`, `/app/estudante/desafios/${s.challengeId}`)
    }
  }

  function declareWinner(challengeId: string) {
    const ch = byId(challengeId)
    if (!ch || ch.status !== 'ativo') return null
    const scored = submissionsOf(challengeId).filter((s) => s.score !== undefined)
    if (scored.length === 0) return null
    const best = scored.reduce((a, b) => ((b.score ?? 0) > (a.score ?? 0) ? b : a))
    ch.winnerTeamId = best.teamId
    ch.status = 'encerrado'
    audit.log('Vencedor de desafio declarado', `${ch.title} → ${best.teamName}`)
    const t = teams.value.find((x) => x.id === best.teamId)
    for (const m of t?.members ?? []) {
      certificates.issue({ id: m.id, name: m.name }, `Vencedor do desafio: ${ch.title}`)
      notifications.notify(m.id, 'Ganhaste o desafio!', `${best.teamName} venceu "${ch.title}".`, `/app/estudante/desafios/${ch.id}`)
    }
    return best
  }

  return {
    items, teams, submissions, active, pending, maxTeam: MAX_TEAM,
    byId, byCompany, teamsOf, teamOf, submissionsOf, submissionOf, canParticipate,
    create, setStatus, createTeam, joinTeam, leaveTeam, submit, score, declareWinner,
  }
})
