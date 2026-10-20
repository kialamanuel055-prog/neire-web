const RAW = import.meta.env.VITE_API_URL as string | undefined
const BASE = RAW ? RAW.replace(/\/+$/, '') : ''
const TOKEN_KEY = 'neire.token'

// Sem VITE_API_URL a aplicacao funciona em modo demonstracao (dados locais).
export const apiEnabled = BASE !== ''

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignora */
  }
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const translations: [RegExp, string][] = [
  [/email must be an email/i, 'Indica um email válido.'],
  [/password must be longer than or equal to (\d+)/i, 'A palavra-passe deve ter pelo menos $1 caracteres.'],
  [/password must be shorter than or equal to/i, 'A palavra-passe é demasiado longa.'],
  [/name must be longer than or equal to/i, 'Indica o nome.'],
]

function translate(msg: string): string {
  for (const [rx, text] of translations) {
    const m = rx.exec(msg)
    if (m) return text.replace('$1', m[1] ?? '')
  }
  return msg
}

interface Options {
  method?: string
  body?: unknown
  auth?: boolean
}

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token && options.auth !== false) headers['Authorization'] = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Não foi possível contactar o servidor. Tenta novamente dentro de instantes.')
  }

  if (res.status === 204) return undefined as T
  const payload: unknown = await res.json().catch(() => null)

  if (!res.ok) {
    const d = payload as { message?: string | string[] } | null
    const raw = Array.isArray(d?.message) ? d.message.map(translate).join(' ') : d?.message
    throw new ApiError(res.status, raw ?? 'Ocorreu um erro. Tenta novamente.')
  }
  return payload as T
}
