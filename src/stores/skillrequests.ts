import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { useAuditStore } from '@/stores/audit'
import { useProfilesStore } from '@/stores/profiles'
import { uid } from '@/utils/format'
import type { SkillLevel, SkillRequest } from '@/types'

export const useSkillRequestsStore = defineStore('skillRequests', () => {
  const items = usePersistedRef<SkillRequest[]>('neire.v1.skillRequests', () => [])
  const audit = useAuditStore()

  function create(data: Pick<SkillRequest, 'userId' | 'userName' | 'skill' | 'evidenceType' | 'evidence'>) {
    if (items.value.some((r) => r.userId === data.userId && r.skill === data.skill && r.status === 'pendente')) {
      return null
    }
    const r: SkillRequest = { ...data, id: uid('sr'), status: 'pendente', at: new Date().toISOString() }
    items.value.unshift(r)
    return r
  }

  function decide(id: string, approved: boolean, level: SkillLevel) {
    const r = items.value.find((x) => x.id === id)
    if (!r || r.status !== 'pendente') return
    if (approved) {
      const profiles = useProfilesStore()
      const skill = profiles.byUser(r.userId)?.skills.find((s) => s.name === r.skill)
      if (skill) skill.level = level
      r.status = 'aprovada'
      r.resultLevel = level
    } else {
      r.status = 'rejeitada'
    }
    r.decidedAt = new Date().toISOString()
    audit.log(approved ? 'Competência verificada' : 'Verificação rejeitada', `${r.userName}: ${r.skill}`)
  }

  return { items, create, decide }
})
