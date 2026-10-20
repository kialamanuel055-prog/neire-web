import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { seedProfiles } from '@/mocks/seed'
import { uid } from '@/utils/format'
import type { Project, Skill, StudentProfile } from '@/types'

export const useProfilesStore = defineStore('profiles', () => {
  const items = usePersistedRef<StudentProfile[]>('neire.v1.profiles', () => structuredClone(seedProfiles))

  function byUser(userId: string) {
    return items.value.find((p) => p.userId === userId)
  }

  function ensure(user: { id: string; name: string }): StudentProfile {
    if (!byUser(user.id)) {
      items.value.push({
        userId: user.id,
        name: user.name,
        course: '',
        year: '',
        location: '',
        headline: '',
        languages: [],
        skills: [],
        projects: [],
        available: true,
      })
    }
    return byUser(user.id)!
  }

  function completeness(p: StudentProfile): number {
    const checks = [
      !!p.headline,
      !!p.course,
      !!p.year,
      !!p.location,
      p.languages.length > 0,
      p.skills.length >= 3,
      p.projects.length >= 1,
    ]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
  }

  function addSkill(userId: string, skill: Skill) {
    const p = byUser(userId)
    if (!p) return
    if (p.skills.some((s) => s.name.toLowerCase() === skill.name.toLowerCase())) return
    p.skills.push(skill)
  }

  function removeSkill(userId: string, name: string) {
    const p = byUser(userId)
    if (p) p.skills = p.skills.filter((s) => s.name !== name)
  }

  function addProject(userId: string, project: Omit<Project, 'id'>) {
    byUser(userId)?.projects.push({ ...project, id: uid('p') })
  }

  function removeProject(userId: string, id: string) {
    const p = byUser(userId)
    if (p) p.projects = p.projects.filter((x) => x.id !== id)
  }

  return { items, byUser, ensure, completeness, addSkill, removeSkill, addProject, removeProject }
})
