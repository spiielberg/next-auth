'use client'

import { SignOutButton } from '@/components/auth/sign-out-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCurrentUser } from '@/hooks/use-current-user'
import { ExitIcon } from '@radix-ui/react-icons'
import { FaUser } from 'react-icons/fa'

export const UserButton = () => {
  const user = useCurrentUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ''} />

          <AvatarFallback className="bg-slate-500">
            <FaUser className="h-6 w-6 text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <SignOutButton>
          <DropdownMenuItem>
            <ExitIcon className="mr-2 h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
