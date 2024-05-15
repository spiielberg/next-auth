import { getPasswordResetTokenByEmail } from '@/data/password-reset-token'
import { getVerificationTokenByEmail } from '@/data/verification-token'
import { db } from '@/lib/db'
import { v4 as uuid } from 'uuid'

export const generatePasswordResetToken = async (email: string) => {
  const existingToken = await getPasswordResetTokenByEmail(email)

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    })
  }

  const token = uuid()

  const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 10) // 10 minutes

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })

  return passwordResetToken
}

export const generateVerificationToken = async (email: string) => {
  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    })
  }

  const token = uuid()

  const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 10) // 10 minutes

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })

  return verificationToken
}
