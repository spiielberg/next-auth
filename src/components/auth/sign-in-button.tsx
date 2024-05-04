'use client'

import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

interface SignInButtonProps {
  children: ReactNode
}

export const SignInButton = ({ children }: SignInButtonProps) => {
  const router = useRouter()

  const onClick = () => {
    router.push('/auth/sign-in')
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  )
}
