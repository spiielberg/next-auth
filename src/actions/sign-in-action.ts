'use server'

import { nextAuthSignIn } from '@/auth'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'
import { sendTwoFactorEmail, sendVerificationEmail } from '@/lib/mail'
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens'
import { DEFAULT_SIGNIN_REDIRECT } from '@/routes'
import { SignInSchema } from '@/schemas/sign-in-schema'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { z } from 'zod'

export const signIn = async (value: z.infer<typeof SignInSchema>) => {
  const validatedFields = SignInSchema.safeParse(value)

  if (!validatedFields.success) {
    return { error: 'Invalid fields.' }
  }

  const { email, password, code } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Invalid credentials.' }
  }

  const passwordsMatch = await bcrypt.compare(password, existingUser.password)

  if (!passwordsMatch) {
    return { error: 'Invalid credentials.' }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email)

    await sendVerificationEmail({ email, token: verificationToken.token })

    return { success: 'Confirmation email sent.' }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (!code) {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)

      await sendTwoFactorEmail({
        email: twoFactorToken.email,
        token: twoFactorToken.token,
      })

      return { success: 'Email sent with code.', twoFactor: true }
    }

    const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

    if (!twoFactorToken || twoFactorToken.token !== code) {
      return { error: 'Invalid code.' }
    }

    const hasExpired = new Date() >= new Date(twoFactorToken.expiresAt)

    if (hasExpired) {
      return { error: 'Code has expired.' }
    }

    await db.twoFactorToken.delete({
      where: { id: twoFactorToken.id },
    })

    const existingConfirmation = await getTwoFactorConfirmationByUserId(
      existingUser.id,
    )

    if (existingConfirmation) {
      await db.twoFactorConfirmation.delete({
        where: { id: existingConfirmation.id },
      })
    }

    await db.twoFactorConfirmation.create({
      data: {
        userId: existingUser.id,
      },
    })
  }

  try {
    await nextAuthSignIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_SIGNIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials.' }
        default:
          return { error: 'Something went wrong.' }
      }
    }

    throw error
  }
}
