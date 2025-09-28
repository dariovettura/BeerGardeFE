import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import NotFoundError from '@/features/errors/not-found-error'

export const Route = createFileRoute('/(errors)/404')({
  validateSearch: z.object({}),
  component: NotFoundError,
})
