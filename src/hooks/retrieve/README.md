# Hook per le Categorie - BeerFE

## Panoramica

Questo modulo contiene gli hook per gestire le operazioni CRUD delle categorie utilizzando Supabase.

## Hook Disponibili

### `useCategories(filters?)`
Recupera tutte le categorie con filtri opzionali.

```typescript
import { useCategories } from '@/hooks/retrieve/use-categories'

// Recupera tutte le categorie
const { data: categories, isLoading, error } = useCategories()

// Con filtri
const { data: categories } = useCategories({
  tipology: 'prodotto semplice',
  search: 'pizza',
  sort_by: 'name',
  sort_order: 'asc'
})
```

### `useCategory(id)`
Recupera una categoria specifica per ID.

```typescript
import { useCategory } from '@/hooks/retrieve/use-categories'

const { data: category, isLoading, error } = useCategory('category-id')
```

### `useCreateCategory()`
Crea una nuova categoria.

```typescript
import { useCreateCategory } from '@/hooks/retrieve/use-categories'

const createCategory = useCreateCategory()

const handleCreate = async () => {
  try {
    await createCategory.mutateAsync({
      name: 'Pizze',
      description: 'Categoria per le pizze',
      tipology: 'prodotto semplice',
      sort_order: 1
    })
  } catch (error) {
    console.error('Errore:', error)
  }
}
```

### `useUpdateCategory()`
Aggiorna una categoria esistente.

```typescript
import { useUpdateCategory } from '@/hooks/retrieve/use-categories'

const updateCategory = useUpdateCategory()

const handleUpdate = async () => {
  try {
    await updateCategory.mutateAsync({
      id: 'category-id',
      name: 'Pizze Speciali',
      description: 'Categoria aggiornata'
    })
  } catch (error) {
    console.error('Errore:', error)
  }
}
```

### `useDeleteCategory()`
Elimina una categoria.

```typescript
import { useDeleteCategory } from '@/hooks/retrieve/use-categories'

const deleteCategory = useDeleteCategory()

const handleDelete = async (categoryId: string) => {
  try {
    await deleteCategory.mutateAsync(categoryId)
  } catch (error) {
    console.error('Errore:', error)
  }
}
```

## Tipi

### `Category`
```typescript
interface Category {
  id: string
  name: string
  description?: string
  sort_order: number
  tipology: CategoryTipology
  image?: string
  created_at: string
  updated_at: string
}
```

### `CategoryTipology`
```typescript
type CategoryTipology = 
  | 'prodotto semplice'
  | 'prodotto semplice con variabile'
  | 'gruppo di prodotti'
```

### `CategoryFilters`
```typescript
interface CategoryFilters {
  tipology?: CategoryTipology
  search?: string
  sort_by?: 'name' | 'sort_order' | 'created_at'
  sort_order?: 'asc' | 'desc'
}
```

## Configurazione

Gli hook utilizzano la configurazione centralizzata di Supabase definita in `@/lib/supabase-config.ts`.

## Gestione Errori

Tutti gli hook includono gestione automatica degli errori con toast notifications e logging.

## Cache e Invalidation

Gli hook utilizzano React Query per la gestione della cache e invalidazione automatica delle query correlate.
