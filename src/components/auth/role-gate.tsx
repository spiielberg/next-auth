'use client'

import { FormError } from '@/components/form-error'
import { useCurrentRole } from '@/hooks/use-current-role'
import { UserRole } from '@prisma/client'
import { ReactNode } from 'react'

interface RoleGateProps {
  allowedRole: UserRole
  children: ReactNode
  notAllowedMessage: string
}

export const RoleGate = ({
  allowedRole,
  children,
  notAllowedMessage,
}: RoleGateProps) => {
  const role = useCurrentRole()

  if (role !== allowedRole) {
    return <FormError message={notAllowedMessage} />
  }

  return <>{children}</>
}
