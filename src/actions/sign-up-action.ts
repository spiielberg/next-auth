'use server'

import { SignUpSchema } from '@/schemas/sign-up-schema'
import { z } from 'zod'

export const signUp = async (value: z.infer<typeof SignUpSchema>) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const validatedFields = SignUpSchema.safeParse(value)

  if (!validatedFields.success) {
    return { error: 'Invalid fields.' }
  }

  return { success: 'Email sent.' }
}
