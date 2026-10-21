import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { useAuditStore } from '@/stores/audit'
import { useNotificationsStore } from '@/stores/notifications'
import { uid } from '@/utils/format'
import type { DebateContest, DebateMatch, DebateTeam } from '@/types'

const MAX_TEAM = 3

const seedContests: DebateContest[] = [
  {
    id: 'd1',
    title: 'Concurso de Debates NEIRE 2026',
    description: 'A primeira grande competição do NEIRE. Forma a tua equipa e defende ideias com argumentos.',
    topics: [
      'A inteligência artificial vai eliminar mais empregos do que criar?',
      'O estágio deve ser obrigatório em todos os cursos?',
      'As redes sociais ajudam ou prejudicam a carreira dos jovens?',
    ],
    status: 'inscricoes',
    createdAt: '2026-10-10T09:00:00.000Z',
  },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i] as T
    a[i] = a[j] as T
    a[j] = tmp
  }
  return a
}

export interface RankRow {
  team: DebateTeam
  played: number
  wins: number
  draws: number
  losses: number
  points: number
  scored: number
}

export const useDebatesStore = defineStore('debates', () => {
  const contests = usePersistedRef<DebateContest[]>('neire.v1.debate-contests', () => structuredClone(seedContests))
  const teams = usePersistedRef<DebateTeam[]>('neire.v1.debate-teams', () => [])
  const matches = usePersistedRef<DebateMatch[]>('neire.v1.debate-matches', () => [])
  const audit = useAuditStore()
  const notifications = useNotificationsStore()

  function byId(id: string) {
    return contests.value.find((c) => c.id === id)
  }
  function teamsOf(contestId: string) {
    return teams.value.filter((t) => t.contestId === contestId)
  }
  function matchesOf(contestId: string) {
    return matches.value.filter((m) => m.contestId === contestId).sort((a, b) => a.round - b.round)
  }
  function teamOf(contestId: string, userId: string) {
    return teams.value.find((t) => t.contestId === contestId && t.members.some((m) => m.id === userId))
  }
  function teamName(id: string) {
    return teams.value.find((t) => t.id === id)?.name ?? '—'
  }

  function createContest(title: string, description: string, topics: string[]) {
    const c: DebateContest = {
      id: uid('d'),
      title,
      description,
      topics,
      status: 'inscricoes',
      createdAt: new Date().toISOString(),
    }
    contests.value.unshift(c)
    audit.log('Concurso de debates criado', title)
    return c
  }

  function createTeam(contestId: string, user: { id: string; name: string }, name: string) {
    const c = byId(contestId)
    if (!c || c.status !== 'inscricoes' || teamOf(contestId, user.id)) return null
    const t: DebateTeam = { id: uid('dt'), contestId, name, members: [{ id: user.id, name: user.name }] }
    teams.value.push(t)
    return t
  }

  function joinTeam(teamId: string, user: { id: string; name: string }) {
    const t = teams.value.find((x) => x.id === teamId)
    const c = t ? byId(t.contestId) : undefined
    if (!t || !c || c.status !== 'inscricoes') return false
    if (teamOf(t.contestId, user.id) || t.members.length >= MAX_TEAM) return false
    t.members.push({ id: user.id, name: user.name })
    return true
  }

  function leaveTeam(teamId: string, userId: string) {
    const t = teams.value.find((x) => x.id === teamId)
    const c = t ? byId(t.contestId) : undefined
    if (!t || !c || c.status !== 'inscricoes') return
    t.members = t.members.filter((m) => m.id !== userId)
    if (t.members.length === 0) teams.value = teams.value.filter((x) => x.id !== teamId)
  }

  // Sorteia uma nova ronda. Devolve nº de confrontos, ou -1 se ha resultados em falta.
  function drawRound(contestId: string): number {
    const c = byId(contestId)
    if (!c || c.status !== 'em_curso') return 0
    const existing = matchesOf(contestId)
    if (existing.some((m) => m.scoreA === undefined)) return -1
    const round = existing.reduce((n, m) => Math.max(n, m.round), 0) + 1
    const list = shuffle(teamsOf(contestId))
    let count = 0
    for (let i = 0; i + 1 < list.length; i += 2) {
      const a = list[i]
      const b = list[i + 1]
      if (!a || !b) break
      const topic = c.topics.length ? (c.topics[Math.floor(Math.random() * c.topics.length)] ?? 'Tema livre') : 'Tema livre'
      matches.value.push({ id: uid('dm'), contestId, round, teamAId: a.id, teamBId: b.id, topic })
      for (const m of [...a.members, ...b.members]) {
        notifications.notify(m.id, 'Debate sorteado', `Ronda ${round}: ${a.name} vs ${b.name}`, '/app/estudante/debates')
      }
      count++
    }
    if (count > 0) audit.log('Ronda de debates sorteada', `${c.title} · ronda ${round}`)
    return count
  }

  function start(contestId: string): number {
    const c = byId(contestId)
    if (!c || c.status !== 'inscricoes' || teamsOf(contestId).length < 2) return 0
    c.status = 'em_curso'
    audit.log('Concurso de debates iniciado', c.title)
    return drawRound(contestId)
  }

  function setResult(matchId: string, a: number, b: number) {
    const m = matches.value.find((x) => x.id === matchId)
    if (!m) return
    m.scoreA = a
    m.scoreB = b
    audit.log('Resultado de debate registado', `${teamName(m.teamAId)} ${a} - ${b} ${teamName(m.teamBId)}`)
  }

  function ranking(contestId: string): RankRow[] {
    const rows = new Map<string, RankRow>()
    for (const t of teamsOf(contestId)) {
      rows.set(t.id, { team: t, played: 0, wins: 0, draws: 0, losses: 0, points: 0, scored: 0 })
    }
    for (const m of matchesOf(contestId)) {
      if (m.scoreA === undefined || m.scoreB === undefined) continue
      const ra = rows.get(m.teamAId)
      const rb = rows.get(m.teamBId)
      if (!ra || !rb) continue
      ra.played++
      rb.played++
      ra.scored += m.scoreA
      rb.scored += m.scoreB
      if (m.scoreA > m.scoreB) {
        ra.wins++
        rb.losses++
        ra.points += 3
      } else if (m.scoreA < m.scoreB) {
        rb.wins++
        ra.losses++
        rb.points += 3
      } else {
        ra.draws++
        rb.draws++
        ra.points += 1
        rb.points += 1
      }
    }
    return [...rows.values()].sort((x, y) => y.points - x.points || y.scored - x.scored)
  }

  function finish(contestId: string) {
    const c = byId(contestId)
    if (!c || c.status !== 'em_curso') return
    c.status = 'terminado'
    audit.log('Concurso de debates terminado', c.title)
  }

  return {
    contests, teams, matches, maxTeam: MAX_TEAM,
    byId, teamsOf, matchesOf, teamOf, teamName,
    createContest, createTeam, joinTeam, leaveTeam, drawRound, start, setResult, ranking, finish,
  }
})
