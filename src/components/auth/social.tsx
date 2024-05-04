'use client'

import { Button } from '@/components/ui/button'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

export const Social = () => {
  return (
    <div className="flex flex-col items-center gap-y-3">
      <div className="flex w-full items-center gap-x-2">
        <div className="w-full border-t border-t-slate-100" />

        <p className="text-nowrap text-sm text-muted-foreground">
          Sign In with
        </p>

        <div className="w-full border-t border-t-slate-100" />
      </div>

      <div className="flex w-full items-center gap-x-2">
        <Button size="lg" variant="outline" className="w-full gap-x-2">
          <FcGoogle className="h-5 w-5" />

          <p className="text-nowrap text-sm text-muted-foreground">Google</p>
        </Button>

        <Button size="lg" variant="outline" className="w-full gap-x-2">
          <FaGithub className="h-5 w-5" />

          <p className="text-nowrap text-sm text-muted-foreground">GitHub</p>
        </Button>
      </div>
    </div>
  )
}
