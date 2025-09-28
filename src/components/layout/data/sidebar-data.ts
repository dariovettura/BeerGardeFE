import {
  IconLayoutDashboard,
  IconNotification,
  IconPalette,
  IconSettings,
  IconTool,
} from '@tabler/icons-react'

import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {


  navGroups: [
    {
      title: 'Generale',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard/overview',
          icon: IconLayoutDashboard,
        },
  
      
      ],
    },
    {
      title: 'Altro',
      items: [
        {
          title: 'Impostazioni',
          icon: IconSettings,
          items: [
         
            {
              title: 'Account',
              url: '/dashboard/settings/account',
              icon: IconTool,
            },
            {
              title: 'Aspetto',
              url: '/dashboard/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifiche',
              url: '/dashboard/settings/notifications',
              icon: IconNotification,
            },
         
          ],
        },
      ],
    },
  ],
}
