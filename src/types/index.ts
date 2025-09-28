export interface NavItem {
  title: string
  url: string
  disabled?: boolean
  external?: boolean
  shortcut?: [string, string]
  icon?: string
  label?: string
  description?: string
  isActive?: boolean
  items?: NavItem[]
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemWithChildren

// Export dei tipi OAuth2
export type {
  OAuth2LoginRequest,
  OAuth2LoginResponse,
  OAuth2RefreshResponse,
  OAuth2LogoutResponse,
  AuthenticatedUser,
  OAuth2UserInfo,
  OAuth2CustomerInfo,
} from './oauth2'
