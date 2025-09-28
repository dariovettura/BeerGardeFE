


// Aggiornato per essere compatibile con l'API OAuth2 e la tabella



export interface ApiError {
  error: string
  message?: string
  status?: number
}

// Generic API Response
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  status: number
}


// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationResponse {
  total: number
  page: number
  limit: number
  totalPages: number
}
