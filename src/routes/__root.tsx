import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { useInitializeAuth } from '@/features/auth/hooks/useInitializeAuth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'
import { useScrollToTop } from '@/hooks/use-scroll-to-top'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {
    const { isLoading } = useInitializeAuth()
    useScrollToTop()

    if (isLoading) {
      return (
        <div className='flex h-screen items-center justify-center'>
          <div className='text-center'>
            <LoadingSpinner size='lg' />
          </div>
        </div>
      )
    }

    return (
      <>
        <NavigationProgress />
        <Outlet />
        <Toaster duration={50000} />
        {/* {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )} */}
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
