import { z } from 'zod'

export const SignInSchema = z.object({
  email: z.string().min(1, 'Email is required').email(),
  password: z.string().min(1, 'Password is required'),
  code: z.optional(z.string()),
})
