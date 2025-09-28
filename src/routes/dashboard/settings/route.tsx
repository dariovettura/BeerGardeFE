import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Settings from '@/features/settings'

export const Route = createFileRoute('/dashboard/settings')({
  validateSearch: z.object({ tab: z.string().optional() }),
  component: Settings,
})
