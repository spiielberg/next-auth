import { SignInButton } from '@/components/auth/sign-in-button'
import { Button } from '@/components/ui/button'

const HomePage = () => {
  return (
    <main className="flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-600 to-slate-950">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-bold text-white drop-shadow-md">
          🔐 Auth
        </h1>

        <p className="text-lg text-white">A simple authentication service</p>

        <div>
          <SignInButton>
            <Button size="lg" variant="secondary">
              Sign in
            </Button>
          </SignInButton>
        </div>
      </div>
    </main>
  )
}

export default HomePage
