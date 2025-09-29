// Configurazione centralizzata per Supabase
export const SUPABASE_CONFIG = {
  url: 'https://fzlgadmbipqrkqbjjxyv.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bGdhZG1iaXBxcmtxYmpqeHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4OTI2MzAsImV4cCI6MjA3NDQ2ODYzMH0.7HwLWN4xe6v7Eg5xycJsgFrNfR_HA-E4MdjffmEoQF8',
  tables: {
    categories: 'categories',
    menuItems: 'menu_items',
  },
  endpoints: {
    auth: '/auth/v1',
    rest: '/rest/v1',
  }
} as const

// Helper per costruire URL completi
export const getSupabaseUrl = (endpoint: string, table?: string) => {
  const baseUrl = `${SUPABASE_CONFIG.url}${endpoint}`
  return table ? `${baseUrl}/${table}` : baseUrl
}

// Helper per headers standard
export const getSupabaseHeaders = (accessToken?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_CONFIG.anonKey,
  }
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }
  
  return headers
}

// Helper per gestire le risposte di Supabase
export const handleSupabaseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: 'Network Error',
      error_description: 'Errore di rete durante la richiesta'
    }))
    
    throw new Error(errorData.error_description || errorData.error || 'Richiesta fallita')
  }
  
  return await response.json()
}
