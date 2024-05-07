'use server'

import { nextAuthSignIn } from '@/auth'
import { DEFAULT_SIGNIN_REDIRECT } from '@/routes'
import { SignInSchema } from '@/schemas/sign-in-schema'
import { AuthError } from 'next-auth'
import { z } from 'zod'

export const signIn = async (value: z.infer<typeof SignInSchema>) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const validatedFields = SignInSchema.safeParse(value)

  if (!validatedFields.success) {
    return { error: 'Invalid fields.' }
  }

  const { email, password } = validatedFields.data

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
