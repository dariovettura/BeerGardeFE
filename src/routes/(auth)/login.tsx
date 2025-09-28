import { createFileRoute, redirect } from '@tanstack/react-router'
import { authManager } from '@/lib/auth-manager'
import Login from '@/features/auth/login'

export const Route = createFileRoute('/(auth)/login')({
  beforeLoad: async () => {
    // Usa il manager centralizzato per verificare l'autenticazione
    const isAuthenticated = await authManager.checkAuth()

    if (isAuthenticated) {
      throw redirect({ to: '/dashboard/overview' })
    }
  },
  component: Login,
})
