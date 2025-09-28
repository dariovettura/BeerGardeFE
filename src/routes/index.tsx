import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { authManager } from '@/lib/auth-manager'

export const Route = createFileRoute('/')({
  validateSearch: z.object({}),
  beforeLoad: async () => {
    // Usa il manager centralizzato per verificare l'autenticazione
    const isAuthenticated = await authManager.checkAuth()

    if (isAuthenticated) {
      throw redirect({ to: '/dashboard/overview' })
    }

    // Se non autenticato, vai al login
    throw redirect({ to: '/login' })
  },
})
