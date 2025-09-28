import { useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'


/**
 * Hook per gestire automaticamente il redirect quando data è null
 * Da usare all'interno di altri hook personalizzati
 */
export function useNullRedirectHandler<T>(
  data: { data: T | null } | undefined,
  options: {
    errorMessage?: string
    redirectTo?: string
    goBack?: boolean
  }
) {
  const navigate = useNavigate()
  const router = useRouter()
  const hasRedirected = useRef(false)

  const { errorMessage = 'Dati non trovati', redirectTo, goBack = false } = options

  useEffect(() => {
    // Gestione automatica del caso data null
    if (data && data.data === null && !hasRedirected.current) {
      hasRedirected.current = true
      
      if (goBack) {
        // Vai indietro nella cronologia del browser
        router.history.back()
      } else if (redirectTo) {
        // Vai alla rotta specificata
        navigate({ to: redirectTo })
      }
    }
  }, [data, errorMessage, redirectTo, goBack, navigate, router])
} 