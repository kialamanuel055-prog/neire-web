import { ref } from 'vue'

export type Theme = 'dark' | 'light'

const KEY = 'neire.theme'
const theme = ref<Theme>('dark')

function apply(t: Theme) {
  document.documentElement.classList.toggle('dark', t === 'dark')
}

export function initTheme() {
  let saved: string | null = null
  try {
    saved = localStorage.getItem(KEY)
  } catch {
    /* ignora */
  }
  theme.value = saved === 'light' ? 'light' : 'dark'
  apply(theme.value)
}

export function useTheme() {
  function set(t: Theme) {
    theme.value = t
    apply(t)
    try {
      localStorage.setItem(KEY, t)
    } catch {
      /* ignora */
    }
  }
  function toggle() {
    set(theme.value === 'dark' ? 'light' : 'dark')
  }
  return { theme, set, toggle }
}
