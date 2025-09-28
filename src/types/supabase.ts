// Tipi per la risposta di Supabase
export interface SupabaseUser {
  id: string
  aud: string
  role: string
  email: string
  email_confirmed_at: string
  phone: string
  last_sign_in_at: string
  app_metadata: {
    provider: string
    providers: string[]
  }
  user_metadata: {
    email: string
    email_verified: boolean
    full_name: string
    phone_verified: boolean
    role: string
    sub: string
  }
  created_at: string
  updated_at: string
  is_anonymous: boolean
}

export interface SupabaseLoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  expires_at: number
  refresh_token: string
  user: SupabaseUser
  weak_password: null | string
}

export interface SupabaseUserResponse {
  id: string
  aud: string
  role: string
  email: string
  user_metadata: {
    full_name: string
    role: string
  }
}

export interface SupabaseError {
  error: string
  error_description: string
}

// Credenziali admin disponibili
export const ADMIN_CREDENTIALS = {
  email: 'd.vettura.wd@gmail.com',
  password: 'admin123' // Password di esempio - da cambiare in produzione
}
