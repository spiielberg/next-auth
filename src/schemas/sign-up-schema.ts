import { z } from 'zod'

export const SignUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required').email(),
    password: z.string().min(6, 'Minimum 6 characters required'),
    confirmPassword: z.string().min(6, 'Minimum 6 characters required'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
