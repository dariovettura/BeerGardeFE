import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean
}

export default function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
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
    <div className={cn('h-svh w-full', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        {!minimal && (
          <h1 className='text-[7rem] leading-tight font-bold'>500</h1>
        )}
        <span className='font-medium'>Oops! Something went wrong {`:')`}</span>
        <p className='text-muted-foreground text-center'>
          We apologize for the inconvenience. <br /> Please try again later.
        </p>
        {!minimal && (
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
        )}
      </div>
    </div>
  )
}
