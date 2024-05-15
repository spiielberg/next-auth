import { z } from 'zod'

export const NewPasswordSchema = z
  .object({
    password: z.string().min(6, 'Minimum 6 characters required'),
    confirmPassword: z.string().min(6, 'Minimum 6 characters required'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
