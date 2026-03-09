/**
 * Auth Providers — barrel export
 *
 * Client-side (hooks & context):
 *   import { AuthProvider, useAuth, useUser } from '@/providers/auth'
 *
 * Server-side (server components, route handlers):
 *   import { getCurrentUser } from '@/providers/auth/server'
 */

export { AuthProvider, useAuth, useUser } from './client'
