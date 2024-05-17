'use client'

import { signIn } from '@/actions/sign-in-action'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SignInSchema } from '@/schemas/sign-in-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const SignInForm = () => {
  const searchParams = useSearchParams()

  const router = useRouter()

  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
      code: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    setError(undefined)
    setSuccess(undefined)

    startTransition(() => {
      signIn(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error)
          }

          if (data?.success) {
            setSuccess(data.success)
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true)
          }
        })
        .catch(() => {
          setError('Something went wrong.')
        })
    })
  }

  const clearError = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('error', '')

    return params.toString()
  }, [searchParams])

  useEffect(() => {
    if (error || success) {
      router.push(clearError())
    }
  }, [clearError, error, router, success])

  return (
    <CardWrapper
      headerTitle="Sign In"
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/sign-up"
      showSocial={!showTwoFactor}
      disableBackButton={showTwoFactor}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Email"
                          type="email"
                          className="h-10"
                          disabled={isPending}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Password"
                          type="password"
                          className="h-10"
                          disabled={isPending}
                        />
                      </FormControl>

                      <FormMessage />

                      <Button
                        size="sm"
                        variant="link"
                        className="px-0 font-normal"
                        asChild
                      >
                        <Link href="/auth/reset-password">
                          Forgot password?
                        </Link>
                      </Button>
                    </FormItem>
                  )}
                />
              </>
            )}

            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Two Factor Code"
                        maxLength={6}
                        className="h-10"
                        disabled={isPending}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            {!showTwoFactor ? 'Sign In' : 'Confirm'}
          </Button>

          {showTwoFactor && (
            <Button
              type="button"
              size="lg"
              variant="secondary"
              className="w-full font-normal"
              disabled={isPending}
              onClick={() => {
                form.reset()

                setError(undefined)
                setSuccess(undefined)
                setShowTwoFactor(false)
              }}
            >
              Back
            </Button>
          )}
        </form>
      </Form>
    </CardWrapper>
  )
}
