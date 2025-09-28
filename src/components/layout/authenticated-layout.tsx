import { Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/features/auth/stores/authStore'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import SkipToMain from '@/components/skip-to-main'

// Import rimossi - non utilizzati


interface Props {
  children?: React.ReactNode
}




export function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = true // Default aperto, gestito internamente dal SidebarProvider
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  // Gestisci la navigazione al login in useEffect per evitare aggiornamenti durante il rendering
  useEffect(() => {
   
    if (!isAuthenticated()) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, navigate])

  // Se non autenticato, mostra null (la navigazione sarà gestita da useEffect)
  if (!isAuthenticated()) {
    return null
  }

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          style={{
            height: '100%',
          }}
          id='content'
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'sm:transition-[width] sm:duration-200 sm:ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
          )}
        >
          <Header fixed>
            <Search />
            <div className='ml-auto flex items-center space-x-4'>
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>
          {children ? children : <Outlet />}
        </div>
  
      </SidebarProvider>
    </SearchProvider>
  )
}
