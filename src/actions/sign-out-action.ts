'use server'

import { nextAuthSignOut } from '@/auth'

export const signOut = async () => {
  await nextAuthSignOut({ redirect: true, redirectTo: '/' })
}
