import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL

interface SendPasswordResetEmailProps {
  email: string
  token: string
}

interface SendTwoFactorEmailProps {
  email: string
  token: string
}

interface SendVerificationEmailProps {
  email: string
  token: string
}

export const sendPasswordResetEmail = async ({
  email,
  token,
}: SendPasswordResetEmailProps) => {
  const resetPasswordLink = `${domain}/auth/new-password?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your password',
    html: `
      <p>
        Click <a href="${resetPasswordLink}">here</a> to reset your password.
      </p>
    `,
  })
}

export const sendTwoFactorEmail = async ({
  email,
  token,
}: SendTwoFactorEmailProps) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA Code: ${token}</p>`,
  })
}

export const sendVerificationEmail = async ({
  email,
  token,
}: SendVerificationEmailProps) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirm your email',
    html: `
      <p>
        Click <a href="${confirmLink}">here</a> to confirm your email.
      </p>
    `,
  })
}
