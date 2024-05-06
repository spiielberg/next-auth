'use server'

import { SignInSchema } from '@/schemas/sign-in-schema'
import { z } from 'zod'

export const signIn = async ({
  email,
  password,
}: z.infer<typeof SignInSchema>) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const validatedFields = SignInSchema.safeParse({ email, password })

  if (!validatedFields.success) {
    return { error: 'Invalid fields.' }
  }

  return { success: 'Signed in successfully.' }
}
