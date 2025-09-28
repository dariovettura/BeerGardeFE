import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query'
import { useApiInterceptor } from '@/lib/api-interceptor'
import { useAuthStore } from '@/features/auth/stores/authStore'

/**
 * Hook per chiamate API sicure con gestione automatica del refresh token
 */
export function useSecureQuery<TData>(
  queryKey: string[],
  endpoint: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<TData>>,
    'queryKey' | 'queryFn'
  > & {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    body?: string
  }
) {
  const { request } = useApiInterceptor()
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: [
      ...queryKey,
      accessToken,
      endpoint,
      options?.method,
      options?.body,
    ],
    queryFn: () =>
      request<TData>(endpoint, {
        method: options?.method || 'GET',
        body: options?.body,
      }),
    enabled: !!accessToken && (options?.enabled !== false), // Solo se c'è un token e non è esplicitamente disabilitato
    retry: false, // Disabilita il retry automatico
    ...options,
  })
}

/**
 * Hook per mutazioni API sicure con gestione automatica del refresh token
 */
export function useSecureMutation<TData, TVariables>(
  endpoint: string,
  options?: Omit<
    UseMutationOptions<ApiResponse<TData>, Error, TVariables>,
    'mutationFn'
  >
) {
  const { request } = useApiInterceptor()

  return useMutation({
    mutationFn: (variables: TVariables) =>
      request<TData>(endpoint, {
        method: 'POST',
        body: JSON.stringify(variables),
      }),
    ...options,
  })
}

/**
 * Hook per chiamate API con metodo personalizzato
 */
export function useSecureApiCall<TData>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  options?: Omit<UseQueryOptions<ApiResponse<TData>>, 'queryKey' | 'queryFn'>
) {
  const { request } = useApiInterceptor()
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: [endpoint, method, accessToken],
    queryFn: () => request<TData>(endpoint, { method }),
    enabled: !!accessToken,
    ...options,
  })
}

/**
 * Hook per mutazioni con metodo personalizzato
 */
export function useSecureApiMutation<TData, TVariables>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST',
  options?: Omit<
    UseMutationOptions<ApiResponse<TData>, Error, TVariables>,
    'mutationFn'
  >
) {
  const { request } = useApiInterceptor()

  return useMutation({
    mutationFn: (variables: TVariables) =>
      request<TData>(endpoint, {
        method,
        body: JSON.stringify(variables),
      }),
    ...options,
  })
}

// Tipo per le risposte API
interface ApiResponse<T> {
  status: string
  code: number
  message: string
  data: T
}
