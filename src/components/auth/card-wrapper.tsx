'use client'

import { BackButton } from '@/components/auth/back-button'
import { Header } from '@/components/auth/header'
import { Social } from '@/components/auth/social'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ReactNode } from 'react'

interface CardWrapperProps {
  children: ReactNode
  headerTitle: string
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
  disableBackButton?: boolean
  showSocial?: boolean
}

export const CardWrapper = ({
  children,
  headerTitle,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  disableBackButton = false,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-96 shadow-md">
      <CardHeader>
        <Header title={headerTitle} label={headerLabel} />
      </CardHeader>

      <CardContent>{children}</CardContent>

      {showSocial && (
        <CardContent>
          <Social title={headerTitle} />
        </CardContent>
      )}

      {!disableBackButton && (
        <CardFooter>
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      )}
    </Card>
  )
}
