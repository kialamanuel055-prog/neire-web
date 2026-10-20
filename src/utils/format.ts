function toDate(iso: string): Date {
  return iso.length === 10 ? new Date(iso + 'T23:59:59') : new Date(iso)
}

export function formatDate(iso: string): string {
  const d = new Date(iso.length === 10 ? iso + 'T12:00:00' : iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('pt-PT', { dateStyle: 'medium', timeStyle: 'short' })
}

export function isPast(iso: string): boolean {
  return toDate(iso).getTime() < Date.now()
}

export function uid(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}
