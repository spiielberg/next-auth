import { UserRole } from '@prisma/client'
import { z } from 'zod'

export const SettingsSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required').email(),
    isTwoFactorEnabled: z.boolean(),
    role: z.enum([UserRole.ADMIN, UserRole.USER], {
      required_error: 'Role is required',
    }),
    password: z.optional(z.string()),
    newPassword: z.optional(
      z.string().refine((value) => (value ? value.length >= 6 : true), {
        message: 'Minimum 6 characters required',
      }),
    ),
    confirmPassword: z.optional(
      z.string().refine((value) => (value ? value.length >= 6 : true), {
        message: 'Minimum 6 characters required',
      }),
    ),
  })
  .refine(
    ({ password, newPassword, confirmPassword }) =>
      newPassword || confirmPassword ? !!password : true,
    {
      message: 'Password is required',
      path: ['password'],
    },
  )
  .refine(
    ({ newPassword, confirmPassword }) =>
      confirmPassword ? !!newPassword : true,
    {
      message: 'New password is required',
      path: ['newPassword'],
    },
  )
  .refine(
    ({ newPassword, confirmPassword }) =>
      newPassword ? !!confirmPassword : true,
    {
      message: 'Confirm new password is required',
      path: ['confirmPassword'],
    },
  )
  .refine(
    ({ newPassword, confirmPassword }) =>
      newPassword || confirmPassword ? newPassword === confirmPassword : true,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    },
  )
