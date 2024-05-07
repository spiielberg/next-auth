import { getUserByEmail } from '@/data/user'
import { SignInSchema } from '@/schemas/sign-in-schema'
import bcrypt from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import credentials from 'next-auth/providers/credentials'

export default {
  providers: [
    credentials({
      authorize: async (credentials) => {
        const validatedFields = SignInSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await getUserByEmail(email)

          if (!user || !user.password) {
            return null
          }

          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) {
            return user
          }
        }

        return null
      },
    }),
  ],
} satisfies NextAuthConfig
