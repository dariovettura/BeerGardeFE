import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import ForbiddenError from '@/features/errors/forbidden'

export const Route = createFileRoute('/(errors)/403')({
  validateSearch: z.object({}),
  component: ForbiddenError,
})
