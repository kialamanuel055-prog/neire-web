import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { initTheme } from '@/composables/useTheme'
import { installDepartmentGuard } from '@/router/departmentGuard'
import DepartmentBadge from '@/components/DepartmentBadge.vue'
import '@fontsource-variable/inter'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/fraunces'
import { installIntegrations } from '@/integrations/hooks'
import { installApiSession } from '@/composables/useApiAuth'
import { installApiSync } from '@/api/sync'
import { setUnauthorizedHandler } from '@/composables/sessionEvents'
// ANCHOR:main-imports

const app = createApp(App)
app.use(createPinia())
app.use(router)
initTheme()
installDepartmentGuard(router)
app.component('DepartmentBadge', DepartmentBadge)
installIntegrations()
installApiSession()
installApiSync()
setUnauthorizedHandler(() => {
  if (router.currentRoute.value.matched.some((r) => r.meta.requiresAuth)) {
    void router.replace({ name: 'login' })
  }
})
// ANCHOR:main-plugins
app.mount('#app')
