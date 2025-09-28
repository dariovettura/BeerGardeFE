import {  Info, AlertTriangle, XCircle } from 'lucide-react'
import { ReactElement } from 'react'
import { Badge } from '@/components/ui/badge'

/**
 * Priorità eventi supportate
 */
export const EVENT_PRIORITY = {
  NORMALE: 0,
  NORMALE_ALT: 1,
  MEDIA: 2,
  ALTA: 3,
  ALTISSIMA: 4,
} as const

export type EventPriority = typeof EVENT_PRIORITY[keyof typeof EVENT_PRIORITY]

/**
 * Severità eventi supportate
 */
export const EVENT_SEVERITY = {
  NORMALE: 'Normale',
  MEDIA: 'Media',
  ALTA: 'Alta',
  ALTISSIMA: 'Altissima',
} as const

export type EventSeverity = typeof EVENT_SEVERITY[keyof typeof EVENT_SEVERITY]

/**
 * Configurazione per ogni priorità evento
 */
export const EVENT_PRIORITY_CONFIG = {
  [EVENT_PRIORITY.NORMALE]: {
    text: 'Normale',
    variant: 'normale',
    icon: Info,
    color: 'green',
  },
  [EVENT_PRIORITY.NORMALE_ALT]: {
    text: 'Normale',
    variant: 'normale',
    icon: Info,
    color: 'green',
  },
  [EVENT_PRIORITY.MEDIA]: {
    text: 'Media',
    variant: 'media',
    icon: AlertTriangle,
    color: 'yellow',
  },
  [EVENT_PRIORITY.ALTA]: {
    text: 'Alta',
    variant: 'alta',
    icon: AlertTriangle,
    color: 'orange',
  },
  [EVENT_PRIORITY.ALTISSIMA]: {
    text: 'Altissima',
    variant: 'altissima',
    icon: XCircle,
    color: 'red',
  },
} as const

/**
 * Configurazione per ogni severità evento
 */
export const EVENT_SEVERITY_CONFIG = {
  [EVENT_SEVERITY.NORMALE]: {
    text: 'Normale',
    variant: 'normale',
    icon: Info,
    color: 'green',
  },
  [EVENT_SEVERITY.MEDIA]: {
    text: 'Media',
    variant: 'media',
    icon: AlertTriangle,
    color: 'yellow',
  },
  [EVENT_SEVERITY.ALTA]: {
    text: 'Alta',
    variant: 'alta',
    icon: AlertTriangle,
    color: 'orange',
  },
  [EVENT_SEVERITY.ALTISSIMA]: {
    text: 'Altissima',
    variant: 'altissima',
    icon: XCircle,
    color: 'red',
  },
} as const

/**
 * Ottiene la configurazione per una priorità evento
 */
export function getEventPriorityConfig(priority: number) {
  // Se priority è 0 o 1, mappa a NORMALE
  if (priority === 0 || priority === 1) {
    return EVENT_PRIORITY_CONFIG[EVENT_PRIORITY.NORMALE]
  }
  
  return EVENT_PRIORITY_CONFIG[priority as EventPriority] || EVENT_PRIORITY_CONFIG[EVENT_PRIORITY.NORMALE]
}

/**
 * Ottiene la configurazione per una severità evento
 */
export function getEventSeverityConfig(severity: string | null) {
  if (!severity) return EVENT_SEVERITY_CONFIG[EVENT_SEVERITY.NORMALE]
  
  const normalizedSeverity = severity.toLowerCase()
  switch (normalizedSeverity) {
    case 'normale':
      return EVENT_SEVERITY_CONFIG[EVENT_SEVERITY.NORMALE]
    case 'media':
      return EVENT_SEVERITY_CONFIG[EVENT_SEVERITY.MEDIA]
    case 'alta':
      return EVENT_SEVERITY_CONFIG[EVENT_SEVERITY.ALTA]
    case 'altissima':
      return EVENT_SEVERITY_CONFIG[EVENT_SEVERITY.ALTISSIMA]
    default:
      return EVENT_SEVERITY_CONFIG[EVENT_SEVERITY.NORMALE]
  }
}

/**
 * Ottiene il testo per una priorità evento
 */
export function getEventPriorityText(priority: number): string {
  return getEventPriorityConfig(priority).text
}

/**
 * Ottiene il testo per una severità evento
 */
