import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useApiInterceptor } from '@/lib/api-interceptor'
import { extractErrorMessage } from '@/utils/handle-server-error'

interface LoginData {
  email: string
  password: string
}

export const useAuthWithRetrieve = () => {
  const navigate = useNavigate()
  const { login } = useApiInterceptor()
  const [isSubmitting, setIsSubmitting] = useState(false)




  const performLogin = async (data: LoginData) => {
    setIsSubmitting(true)

    
    try {
      // 1. Esegui il login
      await login(data.email, data.password)

    


      // 4. Reindirizza alla dashboard
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