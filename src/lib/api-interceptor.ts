import { toast } from 'sonner'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { extractErrorMessage } from '@/utils/handle-server-error'
import { supabaseAuthService } from '@/lib/supabase-auth'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://fzlgadmbipqrkqbjjxyv.supabase.co'

function joinUrl(base: string, path: string) {
  if (!path) return base
  if (base.endsWith('/') && path.startsWith('/')) {
    return base + path.slice(1)
  }
  if (!base.endsWith('/') && !path.startsWith('/')) {
    return base + '/' + path
  }
  return base + path
}

interface ApiResponse<T> {
  status: string
  code: number
  message: string
  data: T
}


/**
 * Interceptor per le chiamate API con gestione automatica del refresh token
 */
class ApiInterceptor {
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (value: ApiResponse<unknown>) => void
    reject: (error: unknown) => void
  }> = []

  private processQueue(error: unknown, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve({
          status: 'success',
          code: 200,
          message: 'Success',
          data: token,
        } as ApiResponse<unknown>)
      }
    })
    this.failedQueue = []
  }

  /**
   * Esegue una chiamata API con gestione automatica del refresh
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const authStore = useAuthStore.getState()

    // Aggiungi headers di default
    const headers = new Headers(options.headers)

    if (authStore.accessToken) {
      headers.set('Authorization', `Bearer ${authStore.accessToken}`)
    }

    headers.set('Content-Type', 'application/json')

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // IMPORTANTE: invia automaticamente i cookie
    }

    const response = await fetch(joinUrl(API_BASE_URL, endpoint), config)

    // Non intercettare le chiamate di refresh per evitare conflitti con auth-manager
    if (response.status === 401 && !endpoint.includes('/refresh')) {
      // Token scaduto, prova a fare refresh
      return this.handleTokenRefresh<T>(endpoint, config)
    }

    if (!response.ok) {
      throw await response.json()
    }

    return await response.json()
  }

  /**
   * Gestisce il refresh del token quando scade
   */
  private async handleTokenRefresh<T>(
    endpoint: string,
    originalConfig: RequestInit
  ): Promise<ApiResponse<T>> {
    if (this.isRefreshing) {
      // Se già in corso di refresh, metti in coda
      return new Promise<ApiResponse<T>>((resolve, reject) => {
        this.failedQueue.push({
          resolve: resolve as (value: ApiResponse<unknown>) => void,
          reject,
        })
      })
    }

    this.isRefreshing = true

    try {
      const authStore = useAuthStore.getState()
      const refreshToken = authStore.getRefreshToken()

      if (!refreshToken) {
        // Se non c'è refresh token, fai logout e reindirizza
        authStore.clearAuth()

        const errorMessage = extractErrorMessage({ status: 'error', message: 'Sessione scaduta. Effettua nuovamente il login.' })
        toast.error(errorMessage, {
          duration: 3000,
        })

        window.location.href = '/login'

        throw new Error('No refresh token available')
      }

      // Usa Supabase per il refresh
      const { userInfo, refreshToken: newRefreshToken } = await supabaseAuthService.refreshTokenWithNewRefresh(refreshToken)
      
      // Aggiorna lo store con i nuovi dati e il nuovo refresh token
      authStore.setAuth(userInfo, newRefreshToken)

      // Riprova la chiamata originale con il nuovo token
      const headers = new Headers(originalConfig.headers)
      headers.set('Authorization', `Bearer ${userInfo.token}`)
      const newConfig = {
        ...originalConfig,
        headers,
      }
      const response = await fetch(joinUrl(API_BASE_URL, endpoint), newConfig)
      const responseData = await response.json()
      // Se la risposta contiene un errore, lancialo per essere gestito dal chiamante
      if (responseData.status === 'error') {
        throw responseData
      }

      return responseData
    } catch (error) {
      this.processQueue(error, null)
      throw error
    } finally {
      this.isRefreshing = false
    }
  }

  /**
   * Login con gestione automatica dei cookie usando Supabase
   */
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<unknown>> {
    try {
      // Usa Supabase per il login
      const { userInfo, refreshToken } = await supabaseAuthService.loginWithRefreshToken(email, password)
      
      // Salva i dati di autenticazione nello store con refresh token
      const authStore = useAuthStore.getState()
      authStore.setAuth(userInfo, refreshToken)

      toast.success('Login effettuato con successo', {
        duration: 3000,
      })

      return {
        status: 'success',
        code: 200,
        message: 'Login successful',
        data: userInfo
      }
    } catch (error: unknown) {
      const errorData = {
        status: 'error',
        code: 401,
        message: error instanceof Error ? error.message : 'Login failed'
      }
      throw errorData // Lancia l'oggetto completo per essere gestito dalla funzione extractErrorMessage
    }
  }

  /**
   * Logout con pulizia completa usando Supabase
   */
  async logout(): Promise<void> {
    try {
      const authStore = useAuthStore.getState()

      if (authStore.accessToken) {
        // Chiamata a Supabase per il logout
        await supabaseAuthService.logout(authStore.accessToken)
      }
    } catch (error) {
      // Logout API call failed - this is expected in some cases
      // eslint-disable-next-line no-console
      console.warn('Logout API call failed:', error)
    } finally {
      // Pulisci sempre lo stato locale
      const authStore = useAuthStore.getState()
      authStore.clearAuth()

      toast.success('Logout effettuato', {
        duration: 3000,
      })
    }
  }
}

// Istanza singleton dell'interceptor
export const apiInterceptor = new ApiInterceptor()

/**
 * Hook per usare l'interceptor nelle chiamate API
 */
export const useApiInterceptor = () => {
  return {
    request: apiInterceptor.request.bind(apiInterceptor),
    login: apiInterceptor.login.bind(apiInterceptor),
    logout: apiInterceptor.logout.bind(apiInterceptor),
  }
}
