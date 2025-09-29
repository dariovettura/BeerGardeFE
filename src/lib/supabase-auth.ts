import { 
  SupabaseLoginResponse, 
  SupabaseUserResponse, 
  SupabaseError
} from '@/types/supabase'
import { UserInfo } from '@/types/user'

import { SUPABASE_CONFIG } from './supabase-config'

// Configurazione Supabase (ora centralizzata)
const SUPABASE_URL = SUPABASE_CONFIG.url
const SUPABASE_ANON_KEY = SUPABASE_CONFIG.anonKey

/**
 * Converte la risposta di Supabase nel formato UserInfo esistente
 */
function convertSupabaseToUserInfo(supabaseResponse: SupabaseLoginResponse): UserInfo {
  const { user, access_token, expires_in } = supabaseResponse
  
  return {
    token: access_token,
    iExpAT: Math.floor(expires_in / 60), // Converte secondi in minuti
    iExpRT: 7 * 24 * 60, // 7 giorni in minuti per refresh token
    userInfo: {
      fiUserId: parseInt(user.id.split('-')[0], 16) || 1, // Genera un ID numerico dall'UUID
      fsCognome: user.user_metadata.full_name?.split(' ').slice(1).join(' ') || '',
      fsNome: user.user_metadata.full_name?.split(' ')[0] || '',
      fsMail: user.email,
     
    },
    
  }
}

/**
 * Estrae il refresh token dalla risposta di Supabase
 */
function extractRefreshToken(supabaseResponse: SupabaseLoginResponse): string {
  return supabaseResponse.refresh_token
}

/**
 * Servizio di autenticazione Supabase
 */
class SupabaseAuthService {
  
  /**
   * Effettua il login con Supabase e restituisce sia UserInfo che refresh token
   */
  async loginWithRefreshToken(email: string, password: string): Promise<{ userInfo: UserInfo; refreshToken: string }> {
    const response = await fetch(`${SUPABASE_URL}${SUPABASE_CONFIG.endpoints.auth}/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    if (!response.ok) {
      const errorData: SupabaseError = await response.json().catch(() => ({
        error: 'Network Error',
        error_description: 'Errore di rete durante il login'
      }))
      
      throw new Error(errorData.error_description || errorData.error || 'Login fallito')
    }

    const loginData: SupabaseLoginResponse = await response.json()
    return {
      userInfo: convertSupabaseToUserInfo(loginData),
      refreshToken: extractRefreshToken(loginData)
    }
  }

  /**
   * Effettua il login con Supabase (metodo legacy per compatibilità)
   */
  async login(email: string, password: string): Promise<UserInfo> {
    const { userInfo } = await this.loginWithRefreshToken(email, password)
    return userInfo
  }

  /**
   * Ottiene il refresh token dal login (metodo separato per compatibilità)
   */
  async getRefreshTokenFromLogin(email: string, password: string): Promise<string> {
    const { refreshToken } = await this.loginWithRefreshToken(email, password)
    return refreshToken
  }

  /**
   * Effettua il logout
   */
  async logout(accessToken: string): Promise<void> {
    try {
      const response = await fetch(`${SUPABASE_URL}${SUPABASE_CONFIG.endpoints.auth}/logout`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        // eslint-disable-next-line no-console
        console.warn('Logout API call failed, but proceeding with local cleanup')
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Logout API call failed:', error)
    }
  }

  /**
   * Verifica l'utente corrente
   */
  async getCurrentUser(accessToken: string): Promise<SupabaseUserResponse | null> {
    try {
      const response = await fetch(`${SUPABASE_URL}${SUPABASE_CONFIG.endpoints.auth}/user`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        return null
      }

      return await response.json()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error getting current user:', error)
      return null
    }
  }

  /**
   * Refresh del token
   */
  async refreshToken(refreshToken: string): Promise<UserInfo> {
    const response = await fetch(`${SUPABASE_URL}${SUPABASE_CONFIG.endpoints.auth}/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        refresh_token: refreshToken
      })
    })

    if (!response.ok) {
      const errorData: SupabaseError = await response.json().catch(() => ({
        error: 'Refresh Error',
        error_description: 'Errore durante il refresh del token'
      }))
      
      throw new Error(errorData.error_description || errorData.error || 'Refresh token fallito')
    }

    const refreshData: SupabaseLoginResponse = await response.json()
    return convertSupabaseToUserInfo(refreshData)
  }

  /**
   * Refresh del token con nuovo refresh token
   */
  async refreshTokenWithNewRefresh(refreshToken: string): Promise<{ userInfo: UserInfo; refreshToken: string }> {
    const response = await fetch(`${SUPABASE_URL}${SUPABASE_CONFIG.endpoints.auth}/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        refresh_token: refreshToken
      })
    })

    if (!response.ok) {
      const errorData: SupabaseError = await response.json().catch(() => ({
        error: 'Refresh Error',
        error_description: 'Errore durante il refresh del token'
      }))
      
      throw new Error(errorData.error_description || errorData.error || 'Refresh token fallito')
    }

    const refreshData: SupabaseLoginResponse = await response.json()
    return {
      userInfo: convertSupabaseToUserInfo(refreshData),
      refreshToken: extractRefreshToken(refreshData)
    }
  }
}

// Istanza singleton
export const supabaseAuthService = new SupabaseAuthService()
