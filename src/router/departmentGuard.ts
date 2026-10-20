import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDepartment } from '@/composables/useDepartment'
import { moduleForPath } from '@/config/departmentAccess'

export function installDepartmentGuard(router: Router) {
  router.beforeEach((to) => {
    const auth = useAuthStore()
    if (auth.user?.role !== 'admin') return true
    const module = moduleForPath(to.path)
    if (!module) return true
    const { canAccess } = useDepartment()
    if (canAccess(module)) return true
    return { path: '/app/admin', query: { semAcesso: module } }
  })
}
