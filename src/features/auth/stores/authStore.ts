import { UserInfo } from '@/types/user'
import { create } from 'zustand'
import { authManager } from '@/lib/auth-manager'
import {
  calculateExpirationTime,
  isTokenExpired,
  setAccessTokenCookie,
  getAccessTokenCookie,
  setRefreshTokenCookie,
  getRefreshTokenCookie,
  setUserDataCookie,
  getUserDataCookie,
  clearAllAuthCookies,
} from '@/lib/cookie-utils'

interface AuthState {
  // Access token dai cookie
  accessToken: string | null
  accessTokenExp: number | null

  // Refresh token dai cookie
  refreshToken: string | null

  // User info dai cookie
  user: UserInfo | null

  // Azioni
  setAuth: (userData: UserInfo, refreshToken?: string) => void
  setAccessToken: (token: string, expiresInMinutes: number) => void
  setRefreshToken: (token: string, expiresInDays?: number) => void
  clearAuth: () => void
  logout: () => Promise<void>
  isAuthenticated: () => boolean
  isTokenExpired: () => boolean
  loadFromCookies: () => void
  getTokenExpiration: () => number | null
  getRefreshToken: () => string | null
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  accessToken: null,
  accessTokenExp: null,
  refreshToken: null,
  user: null,

  setAuth: (userData: UserInfo, refreshToken?: string) => {
    const accessTokenExp = calculateExpirationTime(userData.iExpAT)

    // Salva access token nei cookie
    setAccessTokenCookie(userData.token, userData.iExpAT)

    // Salva refresh token nei cookie se fornito
    if (refreshToken) {
      setRefreshTokenCookie(refreshToken, 7) // 7 giorni
    }

    // Salva dati utente nei cookie
    setUserDataCookie(userData as unknown as Record<string, unknown>, userData.iExpAT)

    set({
      accessToken: userData.token,
      accessTokenExp,
      refreshToken: refreshToken || null,
      user: userData,
    })
  },

  setAccessToken: (token: string, expiresInMinutes: number) => {
    const accessTokenExp = calculateExpirationTime(expiresInMinutes)

    // Salva access token nei cookie
    setAccessTokenCookie(token, expiresInMinutes)

    set({
      accessToken: token,
      accessTokenExp,
    })
  },

  setRefreshToken: (token: string, expiresInDays: number = 7) => {
    // Salva refresh token nei cookie
    setRefreshTokenCookie(token, expiresInDays)

    set({
      refreshToken: token,
    })
  },

  clearAuth: () => {
    // Rimuovi tutti i cookie di autenticazione
    clearAllAuthCookies()

    set({
      accessToken: null,
      accessTokenExp: null,
      refreshToken: null,
      user: null,
    })
  },

  logout: async () => {
    const { clearAuth } = get()
    await authManager.logout()
    clearAuth()
  },

  isAuthenticated: () => {
    const { accessToken, accessTokenExp } = get()
    return !!(accessToken && accessTokenExp && !isTokenExpired(accessTokenExp))
  },

  isTokenExpired: () => {
    const { accessTokenExp } = get()
    return !!(accessTokenExp && isTokenExpired(accessTokenExp))
  },

  loadFromCookies: () => {
    const accessToken = getAccessTokenCookie()
    const refreshToken = getRefreshTokenCookie()
    const userData = getUserDataCookie()

    if (accessToken && userData) {
      const iExpAT = typeof userData.iExpAT === 'number' ? userData.iExpAT : 60
      const accessTokenExp = calculateExpirationTime(iExpAT)

      set({
        accessToken,
        accessTokenExp,
        refreshToken,
        user: userData as unknown as UserInfo,
      })
    } else if (refreshToken) {
      // Se c'è solo il refresh token, prova a fare il refresh
      set({
        refreshToken,
      })
    }
  },

  getTokenExpiration: () => {
    const { accessTokenExp } = get()
    return accessTokenExp
  },

  getRefreshToken: () => {
    const { refreshToken } = get()
    return refreshToken
  },
}))

// Helper hook to access auth state
export const useAuth = () => useAuthStore((state) => state)
