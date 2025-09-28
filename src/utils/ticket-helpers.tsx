import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react'
import { ReactElement } from 'react'
import { Badge } from '@/components/ui/badge'

/**
 * Stati ticket supportati
 */
export const TICKET_STATUS = {
  APERTO: 1,
  IN_LAVORAZIONE: 2,
  CHIUSO: 3,
  ANNULLATO: 4,
  RIAPERTO: 5,
} as const

export type TicketStatus = typeof TICKET_STATUS[keyof typeof TICKET_STATUS]

/**
 * Priorità ticket supportate
 */
export const TICKET_PRIORITY = {
  NORMALE: 1,
  MEDIA: 2,
  ALTA: 3,
  ALTISSIMA: 4,
} as const

export type TicketPriority = typeof TICKET_PRIORITY[keyof typeof TICKET_PRIORITY]

/**
 * Configurazione per ogni stato ticket
 */
export const TICKET_STATUS_CONFIG = {
  [TICKET_STATUS.APERTO]: {
    text: 'Aperto ed in attesa',
    variant: 'aperto',
    icon: null,
    color: 'orange',
  },
  [TICKET_STATUS.IN_LAVORAZIONE]: {
    text: 'In lavorazione',
    variant: 'in-lavorazione',
    icon: Clock,
    color: 'purple',
  },
  [TICKET_STATUS.CHIUSO]: {
    text: 'Chiuso',
    variant: 'chiuso',
    icon: CheckCircle,
    color: 'green',
  },
  [TICKET_STATUS.ANNULLATO]: {
    text: 'Annullato',
    variant: 'annullato',
    icon: XCircle,
    color: 'gray',
  },
  [TICKET_STATUS.RIAPERTO]: {
    text: 'Riaperto',
    variant: 'riaperto',
    icon: Clock,
    color: 'orange',
  },
} as const

/**
 * Configurazione per ogni priorità ticket
 */
export const TICKET_PRIORITY_CONFIG = {
  [TICKET_PRIORITY.NORMALE]: {
    text: 'Normale',
    variant: 'normale',
    icon: null,
    color: 'green',
  },
  [TICKET_PRIORITY.MEDIA]: {
    text: 'Media',
    variant: 'media',
    icon: Clock,
    color: 'yellow',
  },
  [TICKET_PRIORITY.ALTA]: {
    text: 'Alta',
    variant: 'alta',
    icon: AlertCircle,
    color: 'orange',
  },
  [TICKET_PRIORITY.ALTISSIMA]: {
    text: 'Altissima',
    variant: 'altissima',
    icon: AlertCircle,
    color: 'red',
  },
} as const

/**
 * Ottiene la configurazione per uno stato ticket
 */
export function getTicketStatusConfig(status: number) {
  return TICKET_STATUS_CONFIG[status as TicketStatus] || TICKET_STATUS_CONFIG[TICKET_STATUS.APERTO]
}

/**
 * Ottiene la configurazione per una priorità ticket
 */
export function getTicketPriorityConfig(priority: number) {
  return TICKET_PRIORITY_CONFIG[priority as TicketPriority] || TICKET_PRIORITY_CONFIG[TICKET_PRIORITY.NORMALE]
}

/**
 * Ottiene il testo per uno stato ticket
 */
export function getTicketStatusText(status: number): string {
  return getTicketStatusConfig(status).text
}

/**
 * Ottiene il testo per una priorità ticket
 */
export function getTicketPriorityText(priority: number): string {
  return getTicketPriorityConfig(priority).text
}

/**
 * Ottiene la variante per uno stato ticket
 */
export function getTicketStatusVariant(status: number): string {
  return getTicketStatusConfig(status).variant
}

/**
 * Ottiene la variante per una priorità ticket
 */
export function getTicketPriorityVariant(priority: number): string {
  return getTicketPriorityConfig(priority).variant
}

/**
 * Ottiene l'icona per uno stato ticket
 */
export function getTicketStatusIcon(status: number): ReactElement | null {
  const config = getTicketStatusConfig(status)
  return config.icon ? <config.icon className='h-3 w-3' /> : null
}

/**
 * Ottiene l'icona per una priorità ticket
 */
export function getTicketPriorityIcon(priority: number): ReactElement | null {
  const config = getTicketPriorityConfig(priority)
  return config.icon ? <config.icon className='h-3 w-3' /> : null
}

/**
 * Ottiene il colore per uno stato ticket
 */
export function getTicketStatusColor(status: number): string {
  return getTicketStatusConfig(status).color
}

/**
 * Ottiene il colore per una priorità ticket
 */
export function getTicketPriorityColor(priority: number): string {
  return getTicketPriorityConfig(priority).color
}

/**
 * Crea un badge per lo stato ticket
 */
export function createTicketStatusBadge(status: number, text?: string) {
  const config = getTicketStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant={config.variant as "default" | "secondary" | "destructive" | "outline"}>
      {Icon && <Icon className='h-3 w-3' />}
      <span className={Icon ? 'ml-1' : ''}>
        {text || config.text}
      </span>
    </Badge>
  )
}

/**
 * Crea un badge per la priorità ticket
 */
export function createTicketPriorityBadge(priority: number, text?: string) {
  const config = getTicketPriorityConfig(priority)
  const Icon = config.icon

  return (
    <Badge variant={config.variant as "default" | "secondary" | "destructive" | "outline"}>
      {Icon && <Icon className='h-3 w-3' />}
      <span className={Icon ? 'ml-1' : ''}>
        {text || config.text}
      </span>
    </Badge>
  )
}

/**
 * Crea un badge per lo stato ticket con icona personalizzata
 */
export function createTicketStatusBadgeWithIcon(status: number, text?: string, icon?: ReactElement) {
  const config = getTicketStatusConfig(status)

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
 * Crea un badge per la priorità ticket con icona personalizzata
 */
export function createTicketPriorityBadgeWithIcon(priority: number, text?: string, icon?: ReactElement) {
  const config = getTicketPriorityConfig(priority)

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
 * Ottiene la variante per il pulsante "Chiudi Ticket"
 */
export function getCloseButtonVariant(): string {
  return 'chiuso' // Green - same as closed status
}

/**
 * Ottiene la variante per il pulsante "Metti in Lavorazione"
 */
export function getInProgressButtonVariant(): string {
  return 'in-lavorazione' // Purple - same as in progress status
}

/**
 * Ottiene la variante per il pulsante "Riapri Ticket"
 */
export function getReopenButtonVariant(): string {
  return 'riaperto' // Orange - same as reopened status
}

// Funzioni legacy per compatibilità (deprecate)
/**
 * @deprecated Use getTicketPriorityIcon instead
 */
export const getPriorityIcon = getTicketPriorityIcon

/**
 * @deprecated Use getTicketPriorityVariant instead
 */
export const getPriorityVariant = getTicketPriorityVariant

/**
 * @deprecated Use getTicketStatusIcon instead
 */
export const getStatusIcon = getTicketStatusIcon

/**
 * @deprecated Use getTicketStatusVariant instead
 */
export const getStatusVariant = getTicketStatusVariant