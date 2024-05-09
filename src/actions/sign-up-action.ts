'use server'

import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/tokens'
import { SignUpSchema } from '@/schemas/sign-up-schema'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export const signUp = async (value: z.infer<typeof SignUpSchema>) => {
  const validatedFields = SignUpSchema.safeParse(value)

  if (!validatedFields.success) {
    return { error: 'Invalid fields.' }
  }

  const { name, email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: 'Email already in use.' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  const verificationToken = await generateVerificationToken(email)

  await sendVerificationEmail({ email, token: verificationToken.token })

  return { success: 'Confirmation email sent.' }
}
