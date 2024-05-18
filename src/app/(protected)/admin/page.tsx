'use client'

import { admin } from '@/actions/admin'
import { RoleGate } from '@/components/auth/role-gate'
import { FormSuccess } from '@/components/form-success'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UserRole } from '@prisma/client'
import { toast } from 'sonner'

const AdminPage = () => {
  const onApiRouteClick = () => {
    fetch('/api/admin')
      .then((response) => {
        if (response.ok) {
          toast.success('Allowed API Route.')
        } else {
          toast.error('Forbidden API Route.')
        }
      })
      .catch(() => {
        toast.error('Something went wrong.')
      })
  }

  const onServerActionClick = () => {
    admin()
      .then((response) => {
        if (response.ok) {
          toast.success('Allowed Server Action.')
        } else {
          toast.error('Forbidden Server Action.')
        }
      })
      .catch(() => {
        toast.error('Something went wrong.')
      })
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold">Admin</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <RoleGate
          allowedRole={UserRole.ADMIN}
          notAllowedMessage="You don't have permission to view this content."
        >
          <FormSuccess message="You are allowed to see this content." />
        </RoleGate>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Admin-only API Route</p>

          <Button type="button" variant="secondary" onClick={onApiRouteClick}>
            Click to test
          </Button>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Admin-only Server Action</p>

          <Button
            type="button"
            variant="secondary"
            onClick={onServerActionClick}
          >
            Click to test
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminPage
