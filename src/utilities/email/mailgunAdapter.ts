import formData from 'form-data'
import Mailgun from 'mailgun.js'
import type { EmailAdapter } from 'payload'

export interface MailgunAdapterArgs {
  apiKey: string
  domain: string
  defaultFromAddress: string
  defaultFromName: string
}

export const mailgunAdapter = (args: MailgunAdapterArgs): EmailAdapter => {
  return () => {
    const { apiKey, domain, defaultFromAddress, defaultFromName } = args
    const mailgun = new Mailgun(formData)
    const client = mailgun.client({ username: 'api', key: apiKey })

    return {
      name: 'mailgun',
      defaultFromAddress,
      defaultFromName,
      
      sendEmail: async (message) => {
        const emailData: any = {
          from: message.from || `${defaultFromName} <${defaultFromAddress}>`,
          to: Array.isArray(message.to) ? message.to.join(', ') : message.to,
          subject: message.subject,
        }

        if (message.text) {
          emailData.text = message.text
        }
        if (message.html) {
          emailData.html = message.html
        }

        try {
          const response = await client.messages.create(domain, emailData)
          return response
        } catch (error) {
          console.error('Error sending email with Mailgun:', error)
          throw error
        }
      },
    }
  }
}
