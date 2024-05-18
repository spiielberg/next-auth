import { currentRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const role = await currentRole()

  const status = role === UserRole.ADMIN ? 200 : 403

  return new NextResponse(null, { status })
}
