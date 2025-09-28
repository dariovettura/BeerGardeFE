import { Badge } from '@/components/ui/badge'
import { 
  IconChecklist, 
  IconUsersGroup, 
  IconFileText, 
  IconUserCog,
  IconServer,
  IconAlertTriangle
} from '@tabler/icons-react'

export type NavigationBadgeType = 'tickets' | 'customers' | 'contratti' | 'utenti' | 'host' | 'eventi'

interface NavigationBadgeProps {
  type: NavigationBadgeType
  className?: string
}

export function NavigationBadge({ type, className = '' }: NavigationBadgeProps) {
  const getBadgeConfig = (type: NavigationBadgeType) => {
    switch (type) {
      case 'tickets':
        return {
          icon: <IconChecklist className="w-3 h-3" />,
          text: 'Ticket',
          className: 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
        }
      case 'customers':
        return {
          icon: <IconUsersGroup className="w-3 h-3" />,
          text: 'Cliente',
          className: 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
        }
      case 'contratti':
        return {
          icon: <IconFileText className="w-3 h-3" />,
          text: 'Contratto',
          className: 'bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800'
        }
      case 'utenti':
        return {
          icon: <IconUserCog className="w-3 h-3" />,
          text: 'Utente',
          className: 'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'
        }
      case 'host':
        return {
          icon: <IconServer className="w-3 h-3" />,
          text: 'Host',
          className: 'bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
        }
      case 'eventi':
        return {
          icon: <IconAlertTriangle className="w-3 h-3" />,
          text: 'Evento',
          className: 'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        }
      default:
        return {
          icon: <IconChecklist className="w-3 h-3" />,
          text: 'Dettaglio',
          className: 'bg-gray-100 dark:bg-gray-950/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800'
        }
    }
  }

  const config = getBadgeConfig(type)

  return (
    <Badge 
      variant="outline" 
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium ${config.className} ${className}`}
    >
      {config.icon}
      {config.text}
    </Badge>
  )
}
