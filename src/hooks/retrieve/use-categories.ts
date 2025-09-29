import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  Category, 
  CreateCategoryParams, 
  UpdateCategoryParams, 
  CategoryFilters 
} from '@/types/category'
import { useSecureQuery, useSecureMutation, useSecureItem } from '@/hooks/use-secure-api'
import { extractErrorMessage } from '@/utils/handle-server-error'

// Hook per ottenere tutte le categorie
export const useCategories = (filters: CategoryFilters = {}) => {
  const queryFilters: Record<string, any> = {}
  
  if (filters.tipology) {
    queryFilters.tipology = filters.tipology
  }
  
  return useSecureQuery<Category>(
    ['categories', JSON.stringify(filters)],
    'categories',
    {
      filters: queryFilters,
      order: `${filters.sort_by || 'sort_order'}.${filters.sort_order || 'asc'}`,
    }
  )
}

// Hook per ottenere una categoria specifica
export const useCategory = (id: string) => {
  return useSecureItem<Category>(
    ['category'],
    'categories',
    id
  )
}

// Hook per creare una nuova categoria
export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  
  return useSecureMutation<Category, CreateCategoryParams>(
    'categories',
    'create',
    {
      onSuccess: () => {
        // Invalida tutte le query delle categorie
        queryClient.invalidateQueries({
          queryKey: ['categories'],
        })
        
        toast.success('Categoria creata con successo', {
          duration: 3000,
        })
      },
      onError: (error) => {
        console.error('Errore durante la creazione della categoria:', error)
        const errorMessage = extractErrorMessage(error)
        toast.error(errorMessage, {
          duration: 3000,
        })
      },
    }
  )
}

// Hook per aggiornare una categoria
export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  
  return useSecureMutation<Category, UpdateCategoryParams>(
    'categories',
    'update',
    {
      onSuccess: (data) => {
        // Invalida tutte le query delle categorie
        queryClient.invalidateQueries({
          queryKey: ['categories'],
        })
        
        // Invalida la query specifica della categoria
        queryClient.invalidateQueries({
          queryKey: ['category', data.id],
        })
        
        toast.success('Categoria aggiornata con successo', {
          duration: 3000,
        })
      },
      onError: (error) => {
        console.error('Errore durante l\'aggiornamento della categoria:', error)
        const errorMessage = extractErrorMessage(error)
        toast.error(errorMessage, {
          duration: 3000,
        })
      },
    }
  )
}

// Hook per eliminare una categoria
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  
  return useSecureMutation<void, string>(
    'categories',
    'delete',
    {
      onSuccess: () => {
        // Invalida tutte le query delle categorie
        queryClient.invalidateQueries({
          queryKey: ['categories'],
        })
        
        toast.success('Categoria eliminata con successo', {
          duration: 3000,
        })
      },
      onError: (error) => {
        console.error('Errore durante l\'eliminazione della categoria:', error)
        const errorMessage = extractErrorMessage(error)
        toast.error(errorMessage, {
          duration: 3000,
        })
      },
    }
  )
}
