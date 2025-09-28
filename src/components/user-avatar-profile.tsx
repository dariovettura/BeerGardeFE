import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface UserAvatarProfileProps {
  className?: string
  showInfo?: boolean
  user:
    | User
    | {
        imageUrl?: string
        fullName?: string | null
        emailAddresses: Array<{ emailAddress: string }>
      }
    | null
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user,
}: UserAvatarProfileProps) {
  // Determina se è il nostro tipo di utente o quello di Clerk
  const isCustomUser = user && 'id' in user && 'name' in user

  const userName = isCustomUser ? user.name : user?.fullName || ''
  const userEmail = isCustomUser
    ? user.email
    : user?.emailAddresses?.[0]?.emailAddress || ''
  const userAvatar = isCustomUser ? user.avatar : user?.imageUrl || ''

  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className}>
        <AvatarImage src={userAvatar} alt={userName} />
        <AvatarFallback className='rounded-lg'>
          {userName?.slice(0, 2)?.toUpperCase() || 'CN'}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>{userName}</span>
          <span className='truncate text-xs'>{userEmail}</span>
        </div>
      )}
    </div>
  )
}
