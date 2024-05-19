'use server'

import { getUserByEmail } from '@/data/user'
import { getVerificationTokenByToken } from '@/data/verification-token'
import { db } from '@/lib/db'

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token)

  if (!existingToken) {
    return { error: 'Token does not exist.' }
  }

  const hasExpired = new Date() >= new Date(existingToken.expiresAt)

  if (hasExpired) {
    return { error: 'Token has expired.' }
  }

  if (existingToken.isToChangeEmail && existingToken.oldEmail) {
    const existingUser = await getUserByEmail(existingToken.oldEmail)

    if (!existingUser) {
      return { error: 'Email does not exist.' }
    }

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    })

    await db.verificationToken.delete({
      where: { id: existingToken.id },
    })

    return { success: 'Email updated.' }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: 'Email does not exist.' }
  }

  if (existingUser.emailVerified) {
    return { success: 'Email already verified.' }
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  })

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  })

  return { success: 'Email verified.' }
}
