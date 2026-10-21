import { apiEnabled } from '@/api/client'
import { useNotificationsStore } from '@/stores/notifications'
import { useCertificatesStore } from '@/stores/certificates'

// Unico ponto que toca nas stores de notificacoes e certificados.
// Os corpos entre :start e :end podem ser trocados com Set-Block.

export function notifyUser(userId: string, title: string, body: string, link?: string): void {
  // ANCHOR:adapter-notify:start
  if (apiEnabled) return // em modo API as notificacoes sao criadas pelo servidor
  useNotificationsStore().notify(userId, title, body, link)
  // ANCHOR:adapter-notify:end
}

export interface CertificateInput {
  userId: string
  userName: string
  title: string
  kind: 'formacao' | 'evento' | 'competicao'
  date: string
}

export function issueCertificate(input: CertificateInput): void {
  // ANCHOR:adapter-certificate:start
  if (apiEnabled) return // em modo API o servidor emite o certificado
  useCertificatesStore().issue({ id: input.userId, name: input.userName }, input.title)
  // ANCHOR:adapter-certificate:end
}
