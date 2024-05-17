'use client'

import { signOut } from '@/actions/sign-out-action'
import { ReactNode } from 'react'

interface SignInButtonProps {
  children?: ReactNode
}

export const SignOutButton = ({ children }: SignInButtonProps) => {
  const onClick = () => {
    signOut()
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  )
}
