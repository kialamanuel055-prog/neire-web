import { computed } from 'vue'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { departments } from '@/config/content'

const current = usePersistedRef<string>('neire.v1.department', () => 'geral')

export function useDepartment() {
  const department = computed(() => departments.find((d) => d.id === current.value) ?? departments[0]!)
  function canAccess(module: string) {
    return department.value.modules.includes(module)
  }
  return { current, department, canAccess }
}
