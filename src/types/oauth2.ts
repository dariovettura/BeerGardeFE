// Tipi per l'autenticazione OAuth2

export interface OAuth2LoginRequest {
  fsUser: string
  fsPassword: string
}

export interface OAuth2UserInfo {
  fiUserId: number
  fsCognome: string
  fsNome: string
  fsMail: string
  fbSystem: boolean
  fbAttivo: boolean
}

export interface OAuth2CustomerInfo {
  fiCustomerId: number
  fsRagioneSociale: string
}

export interface OAuth2LoginResponse {
  status: 'success' | 'error'
  code: number
  message: string
  data: {
    token: string
    refreshToken?: string
    userInfo: OAuth2UserInfo
    customerInfo: OAuth2CustomerInfo
  } | null
}

export interface OAuth2RefreshResponse {
  status: 'success' | 'error'
  code: number
  message: string
  data: {
    token: string
    refreshToken?: string
    userInfo: OAuth2UserInfo
    customerInfo: OAuth2CustomerInfo
  } | null
}

export interface OAuth2LogoutResponse {
  status: 'success' | 'error'
  code: number
  message: string
  data: null
}

// Tipo combinato per l'utente autenticato
export interface AuthenticatedUser {
  token: string
  refreshToken?: string
  userInfo: OAuth2UserInfo
  customerInfo: OAuth2CustomerInfo
}
