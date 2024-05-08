'use client'

import { FormError } from '@/components/form-error'
import { Button } from '@/components/ui/button'
import { DEFAULT_SIGNIN_REDIRECT } from '@/routes'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

interface SocialProps {
  title: string
}

export const Social = ({ title }: SocialProps) => {
  const searchParams = useSearchParams()
  const error =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider.'
      : ''

  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl: DEFAULT_SIGNIN_REDIRECT })
  }

  return (
    <div className="flex flex-col items-center gap-y-3">
      <div className="flex w-full items-center gap-x-2">
        <div className="w-full border-t border-t-slate-100" />

        <p className="text-nowrap text-sm text-muted-foreground">
          {title} with
        </p>

        <div className="w-full border-t border-t-slate-100" />
      </div>

      <div className="flex w-full items-center gap-x-2">
        <Button
          size="lg"
          variant="outline"
          className="w-full gap-x-2"
          onClick={() => onClick('google')}
        >
          <FcGoogle className="h-5 w-5" />

          <p className="text-nowrap text-sm text-muted-foreground">Google</p>
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="w-full gap-x-2"
          onClick={() => onClick('github')}
        >
          <FaGithub className="h-5 w-5" />

          <p className="text-nowrap text-sm text-muted-foreground">GitHub</p>
        </Button>
      </div>

      <FormError message={error} />
    </div>
  )
}
