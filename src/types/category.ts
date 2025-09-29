// Tipi per le categorie basati sulla documentazione BeerBE

export type CategoryTipology = 
  | 'prodotto semplice'
  | 'prodotto semplice con variabile'
  | 'gruppo di prodotti'

export interface Category {
  id: string
  name: string
  description?: string
  sort_order: number
  tipology: CategoryTipology
  image?: string
  created_at: string
  updated_at: string
}

export interface CreateCategoryParams {
  name: string
  description?: string
  sort_order?: number
  tipology?: CategoryTipology
  image?: string
}

export interface UpdateCategoryParams {
  id: string
  name?: string
  description?: string
  sort_order?: number
  tipology?: CategoryTipology
  image?: string
}

export interface CategoryFilters {
  tipology?: CategoryTipology
  search?: string
  sort_by?: 'name' | 'sort_order' | 'created_at'
  sort_order?: 'asc' | 'desc'
}

// Tipi per le varianti dei prodotti (per future implementazioni)
export interface ProductVariant {
  size?: string[]
  price?: number[]
  color?: string[]
  [key: string]: any
}

// Tipi per i gruppi di prodotti (per future implementazioni)
export interface ProductGroup {
  [groupName: string]: Array<{
    name: string
    price: number
  }>
}
