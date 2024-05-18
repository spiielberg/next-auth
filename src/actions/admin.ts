'use server'

import { currentRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export const admin = async () => {
  const role = await currentRole()

  const ok = role === UserRole.ADMIN

  return { ok }
}
