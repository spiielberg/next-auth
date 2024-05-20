import { SignInForm } from '@/components/auth/sign-in-form'
import { Suspense } from 'react'

const SignInPage = () => {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}

export default SignInPage
