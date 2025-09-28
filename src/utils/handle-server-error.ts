import { AxiosError } from 'axios'
import { toast } from 'sonner'

export function handleServerError(error: unknown) {



  let errMsg = 'Something went wrong!'

  // Gestione errori API con formato specifico
  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    error.status === 'error' &&
    'message' in error
  ) {
    errMsg = error.message as string
  }

  // Gestione errori HTTP 204
  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errMsg = 'Content not found.'
  }

  // Gestione errori Axios
  if (error instanceof AxiosError) {
    errMsg = error.response?.data.title || error.message
  }

  toast.error(errMsg, {
    duration: 3000,
  })
}

/**
 * Estrae il messaggio di errore da una risposta API
 * 
 * Esempio di utilizzo:
 * ```typescript
 * // Input: { status: "error", code: 500, message: "The given key 'fsMail' was not present in the dictionary.", data: null }
 * // Output: "The given key 'fsMail' was not present in the dictionary."
 * 
 * // Input: { status: 204 }
 * // Output: "Content not found."
 * 
 * // Input: new Error("Network error")
 * // Output: "Network error"
 * ```
 */
export function extractErrorMessage(error: unknown): string {
  // Gestione errori API con formato specifico
  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    error.status === 'error' &&
    'message' in error
  ) {
    return error.message as string
  }

  // Gestione errori HTTP 204
  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    return 'Content not found.'
  }

  // Gestione errori Axios
  if (error instanceof AxiosError) {
    return error.response?.data.title || error.message
  }

  // Gestione errori generici
  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong!'
}
