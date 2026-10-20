import { defineStore } from 'pinia'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { uid } from '@/utils/format'
import type { Account } from '@/types'

export const useAccountsStore = defineStore('accounts', () => {
  const items = usePersistedRef<Account[]>('neire.v1.accounts', () => [])

  function byEmail(email: string) {
    const e = email.trim().toLowerCase()
    return items.value.find((a) => a.email.toLowerCase() === e)
  }

  function create(data: Omit<Account, 'id' | 'createdAt'>) {
    const acc: Account = {
      ...data,
      id: uid(data.role === 'company' ? 'c' : 's'),
      createdAt: new Date().toISOString(),
    }
    items.value.push(acc)
    return acc
  }

  return { items, byEmail, create }
})
