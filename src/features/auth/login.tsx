import { LoginForm } from './components/login-form'

export default function Login() {
  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div 
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{ backgroundImage: 'url(/images/bg-code.jpg)' }}
        />
        <div className='absolute inset-0 bg-brand-blue/60 ' />
        
        {/* Logo in top left */}
        <div className='relative z-20 flex items-center mb-8'>
          <img
            src='/images/logobeer.png'
            className='h-12 w-auto'
            alt='Beer Garden Logo'
          />
        </div>

   
      </div>
      <div className='lg:p-8'>
        {/* Logo for mobile - positioned at top left of viewport */}
        <div className='absolute top-4 left-4 lg:hidden z-10'>
          <div className='bg-brand-blue p-3 rounded-lg'>
            <img
              src='/images/logobeer.png'
              className='h-10 w-auto'
              alt='Beer Garden Logo'
            />
          </div>
        </div>
        
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-left'>
            <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
            <p className='text-muted-foreground text-sm'>
              Inserisci il tuo username e password <br />
              per accedere al tuo account
            </p>
          </div>
          <LoginForm />
          <p className='text-muted-foreground px-8 text-center text-sm'>
            Cliccando su Accedi, accetti i nostri{' '}
            <a
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Termini di Servizio
            </a>{' '}
            e la{' '}
            <a
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
