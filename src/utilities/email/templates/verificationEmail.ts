import { generateEmailLayout } from './emailLayout'

interface VerificationEmailParams {
  token: string
  user: {
    name?: string
    email: string
  }
}

export const generateVerificationEmailHTML = ({ token, user }: VerificationEmailParams): string => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/verify-email?token=${token}`
  
  const emailContent = `
    <h2>Hi ${user.name || 'there'},</h2>
    <p>Thank you for signing up for Optimist App! We're excited to have you join our community of positivity.</p>
    <p>Click the button below to verify your email and get started. You'll be automatically logged in - no password needed!</p>
    <div style="text-align: center;">
      <a href="${url}" class="button" style="display: inline-block; padding: 12px 32px; background: #3b82f6; color: white !important; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 24px 0;">Verify Email & Get Started</a>
    </div>
    <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">Or copy and paste this link into your browser:</p>
    <div class="link-box" style="background: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 14px; color: #3b82f6; margin: 16px 0;">${url}</div>
    <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
      <strong>Note:</strong> This link will verify your email and automatically log you in. It expires in 24 hours.
    </p>
    <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
      If you didn't create an account, you can safely ignore this email.
    </p>
  `
  
  return generateEmailLayout({
    content: emailContent,
    preheaderText: `Welcome to Optimist App! Verify your email to get started.`
  })
}

export const generateVerificationEmailSubject = (): string => {
  return 'Welcome to Optimist App - Verify your account'
}
