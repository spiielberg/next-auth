'use client'

import { newVerification } from '@/actions/new-verification-action'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FadeLoader } from 'react-spinners'

export const NewVerificationForm = () => {
  const searchParams = useSearchParams()

  const router = useRouter()

  const token = searchParams.get('token')

  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)

  const onSubmit = useCallback(() => {
    if (!token) {
      setError('Token does not exist.')

      return
    }

    router.push('/auth/new-verification')

    newVerification(token)
      .then((data) => {
        setError(data.error)
        setSuccess(data.success)
      })
      .catch(() => {
        setError('Something went wrong.')
      })
  }, [router, token])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <CardWrapper
      headerTitle="Auth"
      headerLabel="Confirming your verification"
      backButtonHref="/auth/sign-in"
      backButtonLabel="Back to sign in"
      disableBackButton={!error && !success}
    >
      <div className="flex w-full justify-center">
        {!error && !success && <FadeLoader color="#475569" />}

        {!success && <FormError message={error} />}
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  )
}
