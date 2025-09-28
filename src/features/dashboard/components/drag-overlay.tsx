import { 
  IconChecklist, 
  IconUsersGroup, 
  IconFileText, 
  IconUserCog,
  IconServer
} from '@tabler/icons-react'

interface DragOverlayProps {
  cardType: string
}

export function DragOverlay({ cardType }: DragOverlayProps) {
  const getCardIcon = (cardType: string) => {
    switch (cardType) {
      case 'tickets':
        return <IconChecklist className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      case 'customers':
        return <IconUsersGroup className="w-6 h-6 text-green-600 dark:text-green-400" />
      case 'contratti':
        return <IconFileText className="w-6 h-6 text-pink-600 dark:text-pink-400" />
      case 'utenti':
        return <IconUserCog className="w-6 h-6 text-orange-600 dark:text-orange-400" />
      case 'host':
        return <IconServer className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
      default:
        return <IconChecklist className="w-6 h-6 text-gray-600 dark:text-gray-400" />
    }
  }

  const getCardIconBg = (cardType: string) => {
    switch (cardType) {
      case 'tickets':
        return 'bg-blue-100 dark:bg-blue-950/50'
      case 'customers':
        return 'bg-green-100 dark:bg-green-950/50'
      case 'contratti':
        return 'bg-pink-100 dark:bg-pink-950/50'
      case 'utenti':
        return 'bg-orange-100 dark:bg-orange-950/50'
      case 'host':
        return 'bg-cyan-100 dark:bg-cyan-950/50'
      default:
        return 'bg-gray-100 dark:bg-gray-950/50'
    }
  }

  const getCardTitle = (cardType: string) => {
    switch (cardType) {
      case 'tickets':
        return 'Tickets'
      case 'customers':
        return 'Clienti'
      case 'contratti':
        return 'Contratti'
      case 'utenti':
        return 'Utenti'
      case 'host':
        return 'Host'
      default:
        return 'Card'
    }
  }

  return (
    <div className="bg-card dark:bg-card/90 border rounded-lg shadow-2xl p-4 min-w-[200px] opacity-90">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${getCardIconBg(cardType)} rounded-lg flex items-center justify-center`}>
          {getCardIcon(cardType)}
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-lg">
            {getCardTitle(cardType)}
          </h3>
          <p className="text-sm text-muted-foreground">
            Trascinando...
          </p>
        </div>
      </div>
    </div>
  )
} 