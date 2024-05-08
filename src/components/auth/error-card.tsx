import { CardWrapper } from '@/components/auth/card-wrapper'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerTitle="Ops!"
      headerLabel="Something went wrong."
      backButtonHref="/auth/sign-in"
      backButtonLabel="Back to sign in"
    >
      <div className="flex w-full justify-center">
        <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
      </div>
    </CardWrapper>
  )
}
