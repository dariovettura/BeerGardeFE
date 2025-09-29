import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { supabaseAuthService } from '@/lib/supabase-auth'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { extractErrorMessage } from '@/utils/handle-server-error'

interface LoginData {
  email: string
  password: string
}

export const useAuthWithRetrieve = () => {
  const navigate = useNavigate()
  const authStore = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const performLogin = async (data: LoginData) => {
    setIsSubmitting(true)
    
    try {
      // 1. Esegui il login con Supabase
      const { userInfo, refreshToken } = await supabaseAuthService.loginWithRefreshToken(data.email, data.password)
      
      // 2. Salva i dati di autenticazione nello store
      authStore.setAuth(userInfo, refreshToken)

      // 3. Reindirizza alla dashboard
      navigate({
        to: '/dashboard/overview',
        params: {} as Record<string, never>,
        search: {} as Record<string, never>,
      })

      toast.success('Login effettuato con successo', {
        duration: 3000,
      })

    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error)
      toast.error(errorMessage, {
        duration: 3000,
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    performLogin,
    isSubmitting,

  }
} 