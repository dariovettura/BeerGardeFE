import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { 
  SUPABASE_CONFIG, 
  getSupabaseUrl, 
  getSupabaseHeaders, 
  handleSupabaseResponse 
} from '@/lib/supabase-config'

/**
 * Hook per chiamate API sicure con Supabase
 */
export function useSecureQuery<TData>(
  queryKey: string[],
  table: string,
  options?: Omit<
    UseQueryOptions<TData[]>,
    'queryKey' | 'queryFn'
  > & {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    body?: string
    filters?: Record<string, any>
    select?: string
    order?: string
    limit?: number
    offset?: number
  }
) {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: [
      ...queryKey,
      accessToken,
      table,
      options?.method,
      options?.body,
      options?.filters,
      options?.select,
      options?.order,
      options?.limit,
      options?.offset,
    ],
    queryFn: async (): Promise<TData[]> => {
      const url = new URL(getSupabaseUrl(SUPABASE_CONFIG.endpoints.rest, table))
      
      // Aggiungi filtri come query parameters
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, `eq.${value}`)
          }
        })
      }
      
      // Aggiungi select
      if (options?.select) {
        url.searchParams.append('select', options.select)
      }
      
      // Aggiungi ordinamento
      if (options?.order) {
        url.searchParams.append('order', options.order)
      }
      
      // Aggiungi limit
      if (options?.limit) {
        url.searchParams.append('limit', options.limit.toString())
      }
      
      // Aggiungi offset
      if (options?.offset) {
        url.searchParams.append('offset', options.offset.toString())
      }
      
      const response = await fetch(url.toString(), {
        method: options?.method || 'GET',
        headers: getSupabaseHeaders(accessToken || undefined),
        body: options?.body,
      })
      
      return handleSupabaseResponse<TData[]>(response)
    },
    enabled: !!accessToken && (options?.enabled !== false),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minuti
    ...options,
  })
}

/**
 * Hook per mutazioni API sicure con Supabase
 */
export function useSecureMutation<TData, TVariables>(
  table: string,
  operation: 'create' | 'update' | 'delete',
  options?: Omit<
    UseMutationOptions<TData, Error, TVariables>,
    'mutationFn'
  >
) {
  const { accessToken } = useAuthStore()

  return useMutation({
    mutationFn: async (variables: TVariables): Promise<TData> => {
      const url = getSupabaseUrl(SUPABASE_CONFIG.endpoints.rest, table)
      
      let method: string
      let requestUrl: string
      let body: any
      
      switch (operation) {
        case 'create':
          method = 'POST'
          requestUrl = url
          body = variables
          break
        case 'update':
          method = 'PATCH'
          requestUrl = `${url}?id=eq.${(variables as any).id}`
          body = { ...variables }
          delete (body as any).id
          break
        case 'delete':
          method = 'DELETE'
          requestUrl = `${url}?id=eq.${variables as string}`
          body = undefined
          break
        default:
          throw new Error(`Operazione non supportata: ${operation}`)
      }
      
      const response = await fetch(requestUrl, {
        method,
        headers: getSupabaseHeaders(accessToken || undefined),
        body: body ? JSON.stringify(body) : undefined,
      })
      
      if (operation === 'delete') {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            error: 'Delete Error',
            error_description: 'Errore durante l\'eliminazione'
          }))
          
          throw new Error(errorData.error_description || errorData.error || 'Eliminazione fallita')
        }
        return {} as TData
      }
      
      return handleSupabaseResponse<TData>(response)
    },
    ...options,
  })
}

/**
 * Hook per ottenere un singolo elemento da Supabase
 */
export function useSecureItem<TData>(
  queryKey: string[],
  table: string,
  id: string,
  options?: Omit<
    UseQueryOptions<TData>,
    'queryKey' | 'queryFn'
  > & {
    select?: string
  }
) {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: [...queryKey, id, accessToken],
    queryFn: async (): Promise<TData> => {
      const url = getSupabaseUrl(SUPABASE_CONFIG.endpoints.rest, table)
      const select = options?.select || '*'
      
      const response = await fetch(`${url}?id=eq.${id}&select=${select}`, {
        method: 'GET',
        headers: getSupabaseHeaders(accessToken || undefined),
      })
      
      const items = await handleSupabaseResponse<TData[]>(response)
      
      if (items.length === 0) {
        throw new Error('Elemento non trovato')
      }
      
      return items[0]
    },
    enabled: !!accessToken && !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
