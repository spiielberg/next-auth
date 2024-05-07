import authConfig from '@/auth.config'
import {
  DEFAULT_SIGNIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes'
import NextAuth from 'next-auth'

const { auth: middleware } = NextAuth(authConfig)

export default middleware((req) => {
  const { nextUrl } = req
  const isSignedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  console.log({ isSignedIn, isApiAuthRoute, isPublicRoute, isAuthRoute })

  if (isApiAuthRoute) {
    return
  }

  if (isAuthRoute) {
    if (isSignedIn) {
      return Response.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl))
    }

    return
  }

  if (!isSignedIn && !isPublicRoute) {
    return Response.redirect(new URL('/auth/sign-in', nextUrl))
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
