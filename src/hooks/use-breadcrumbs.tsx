

import { useMemo } from 'react'
import { useLocation } from '@tanstack/react-router'

type BreadcrumbItem = {
  title: string
  link: string
}

// Mapping personalizzato per le route del dashboard
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/overview': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Overview', link: '/dashboard/overview' },
  ],
 

  '/dashboard/settings': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Impostazioni', link: '/dashboard/settings' },
  ],
  '/dashboard/settings/account': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Impostazioni', link: '/dashboard/settings' },
    { title: 'Account', link: '/dashboard/settings/account' },
  ],
  '/dashboard/settings/appearance': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Impostazioni', link: '/dashboard/settings' },
    { title: 'Aspetto', link: '/dashboard/settings/appearance' },
  ],
  '/dashboard/settings/display': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Impostazioni', link: '/dashboard/settings' },
    { title: 'Display', link: '/dashboard/settings/display' },
  ],
  '/dashboard/settings/notifications': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Impostazioni', link: '/dashboard/settings' },
    { title: 'Notifiche', link: '/dashboard/settings/notifications' },
  ],
  '/dashboard/apps': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'App', link: '/dashboard/apps' },
  ],
 
  '/dashboard/help-center': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Centro Assistenza', link: '/dashboard/help-center' },
  ],
  // Aggiungi più mapping personalizzati secondo necessità
}

export function useBreadcrumbs() {
  const location = useLocation()
  const pathname = location.pathname

  const breadcrumbs = useMemo(() => {
    // Controlla se abbiamo un mapping personalizzato per questo percorso esatto
    if (routeMapping[pathname]) {
      return routeMapping[pathname]
    }

    // Se non c'è una corrispondenza esatta, genera breadcrumbs dal percorso
    const segments = pathname.split('/').filter(Boolean)
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`

      // Mappa i segmenti a titoli più leggibili
      const titleMap: Record<string, string> = {
        dashboard: 'Dashboard',
       
        settings: 'Impostazioni',
        apps: 'App',
       
        'help-center': 'Centro Assistenza',
        overview: 'Overview',
        account: 'Account',
        appearance: 'Aspetto',
        display: 'Display',
        notifications: 'Notifiche',
      }

      return {
        title:
          titleMap[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path,
      }
    })
  }, [pathname])

  return breadcrumbs
}
