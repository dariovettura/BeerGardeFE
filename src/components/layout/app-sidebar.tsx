import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { useAuth } from '@/features/auth/stores/authStore'
import { sidebarData } from './data/sidebar-data'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const userData = user
    ? {
        name: user.userInfo.fsMail.split('@')[0],
        email: user.userInfo.fsMail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userInfo.fsNome}`,
      }
    : {
        name: '',
        email: '',
        avatar: '',
      }

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <NavUser user={userData} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* Help Center temporaneamente rimosso */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
