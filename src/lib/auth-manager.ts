import { isTokenExpired } from '@/lib/cookie-utils'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { supabaseAuthService } from '@/lib/supabase-auth'

/**
 * Manager centralizzato per la gestione dell'autenticazione
 */
class AuthManager {
  private isRefreshing = false
  private refreshPromise: Promise<boolean> | null = null

  /**
   * Verifica se l'utente è autenticato, con refresh automatico se necessario
   */
  async checkAuth(): Promise<boolean> {
    const authStore = useAuthStore.getState()

    // Se già autenticato nello store, verifica se il token è ancora valido
    if (authStore.isAuthenticated()) {
      const tokenExpiration = authStore.getTokenExpiration()
      if (tokenExpiration && !isTokenExpired(tokenExpiration)) {
        return true
      }
    }

    // Prova a caricare i dati dai cookie
    authStore.loadFromCookies()

    // Ricontrolla dopo aver caricato
    if (authStore.isAuthenticated()) {
      const tokenExpiration = authStore.getTokenExpiration()
      if (tokenExpiration && !isTokenExpired(tokenExpiration)) {
        return true
      }
    }

    // Prova sempre il refresh, anche se non c'è un access token
    // Il refresh token HttpOnly potrebbe permettere di ottenere un nuovo access token

    return await this.refreshToken()
  }

  /**
   * Esegue il refresh del token
   */
  private async refreshToken(): Promise<boolean> {
    // Se già in corso di refresh, aspetta
    if (this.isRefreshing && this.refreshPromise) {
      return await this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.performRefresh()

    try {
      const result = await this.refreshPromise
      return result
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  /**
   * Esegue effettivamente il refresh
   */
  private async performRefresh(): Promise<boolean> {
    try {
      const authStore = useAuthStore.getState()
      const refreshToken = authStore.getRefreshToken()

      if (!refreshToken) {
        // Se non c'è refresh token, pulisci lo stato auth
        authStore.clearAuth()
        return false
      }

      // Usa Supabase per il refresh
      const { userInfo, refreshToken: newRefreshToken } = await supabaseAuthService.refreshTokenWithNewRefresh(refreshToken)
      
      // Aggiorna lo store con i nuovi dati e il nuovo refresh token
      authStore.setAuth(userInfo, newRefreshToken)
      return true
    } catch (error: unknown) {
      // Se errore 401/403, pulisci lo stato auth per evitare loop
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error.code === 401 ||
          error.code === 403 ||
          (error as { status?: number }).status === 401 ||
          (error as { status?: number }).status === 403)
      ) {
        const authStore = useAuthStore.getState()
        authStore.clearAuth()
      }
      // eslint-disable-next-line no-console
      console.error('Token refresh failed:', error)
      return false
    }
  }

  /**
   * Forza il logout
   */
  async logout(): Promise<void> {
    const authStore = useAuthStore.getState()

    try {
      // Chiamata a Supabase per il logout
      if (authStore.accessToken) {
        await supabaseAuthService.logout(authStore.accessToken)
      }
    } catch (error) {
      // Logout API call failed - this is expected in some cases
      // eslint-disable-next-line no-console
      console.warn('Logout API call failed:', error)
    } finally {
      // Pulisci sempre lo stato locale e i cookie
      authStore.clearAuth()

      // Forza la pulizia dei cookie anche lato client
      document.cookie =
        'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie =
        'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie =
        'auth_user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

      // Redirect immediato
      window.location.href = '/login'
    }
  }
}

// Istanza singleton
export const authManager = new AuthManager()
