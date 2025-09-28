import { useEffect, useState } from 'react'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { authManager } from './auth-manager'

/**
 * Hook per proteggere le route che richiedono autenticazione
 */
export function useAuthGuard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { isAuthenticated: storeIsAuthenticated } = useAuthStore()

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)

      try {
        // Verifica l'autenticazione con refresh automatico se necessario
        const authResult = await authManager.checkAuth()
        setIsAuthenticated(authResult)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    // Se già autenticato nello store, verifica se è ancora valido
    if (storeIsAuthenticated()) {
      checkAuth()
    } else {
      setIsLoading(false)
      setIsAuthenticated(false)
    }
  }, [storeIsAuthenticated])

  return { isLoading, isAuthenticated }
}
