/**
 * Utility per la gestione sicura dei cookie
 */

const ACCESS_TOKEN_COOKIE = 'access_token'
const REFRESH_TOKEN_COOKIE = 'refresh_token'
const USER_DATA_COOKIE = 'auth_user_data'

export interface CookieOptions {
  expires?: Date
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}

/**
 * Ottiene il dominio corrente per i cookie
 */
function getCookieDomain(): string | undefined {
  const hostname = window.location.hostname

  // In sviluppo (localhost), non impostare il dominio
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return undefined
  }

  // In produzione, usa il dominio corrente
  return hostname
}

/**
 * Determina se usare il flag secure
 */
function shouldUseSecure(): boolean {
  // In sviluppo, non usare secure per permettere HTTP
  if (
    window.location.protocol === 'http:' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  ) {
    return false
  }

  // In produzione, sempre secure
  return true
}

/**
 * Imposta un cookie in modo sicuro
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  const { expires, path = '/', domain, secure, sameSite = 'Strict' } = options

  // Usa valori dinamici se non specificati
  const finalDomain = domain ?? getCookieDomain()
  const finalSecure = secure !== undefined ? secure : shouldUseSecure()

  let cookieString = `${name}=${value}`

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`
  }

  if (path) {
    cookieString += `; path=${path}`
  }

  if (finalDomain) {
    cookieString += `; domain=${finalDomain}`
  }

  if (finalSecure) {
    cookieString += '; secure'
  }

  // IMPORTANTE: httpOnly non può essere impostato dal JavaScript del browser
  // Può essere impostato solo dal server tramite Set-Cookie header
  // Per il client, rimuoviamo sempre httpOnly
  // if (httpOnly) {
  //   cookieString += '; httpOnly'
  // }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`
  }

  document.cookie = cookieString
}

/**
 * Ottiene il valore di un cookie
 */
export function getCookie(name: string): string | null {
  const cookies = document.cookie.split(';')

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=')
    if (cookieName === name) {
      return cookieValue
    }
  }

  return null
}

/**
 * Rimuove un cookie
 */
export function removeCookie(name: string, options: CookieOptions = {}): void {
  const { path = '/', domain = '' } = options

  // Imposta la data di scadenza nel passato per rimuovere il cookie
  const expires = new Date(0)

  setCookie(name, '', {
    ...options,
    expires,
    path,
    domain,
  })
}

/**
 * Salva l'access token nei cookie
 */
export function setAccessTokenCookie(
  token: string,
  expiresInMinutes: number
): void {
  const expires = new Date(Date.now() + expiresInMinutes * 60 * 1000)

  setCookie(ACCESS_TOKEN_COOKIE, token, {
    expires,
    path: '/',
    domain: getCookieDomain(),
    secure: shouldUseSecure(),
    sameSite: 'Strict',
  })
}

/**
 * Ottiene l'access token dal cookie
 */
export function getAccessTokenCookie(): string | null {
  return getCookie(ACCESS_TOKEN_COOKIE)
}

/**
 * Rimuove l'access token cookie
 */
export function removeAccessTokenCookie(): void {
  removeCookie(ACCESS_TOKEN_COOKIE, {
    path: '/',
    domain: getCookieDomain(),
  })
}

/**
 * Salva i dati utente nei cookie (senza il token per sicurezza)
 */
export function setUserDataCookie(
  userData: Record<string, unknown> | { [key: string]: unknown },
  expiresInMinutes: number
): void {
  const expires = new Date(Date.now() + expiresInMinutes * 60 * 1000)

  // Rimuovi il token dai dati utente per sicurezza
  const { token, ...userDataWithoutToken } = userData
  const userDataString = JSON.stringify(userDataWithoutToken)

  setCookie(USER_DATA_COOKIE, userDataString, {
    expires,
    path: '/',
    domain: getCookieDomain(),
    secure: shouldUseSecure(),
    sameSite: 'Strict',
  })
}

/**
 * Ottiene i dati utente dal cookie
 */
export function getUserDataCookie(): Record<string, unknown> | { [key: string]: unknown } | null {
  const userDataString = getCookie(USER_DATA_COOKIE)
  if (!userDataString) return null

  try {
    return JSON.parse(userDataString)
  } catch {
    return null
  }
}

/**
 * Rimuove i dati utente cookie
 */
export function removeUserDataCookie(): void {
  removeCookie(USER_DATA_COOKIE, {
    path: '/',
    domain: getCookieDomain(),
  })
}

/**
 * Salva il refresh token nei cookie
 */
export function setRefreshTokenCookie(
  token: string,
  expiresInDays: number = 7
): void {
  const expires = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)

  setCookie(REFRESH_TOKEN_COOKIE, token, {
    expires,
    path: '/',
    domain: getCookieDomain(),
    secure: shouldUseSecure(),
    sameSite: 'Strict',
  })
}

/**
 * Ottiene il refresh token dal cookie
 */
export function getRefreshTokenCookie(): string | null {
  return getCookie(REFRESH_TOKEN_COOKIE)
}

/**
 * Rimuove il refresh token cookie
 */
export function removeRefreshTokenCookie(): void {
  removeCookie(REFRESH_TOKEN_COOKIE, {
    path: '/',
    domain: getCookieDomain(),
  })
}

/**
 * Verifica se un token è scaduto
 */
export function isTokenExpired(expirationTime: number): boolean {
  return Date.now() >= expirationTime
}

/**
 * Calcola il tempo di scadenza in millisecondi
 */
export function calculateExpirationTime(minutes: number): number {
  return Date.now() + minutes * 60 * 1000
}

/**
 * Rimuove tutti i cookie di autenticazione
 */
export function clearAllAuthCookies(): void {
  removeAccessTokenCookie()
  removeRefreshTokenCookie()
  removeUserDataCookie()
}

/**
 * Verifica se l'access token è presente
 */
export function hasAccessToken(): boolean {
  const token = getCookie(ACCESS_TOKEN_COOKIE)
  return !!token
}