export function getEventSeverityText(severity: string | null): string {
  return getEventSeverityConfig(severity).text
}

/**
 * Ottiene la variante per una priorità evento
 */
export function getEventPriorityVariant(priority: number): string {
  return getEventPriorityConfig(priority).variant
}

/**
 * Ottiene la variante per una severità evento
 */
export function getEventSeverityVariant(severity: string | null): string {
  return getEventSeverityConfig(severity).variant
}

/**
 * Ottiene l'icona per una priorità evento
 */
export function getEventPriorityIcon(priority: number): ReactElement | null {
  const config = getEventPriorityConfig(priority)
  return config.icon ? <config.icon className="h-4 w-4" /> : null
}

/**
 * Ottiene l'icona per una severità evento
 */
export function getEventSeverityIcon(severity: string | null): ReactElement | null {
  const config = getEventSeverityConfig(severity)
  return config.icon ? <config.icon className="h-4 w-4" /> : null
}

/**
 * Ottiene l'icona per una severità evento con colore
 */
export function getEventSeverityIconWithColor(severity: string | null): ReactElement | null {
  const config = getEventSeverityConfig(severity)
  if (!config.icon) return null
  
  const colorClass = `text-${config.color}-600`
  return <config.icon className={`h-4 w-4 ${colorClass}`} />
}

/**
 * Ottiene il colore per una priorità evento
 */
export function getEventPriorityColor(priority: number): string {
  return getEventPriorityConfig(priority).color
}

/**
 * Ottiene il colore per una severità evento
 */
export function getEventSeverityColor(severity: string | null): string {
  return getEventSeverityConfig(severity).color
}

/**
 * Crea un badge per la priorità evento
 */
export function createEventPriorityBadge(priority: number, text?: string) {
  const config = getEventPriorityConfig(priority)
  const Icon = config.icon

  return (
    <Badge variant={config.variant as "default" | "secondary" | "destructive" | "outline"}>
      <Icon className="h-4 w-4" />
      <span className="ml-1">
        {text || config.text}
      </span>
    </Badge>
  )
}

/**
 * Crea un badge per la severità evento
 */
export function createEventSeverityBadge(severity: string | null, text?: string) {
  const config = getEventSeverityConfig(severity)
  const Icon = config.icon

  return (
    <Badge variant={config.variant as "default" | "secondary" | "destructive" | "outline"}>
      <Icon className="h-4 w-4" />
      <span className="ml-1">
        {text || config.text}
      </span>
    </Badge>
  )
}

/**
 * Crea un badge per la severità evento con icona personalizzata
 */
export function createEventSeverityBadgeWithIcon(severity: string | null, text?: string, icon?: ReactElement) {
  const config = getEventSeverityConfig(severity)

  return (
    <Badge variant={config.variant as "default" | "secondary" | "destructive" | "outline"}>
      {icon}
      <span className={icon ? 'ml-1' : ''}>
        {text || config.text}
      </span>
    </Badge>
  )
}

/**
 * Crea un badge per la severità evento con icona colorata
 */
export function createEventSeverityBadgeWithColoredIcon(severity: string | null, text?: string) {
  const config = getEventSeverityConfig(severity)
  const Icon = config.icon
  const colorClass = `text-${config.color}-600`

  return (
    <Badge variant={config.variant as "default" | "secondary" | "destructive" | "outline"}>
      <Icon className={`h-4 w-4 ${colorClass}`} />
      <span className="ml-1">
        {text || config.text}
      </span>
    </Badge>
  )
}

/**
 * Crea un badge per la severità evento con icona colorata e testo personalizzato
 */
export function createEventSeverityBadgeWithColoredIconAndText(severity: string | null, text: string) {
  const config = getEventSeverityConfig(severity)
  const Icon = config.icon
  const colorClass = `text-${config.color}-600`

  return (
    <Badge variant={config.variant as "default" | "secondary" | "destructive" | "outline"}>
      <Icon className={`h-4 w-4 ${colorClass}`} />
      <span className="ml-1">
        {text}
      </span>
    </Badge>
  )
}

// Funzioni legacy per compatibilità (deprecate)
/**
 * @deprecated Use getEventSeverityIcon instead
 */
export const getSeverityIcon = getEventSeverityIcon

/**
 * @deprecated Use createEventSeverityBadge instead
 */
export const getSeverityBadge = createEventSeverityBadge
