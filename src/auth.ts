import authConfig from '@/auth.config'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { getUserById } from '@/data/user'
import { db } from '@/lib/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

export const {
  handlers,
  signIn: nextAuthSignIn,
  signOut: nextAuthSignOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    jwt: async ({ token }) => {
      if (!token.sub) {
        return token
      }

      const existingUser = await getUserById(token.sub)

      if (!existingUser) {
        return token
      }

      token.role = existingUser.role

      return token
    },
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }

      if (session.user && token.role) {
        session.user.role = token.role
      }

      return session
    },
    signIn: async ({ user, account }) => {
      if (account?.provider !== 'credentials') {
        return true
      }

      const existingUser = await getUserById(user.id || '')

      if (!existingUser?.emailVerified) {
        return false
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        )

        if (!twoFactorConfirmation) {
          return false
        }

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        })
      }

      return true
    },
  },
  events: {
    linkAccount: async ({ user }) => {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
  session: { strategy: 'jwt' },
  ...authConfig,
})
