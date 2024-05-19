import { getPasswordResetTokenByEmail } from '@/data/password-reset-token'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { getVerificationTokenByEmail } from '@/data/verification-token'
import { db } from '@/lib/db'
import crypto from 'crypto'
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

export const generateTwoFactorToken = async (email: string) => {
  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    })
  }

  const token = crypto.randomInt(100_000, 1_000_000).toString()

  const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 10) // 10 minutes

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })

  return twoFactorToken
}

export const generateVerificationToken = async ({
  email,
  isToChangeEmail = false,
  oldEmail,
}: {
  email: string
  isToChangeEmail?: boolean
  oldEmail?: string
}) => {
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
      isToChangeEmail,
      oldEmail,
    },
  })

  return verificationToken
}
