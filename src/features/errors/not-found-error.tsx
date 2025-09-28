import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function NotFoundError() {
  const navigate = useNavigate()

  const goBack = () => {
    // In TanStack Router v1, usiamo navigate con replace per tornare indietro
    if (window.history.length > 1) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      navigate({
        to: '..',
        replace: true,
        params: {} as any,
        search: {} as any,
      })
      /* eslint-enable @typescript-eslint/no-explicit-any */
    } else {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      navigate({
        to: '/',
        params: {} as any,
        search: {} as any,
      })
      /* eslint-enable @typescript-eslint/no-explicit-any */
    }
  }

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>404</h1>
        <span className='font-medium'>Oops! Page Not Found!</span>
        <p className='text-muted-foreground text-center'>
          It seems like the page you're looking for <br />
          does not exist or might have been removed.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={goBack}>
            Go Back
          </Button>
          <Button
            onClick={() => {
              /* eslint-disable @typescript-eslint/no-explicit-any */
              navigate({
                to: '/',
                params: {} as any,
                search: {} as any,
              })
              /* eslint-enable @typescript-eslint/no-explicit-any */
            }}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
