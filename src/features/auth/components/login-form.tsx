import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthWithRetrieve } from '@/hooks/use-auth-with-retrieve'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'

const loginSchema = z.object({
  email: z.string().email('Email non valida').min(1, 'Email richiesta'),
  password: z.string().min(1, 'Password richiesta'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { performLogin, isSubmitting } = useAuthWithRetrieve()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await performLogin(data)
      // Non resettare il form in caso di errore per permettere all'utente di correggere
    } catch (_error) {
      // Gli errori sono già gestiti nel hook
    }
  }

  const isLoading = isSubmitting

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          placeholder='Inserisci la tua email'
          {...register('email')}
          disabled={isLoading}
        />
        {errors.email && (
          <p className='text-destructive text-sm'>{errors.email.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <PasswordInput
          id='password'
          placeholder='Inserisci la tua password'
          {...register('password')}
          disabled={isLoading}
        />
        {errors.password && (
          <p className='text-destructive text-sm'>
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? (
          <div className='flex items-center space-x-2'>
            <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
            <span>Accesso in corso...</span>
          </div>
        ) : (
          'Accedi'
        )}
      </Button>

    </form>
  )
}
