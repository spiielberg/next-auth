'use server'

import { update } from '@/auth'
import { getUserByEmail, getUserById } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/tokens'
import { SettingsSchema } from '@/schemas/settings-schema'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export const setUserSettings = async (
  value: z.infer<typeof SettingsSchema>,
) => {
  let successMessage = 'Settings updated.'

  const user = await currentUser()

  if (!user || !user.id) {
    return { error: 'Unauthorized.' }
  }

  const dbUser = await getUserById(user.id)

  if (!dbUser) {
    return { error: 'Unauthorized.' }
  }

  const validatedFields = SettingsSchema.safeParse(value)

  if (!validatedFields.success) {
    return { error: 'Invalid fields.' }
  }

  const data = { ...validatedFields.data }

  if (user.isOAuth) {
    if (user.email) {
      data.email = user.email
    }

    delete data.password
    delete data.newPassword
    delete data.confirmPassword

    data.isTwoFactorEnabled = false
  }

  if (value.email && value.email !== user.email) {
    const existingUser = await getUserByEmail(value.email)

    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in use.' }
    }

    const verificationToken = await generateVerificationToken({
      email: value.email,
      isToChangeEmail: true,
      oldEmail: user.email || '',
    })

    await sendVerificationEmail({
      email: value.email,
      token: verificationToken.token,
    })

    if (user.email) {
      data.email = user.email
    }

    successMessage = 'Verification email sent, check your inbox.'
  }

  if (value.password && value.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(value.password, dbUser.password)

    if (!passwordsMatch) {
      return { error: 'Incorrect password.' }
    }

    const hashedPassword = await bcrypt.hash(value.newPassword, 10)

    data.password = hashedPassword

    delete data.newPassword
    delete data.confirmPassword
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data,
  })

  update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      role: updatedUser.role,
    },
  })

  return { success: successMessage }
}
