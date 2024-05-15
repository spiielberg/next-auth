'use client'

import { resetPassword } from '@/actions/reset-password'
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
import { ResetPasswordSchema } from '@/schemas/reset-password-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const ResetPasswordForm = () => {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    setError(undefined)
    setSuccess(undefined)

    startTransition(() => {
      resetPassword(values)
        .then((data) => {
          setError(data?.error || '')
          setSuccess(data?.success || '')
        })
        .catch(() => {
          setError('Something went wrong.')
        })
    })
  }

  return (
    <CardWrapper
      headerTitle="Auth"
      headerLabel="Forgot your password?"
      backButtonLabel="Back to sign in"
      backButtonHref="/auth/sign-in"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
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
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
