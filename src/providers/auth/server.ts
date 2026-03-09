import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { User } from '@/payload-types'

interface GetCurrentUserOptions {
  /** Redirect to this path if user is NOT authenticated */
  nullUserRedirect?: string
  /** Redirect to this path if user IS authenticated */
  validUserRedirect?: string
}

interface AuthResult {
  user: User | null
  token: string | null
}

/**
 * Server-side utility to get the current authenticated user.
 * Uses Payload Local API (no HTTP self-request) for reliable auth in
 * Server Components, Server Actions, and Route Handlers.
 *
 * @example
 * // In a server component — no redirect, returns null if not logged in
 * const { user } = await getCurrentUser()
 *
 * @example
 * // In a protected page — redirects to login if not authenticated
 * const { user } = await getCurrentUser({ nullUserRedirect: '/login' })
 *
 * @example
 * // In a login page — redirects away if already authenticated
 * const { user } = await getCurrentUser({ validUserRedirect: '/' })
 */
export async function getCurrentUser(
  options?: GetCurrentUserOptions,
): Promise<AuthResult> {
  const { nullUserRedirect, validUserRedirect } = options || {}

  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value || null

  let user: User | null = null

  if (token) {
    try {
      const payload = await getPayload({ config })
      const { user: authUser } = await payload.auth({
        headers: new Headers({ Authorization: `JWT ${token}` }),
      })
      user = (authUser as User) ?? null
    } catch (error) {
      console.error('Error fetching current user:', error)
    }
  }

  if (validUserRedirect && user) {
    redirect(validUserRedirect)
  }

  if (nullUserRedirect && !user) {
    redirect(nullUserRedirect)
  }

  return { user, token }
}
