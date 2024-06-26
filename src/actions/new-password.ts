'use server'

import { getPasswordResetTokenByToken } from '@/data/password-reset-token'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'
import { NewPasswordSchema } from '@/schemas/new-password-schema'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

interface NewPasswordProps {
  value: z.infer<typeof NewPasswordSchema>
  token: string
}

export const newPassword = async ({ value, token }: NewPasswordProps) => {
  const validatedFields = NewPasswordSchema.safeParse(value)

  if (!validatedFields.success) {
    return { error: 'Invalid fields.' }
  }

  const existingToken = await getPasswordResetTokenByToken(token)

  if (!existingToken) {
    return { error: 'Token does not exist.' }
  }

  const hasExpired = new Date() >= new Date(existingToken.expiresAt)

  if (hasExpired) {
    return { error: 'Token has expired.' }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: 'Email does not exist.' }
  }

  const { password } = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  })

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  })

  return { success: 'Password updated.' }
}
