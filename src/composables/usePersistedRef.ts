import { ref, watch, type Ref } from 'vue'

// Ref reativa que se guarda no localStorage. Será substituída pela API no backend.
export function usePersistedRef<T>(key: string, initial: () => T): Ref<T> {
  let start: T
  try {
    const raw = localStorage.getItem(key)
    start = raw ? (JSON.parse(raw) as T) : initial()
  } catch {
    start = initial()
  }
  const state = ref(start) as Ref<T>
  watch(
    state,
    (value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        /* ignora */
      }
    },
    { deep: true },
  )
  return state
}
