// app/api/auth/[auth0]/route.js

/**
 * @swagger
 * /api/auth/{auth0}:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Handle authentication with Auth0
 *     description: Redirects users to the Auth0 authentication flow for login, logout, and callback handling.
 *     parameters:
 *       - in: path
 *         name: auth0
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication action (e.g., `login`, `logout`, `callback`, `me`).
 *         example: "login"
 *     responses:
 *       302:
 *         description: Redirects to the appropriate Auth0 authentication endpoint.
 *       400:
 *         description: Invalid authentication request.
 *       500:
 *         description: Authentication error.
 */

import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth();