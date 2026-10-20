import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { useAuditStore } from '@/stores/audit'
import { useNotificationsStore } from '@/stores/notifications'
import { uid } from '@/utils/format'
import type { Certificate } from '@/types'

function makeCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 8; i++) s += chars.charAt(Math.floor(Math.random() * chars.length))
  return `NEIRE-${s.slice(0, 4)}-${s.slice(4)}`
}

export const useCertificatesStore = defineStore('certificates', () => {
  const items = usePersistedRef<Certificate[]>('neire.v1.certificates', () => [])
  const audit = useAuditStore()
  const notifications = useNotificationsStore()

  function byStudent(studentId: string) {
    return items.value.filter((c) => c.studentId === studentId)
  }

  function byCode(code: string) {
    const needle = code.trim().toUpperCase()
    return needle ? items.value.find((c) => c.code === needle) : undefined
  }

  function issue(student: { id: string; name: string }, activity: string) {
    const cert: Certificate = {
      id: uid('c'),
      code: makeCode(),
      studentId: student.id,
      studentName: student.name,
      activity,
      issuer: 'NEIRE · INSTIC',
      issuedAt: new Date().toISOString(),
    }
    items.value.unshift(cert)
    audit.log('Certificado emitido', `${student.name} · ${activity} · ${cert.code}`)
    notifications.notify(student.id, 'Novo certificado', `Recebeste um certificado: ${activity}`, '/app/estudante/certificados')
    return cert
  }

  return { items, byStudent, byCode, issue }
})
