/**
 * Email Layout Wrapper
 * Provides a consistent header, footer, and styling for all emails
 */

interface EmailLayoutOptions {
  content: string
  preheaderText?: string
}

export function generateEmailLayout({ content, preheaderText }: EmailLayoutOptions): string {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://app.main12.com'
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        ${preheaderText ? `<meta name="description" content="${preheaderText}">` : ''}
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            line-height: 1.6; 
            color: #1f2937; 
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .header { 
            padding: 32px 24px;
            text-align: center;
            border-bottom: 1px solid #e5e7eb;
          }
          .logo { 
            margin: 0 auto 16px;
            display: block;
            max-width: 180px;
            font-size: 28px;
            font-weight: bold;
            color: #227cff;
            letter-spacing: -0.5px;
            font-family: Arial, sans-serif;
          }
          .content { 
            padding: 32px 24px;
          }
          .button { 
            display: inline-block; 
            padding: 12px 32px; 
            background: #3b82f6; 
            color: white !important; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 500;
            margin: 24px 0;
          }
          .button:hover {
            background: #2563eb;
          }
          .link-box {
            background: #f3f4f6;
            padding: 12px;
            border-radius: 6px;
            word-break: break-all;
            font-size: 14px;
            color: #3b82f6;
            margin: 16px 0;
          }
          .footer { 
            padding: 24px; 
            text-align: center; 
            font-size: 14px; 
            color: #6b7280;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
          }
          .social-links {
            margin: 16px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #6b7280;
            text-decoration: none;
          }
          .social-links a:hover {
            color: #3b82f6;
          }
          h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: #111827;
          }
          h2 {
            margin: 0 0 16px 0;
            font-size: 20px;
            font-weight: 600;
            color: #111827;
          }
          p {
            margin: 0 0 16px 0;
            color: #4b5563;
          }
        </style>
      </head>
      <body>
        ${preheaderText ? `<div style="display:none;font-size:1px;color:#f9fafb;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheaderText}</div>` : ''}
        
        <div class="container">
          <div class="header">
            <a class="logo" href="${baseUrl}">
              <img src="${baseUrl}/assets/images/logo_expanded.png" alt="Optimist App" width="180" height="80" style="display: block; margin: 0 auto; max-width: 250px; height: auto;" />
            </a>
          </div>
          
          <div class="content">
            ${content}
          </div>
          
          <div class="footer">
            <p style="margin-bottom: 8px;">
              <a href="${baseUrl}" style="color: #3b82f6; text-decoration: none;">Visit Optimist App</a> | 
              <a href="${baseUrl}/support" style="color: #3b82f6; text-decoration: none;">Support</a> | 
              <a href="${baseUrl}/unsubscribe" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a>
            </p>
            <p style="margin: 8px 0; font-size: 12px;">
              Spreading positivity worldwide
            </p>
            <p style="margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} Optimist App. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
