import { auth, nextAuthSignOut } from '@/auth'
import { Button } from '@/components/ui/button'

const SettingsPage = async () => {
  const session = await auth()

  return (
    <div className="space-y-2">
      <p>SettingsPage</p>

      <p>{JSON.stringify(session)}</p>

      <form
        action={async () => {
          'use server'

          await nextAuthSignOut({ redirect: true, redirectTo: '/' })
        }}
      >
        <Button type="submit">Sign out</Button>
      </form>
    </div>
  )
}

export default SettingsPage
