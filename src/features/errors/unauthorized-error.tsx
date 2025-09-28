import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function UnauthorisedError() {
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
        <h1 className='text-[7rem] leading-tight font-bold'>401</h1>
        <span className='font-medium'>Unauthorized Access</span>
        <p className='text-muted-foreground text-center'>
          Please log in with the appropriate credentials <br /> to access this
          resource.
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
