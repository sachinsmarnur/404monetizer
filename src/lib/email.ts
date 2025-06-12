import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify transporter configuration
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetCode: string
) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@404monetizer.com',
    to: email,
    subject: 'Reset Your Password - 404 Monetizer',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: #3b82f6;
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content {
              padding: 30px;
            }
            .reset-code {
              background: #f8fafc;
              border: 2px dashed #3b82f6;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #3b82f6;
            }
            .warning {
              background: #fef3cd;
              border: 1px solid #f6e05e;
              border-radius: 4px;
              padding: 12px;
              margin: 20px 0;
              color: #744210;
            }
            .footer {
              background: #f8fafc;
              padding: 20px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              
              <p>We received a request to reset your password for your 404 Monetizer account. Use the verification code below to reset your password:</p>
              
              <div class="reset-code">
                ${resetCode}
              </div>
              
              <p>This code will expire in <strong>2 minutes</strong> for security reasons.</p>
              
              <div class="warning">
                <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account is still secure.
              </div>
              
              <p>If you have any questions or need help, please contact our support team.</p>
              
              <p>Best regards,<br>
              The 404 Monetizer Team</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${email}. If you received this email by mistake, please ignore it.</p>
              <p>&copy; ${new Date().getFullYear()} 404 Monetizer. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Hello ${name},
      
      We received a request to reset your password for your 404 Monetizer account.
      
      Your verification code is: ${resetCode}
      
      This code will expire in 2 minutes for security reasons.
      
      If you didn't request this password reset, please ignore this email.
      
      Best regards,
      The 404 Monetizer Team
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send password reset success email
export const sendPasswordResetSuccessEmail = async (
  email: string,
  name: string
) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL || 'noreply@404monetizer.com',
    to: email,
    subject: 'Password Reset Successful - 404 Monetizer',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Successful</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: #10b981;
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content {
              padding: 30px;
            }
            .success-icon {
              background: #d1fae5;
              color: #10b981;
              border-radius: 50%;
              width: 60px;
              height: 60px;
              margin: 0 auto 20px;
              display: table-cell;
              vertical-align: middle;
              text-align: center;
              font-size: 24px;
              line-height: 60px;
            }
            .footer {
              background: #f8fafc;
              padding: 20px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Successful</h1>
            </div>
            <div class="content">
              <div class="success-icon">✓</div>
              
              <p>Hello ${name},</p>
              
              <p>Your password has been successfully reset. You can now sign in to your 404 Monetizer account with your new password.</p>
              
              <p>If you didn't make this change, please contact our support team immediately.</p>
              
              <p>Best regards,<br>
              The 404 Monetizer Team</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${email}.</p>
              <p>&copy; ${new Date().getFullYear()} 404 Monetizer. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Hello ${name},
      
      Your password has been successfully reset. You can now sign in to your 404 Monetizer account with your new password.
      
      If you didn't make this change, please contact our support team immediately.
      
      Best regards,
      The 404 Monetizer Team
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending password reset success email:', error);
    throw error;
  }
}; 