import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { useAuditStore } from '@/stores/audit'
import { useNotificationsStore } from '@/stores/notifications'
import { uid } from '@/utils/format'
import type { Mentor, MentorshipRequest } from '@/types'

const seedMentors: Mentor[] = [
  {
    userId: 'u2',
    name: 'Alumni Demo',
    area: 'Redes e Telecomunicações',
    company: 'Telecom Horizonte',
    bio: 'Engenheiro de redes. Posso ajudar com carreira em telecomunicações, certificações e preparação para entrevistas.',
    active: true,
  },
  {
    userId: 'm2',
    name: 'Marta Sebastião',
    area: 'Cibersegurança',
    company: 'Banco Atlântico Exemplo',
    bio: 'Analista de segurança. Ajudo a definir um percurso de aprendizagem e a montar um laboratório prático.',
    active: true,
  },
  {
    userId: 'm3',
    name: 'Paulo Manuel',
    area: 'Desenvolvimento de software e carreira',
    company: 'Empresa Demo',
    bio: 'Engenheiro de software. Revejo portfólios, CVs e projetos pessoais.',
    active: true,
  },
]

export const useMentorshipStore = defineStore('mentorship', () => {
  const mentors = usePersistedRef<Mentor[]>('neire.v1.mentors', () => structuredClone(seedMentors))
  const requests = usePersistedRef<MentorshipRequest[]>('neire.v1.mentorship', () => [])
  const audit = useAuditStore()
  const notifications = useNotificationsStore()

  const activeMentors = computed(() => mentors.value.filter((m) => m.active))

  function byUser(userId: string) {
    return mentors.value.find((m) => m.userId === userId)
  }

  function forStudent(studentId: string) {
    return requests.value.filter((r) => r.studentId === studentId)
  }

  function forMentor(mentorId: string) {
    return requests.value.filter((r) => r.mentorId === mentorId)
  }

  function becomeMentor(user: { id: string; name: string }, area: string, company: string, bio: string) {
    const existing = byUser(user.id)
    if (existing) {
      existing.area = area
      existing.company = company
      existing.bio = bio
      existing.active = true
      return existing
    }
    const m: Mentor = { userId: user.id, name: user.name, area, company, bio, active: true }
    mentors.value.push(m)
    audit.log('Novo mentor', `${user.name} · ${area}`)
    return m
  }

  function toggleActive(userId: string) {
    const m = byUser(userId)
    if (m) m.active = !m.active
  }

  function request(student: { id: string; name: string }, mentorId: string, topic: string, message: string) {
    const mentor = byUser(mentorId)
    if (!mentor || !mentor.active || mentor.userId === student.id) return null
    const duplicate = requests.value.some(
      (r) => r.studentId === student.id && r.mentorId === mentorId && r.status === 'pendente',
    )
    if (duplicate) return null
    const req: MentorshipRequest = {
      id: uid('mr'),
      studentId: student.id,
      studentName: student.name,
      mentorId,
      mentorName: mentor.name,
      topic,
      message,
      status: 'pendente',
      createdAt: new Date().toISOString(),
    }
    requests.value.unshift(req)
    notifications.notify(mentorId, 'Novo pedido de mentoria', `${student.name}: ${topic}`, '/app/estudante/mentoria')
    return req
  }

  function respond(id: string, status: 'aceite' | 'recusada') {
    const req = requests.value.find((r) => r.id === id)
    if (!req || req.status !== 'pendente') return
    req.status = status
    audit.log(`Mentoria ${status === 'aceite' ? 'aceite' : 'recusada'}`, `${req.mentorName} ↔ ${req.studentName}`)
    notifications.notify(
      req.studentId,
      status === 'aceite' ? 'Mentoria aceite' : 'Mentoria recusada',
      `${req.mentorName} respondeu ao teu pedido: ${req.topic}`,
      '/app/estudante/mentoria',
    )
  }

  return { mentors, requests, activeMentors, byUser, forStudent, forMentor, becomeMentor, toggleActive, request, respond }
})
