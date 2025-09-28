import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'

export const useScrollToTop = () => {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = router.subscribe('onResolved', () => {
      // Scroll to top when route changes
      window.scrollTo({ top: 0, behavior: 'auto' })
    })

    return unsubscribe
  }, [router])
}
