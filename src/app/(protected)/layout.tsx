import { Navbar } from '@/app/(protected)/_components/navbar'
import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <div className="flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-600 to-slate-950">
        <div className="container flex flex-col items-center justify-center gap-y-10">
          <Navbar />

          {children}
        </div>
      </div>
    </SessionProvider>
  )
}

export default ProtectedLayout
