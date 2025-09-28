import { Main } from '@/components/layout/main'

interface LoadingStateProps {
  skeleton: React.ReactNode
}

export function LoadingState({ skeleton }: LoadingStateProps) {
  return <>{skeleton}</>
}

interface ErrorStateProps {
  title?: string
  message?: string
}

export function ErrorState({ 
  title = "Errore nel caricamento", 
  message = "Si è verificato un errore durante il caricamento dei dati." 
}: ErrorStateProps) {
  return (
    <>
      <Main>
        <div className='flex flex-col items-center justify-center space-y-4 py-8'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-destructive'>
              {title}
            </h2>
            <p className='text-muted-foreground'>
              {message}
            </p>
          </div>
        </div>
      </Main>
    </>
  )
}

interface NoDataStateProps {
  entityName: string
  entityType: string
}

export function NoDataState({ 
  entityName, 
  entityType 
}: NoDataStateProps) {
  return (
    <>
      <Main>
        <div className='flex flex-col items-center justify-center space-y-4 py-8'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>
              {entityName} non trovato
            </h2>
            <p className='text-muted-foreground'>
              {entityType} richiesto non è stato trovato.
            </p>
          </div>
        </div>
      </Main>
    </>
  )
}

// Hook per gestire gli stati in modo centralizzato
interface UseStateHandlersProps {
  isLoading: boolean
  error: any
  data: any
  skeleton: React.ReactNode
  entityName: string
  entityType: string
  errorTitle?: string
  errorMessage?: string
}

export function useStateHandlers({
  isLoading,
  error,
  data,
  skeleton,
  entityName,
  entityType,
  errorTitle,
  errorMessage
}: UseStateHandlersProps) {
  if (isLoading) {
    return <LoadingState skeleton={skeleton} />
  }

  if (error) {
    return (
      <ErrorState 
        title={errorTitle}
        message={errorMessage}
      />
    )
  }

  if (!data) {
    return (
      <NoDataState 
        entityName={entityName}
        entityType={entityType}
      />
    )
  }

  return null // Nessun stato speciale, procedi con il rendering normale
}
