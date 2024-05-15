'use server'

import { getUserByEmail } from '@/data/user'
import { sendPasswordResetEmail } from '@/lib/mail'
import { generatePasswordResetToken } from '@/lib/tokens'
import { ResetPasswordSchema } from '@/schemas/reset-password-schema'
import { z } from 'zod'

export const resetPassword = async (
  value: z.infer<typeof ResetPasswordSchema>,
) => {
  const validatedFields = ResetPasswordSchema.safeParse(value)

  if (!validatedFields.success) {
    return { error: 'Invalid email.' }
  }

  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email not found.' }
  }

  const passwordResetToken = await generatePasswordResetToken(email)

  await sendPasswordResetEmail({ email, token: passwordResetToken.token })

  return { success: 'Reset email sent.' }
}
