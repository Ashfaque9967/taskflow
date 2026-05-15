import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

export const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'archived']).optional(),
})

export const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member']).default('member'),
})