import { createFileRoute, redirect } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { authManager } from '@/lib/auth-manager'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    // Usa il manager centralizzato per verificare l'autenticazione
    const isAuthenticated = await authManager.checkAuth()

    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  ),
})
