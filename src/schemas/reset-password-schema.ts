import { z } from 'zod'

export const ResetPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email(),
})
