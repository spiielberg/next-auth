'use server'

import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'
import { SignUpSchema } from '@/schemas/sign-up-schema'
import bcrypt from 'bcrypt'
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

  return { success: 'Email sent.' }
}
