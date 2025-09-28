import { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/stores/authStore'
import { authManager } from '@/lib/auth-manager'

export function useInitializeAuth() {
  const { loadFromCookies } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        // Carica i dati dai cookie
        loadFromCookies()
        
        // Verifica l'autenticazione con refresh automatico se necessario
        await authManager.checkAuth()
      } catch (_error) {
       
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [loadFromCookies])

  return { isLoading }
} 