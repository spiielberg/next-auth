import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ExtendedUser } from '@/types/next-auth'

interface UserInfoProps {
  label: string
  user?: ExtendedUser
}

export const UserInfo = ({ label, user }: UserInfoProps) => {
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold">{label}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">ID</p>

          <p className="max-w-72 truncate rounded-md bg-secondary p-1 font-mono text-xs text-secondary-foreground shadow-sm">
            {user?.id}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Name</p>

          <p className="max-w-72 truncate rounded-md bg-secondary p-1 font-mono text-xs text-secondary-foreground shadow-sm">
            {user?.name}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Email</p>

          <p className="max-w-72 truncate rounded-md bg-secondary p-1 font-mono text-xs text-secondary-foreground shadow-sm">
            {user?.email}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Two Factor Authentication</p>

          <p
            className={cn(
              'w-8 truncate rounded-md p-1 text-center font-mono text-xs text-white',
              user?.isTwoFactorEnabled ? 'bg-emerald-500' : 'bg-red-500',
            )}
          >
            {user?.isTwoFactorEnabled ? 'ON' : 'OFF'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
