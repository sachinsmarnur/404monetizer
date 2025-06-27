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
    from: process.env.SMTP_FROM_EMAIL || '404monetizer@gmail.com',
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
    from: process.env.SMTP_FROM_EMAIL || '404monetizer@gmail.com',
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

// Send welcome/promotional email to users
export const sendWelcomePromoEmail = async (
  email: string,
  name: string
) => {
  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL || '404monetizer@gmail.com',
    to: email,
    subject: 'Welcome to 404 Monetizer - Transform Your Error Pages! 🚀',
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to 404 Monetizer</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #1a1a1a;
              background-color: #f8fafc;
              margin: 0;
              padding: 0;
            }

            .email-container {
              max-width: 680px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 0;
              overflow: hidden;
            }

            /* Header Section - Inspired by Bolt.new */
            .header-section {
              background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
              padding: 0;
              position: relative;
              overflow: hidden;
            }

            .header-content {
              padding: 60px 40px;
              text-align: center;
              position: relative;
              z-index: 2;
            }

            .brand-title {
              font-size: 36px;
              font-weight: 900;
              color: #ffffff;
              margin-bottom: 8px;
              letter-spacing: -0.02em;
            }

            .main-headline {
              font-size: 48px;
              font-weight: 900;
              color: #ffffff;
              margin: 20px 0;
              line-height: 1.1;
              letter-spacing: -0.02em;
            }

            .sub-headline {
              font-size: 24px;
              font-weight: 600;
              color: rgba(255, 255, 255, 0.9);
              margin-bottom: 30px;
            }

            .cta-primary {
              background: #000000;
              color: #ffffff;
              padding: 16px 32px;
              border-radius: 50px;
              text-decoration: none;
              font-weight: 600;
              font-size: 16px;
              display: inline-block;
              margin: 20px 0;
              transition: all 0.2s ease;
              border: none;
            }

            .cta-primary:hover {
              background: #1a1a1a;
              transform: translateY(-1px);
            }

            /* Content Section */
            .content-section {
              padding: 50px 40px;
              background: #ffffff;
            }

            .greeting {
              font-size: 18px;
              color: #1a1a1a;
              margin-bottom: 30px;
              font-weight: 500;
            }

            .main-text {
              font-size: 17px;
              color: #4a5568;
              line-height: 1.7;
              margin-bottom: 40px;
            }

            /* Stats Section - Like Bolt.new */
            .stats-list {
              margin: 40px 0;
              padding: 0;
              list-style: none;
            }

            .stats-list li {
              font-size: 16px;
              color: #1a1a1a;
              margin-bottom: 12px;
              display: flex;
              align-items: center;
            }

            .stats-number {
              font-weight: 700;
              color: #1e40af;
            }

            .stats-list li::before {
              content: "•";
              color: #3b82f6;
              font-weight: bold;
              width: 20px;
              margin-right: 10px;
            }

            /* Image Sections */
            .feature-section {
              margin: 50px 0;
              text-align: center;
            }

            .feature-image {
              width: 100%;
              max-width: 600px;
              height: auto;
              border-radius: 12px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              margin: 30px 0;
            }

            .feature-title {
              font-size: 28px;
              font-weight: 700;
              color: #1a1a1a;
              margin: 30px 0 15px 0;
              letter-spacing: -0.02em;
            }

            .feature-description {
              font-size: 16px;
              color: #4a5568;
              line-height: 1.7;
              max-width: 500px;
              margin: 0 auto 20px auto;
            }

            /* Pro Section */
            .pro-section {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              border-radius: 16px;
              padding: 40px;
              margin: 50px 0;
              text-align: center;
              border: 2px solid #e2e8f0;
            }

            .pro-badge {
              background: linear-gradient(135deg, #fbbf24, #f59e0b);
              color: #ffffff;
              padding: 8px 20px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin-bottom: 20px;
              display: inline-block;
            }

            .pro-title {
              font-size: 24px;
              font-weight: 700;
              color: #1a1a1a;
              margin-bottom: 15px;
            }

            .highlight-text {
              font-size: 18px;
              color: #1a1a1a;
              font-weight: 600;
              margin: 20px 0;
              padding: 20px;
              background: rgba(59, 130, 246, 0.1);
              border-radius: 8px;
              border-left: 4px solid #3b82f6;
            }

            /* Final CTA Section */
            .final-cta-section {
              text-align: center;
              margin: 50px 0;
              padding: 40px 20px;
            }

            .final-cta-title {
              font-size: 24px;
              font-weight: 700;
              color: #1a1a1a;
              margin-bottom: 15px;
            }

            .final-cta-text {
              font-size: 16px;
              color: #4a5568;
              margin-bottom: 30px;
              line-height: 1.6;
            }

            .cta-secondary {
              background: #3b82f6;
              color: #ffffff;
              padding: 14px 28px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              font-size: 16px;
              display: inline-block;
              margin: 10px;
              transition: all 0.2s ease;
            }

            .cta-secondary:hover {
              background: #2563eb;
              transform: translateY(-1px);
            }

            /* Footer */
            .footer {
              background: #f8fafc;
              padding: 30px 40px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }

            .footer-text {
              font-size: 14px;
              color: #6b7280;
              line-height: 1.6;
              margin-bottom: 10px;
            }

            .footer-links {
              margin: 15px 0;
            }

            .footer-link {
              color: #3b82f6;
              text-decoration: none;
              font-size: 14px;
              margin: 0 15px;
            }

            /* Mobile Responsive */
            @media (max-width: 600px) {
              .header-content {
                padding: 40px 20px;
              }

              .main-headline {
                font-size: 32px;
              }

              .content-section {
                padding: 30px 20px;
              }

              .pro-section {
                padding: 30px 20px;
                margin: 30px 0;
              }

              .feature-image {
                border-radius: 8px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <!-- Header Section -->
            <div class="header-section">
              <div class="header-content">
                <div class="brand-title">404monetizer.com</div>
                <div class="main-headline">TRANSFORM YOUR<br>ERROR PAGES</div>
                <div class="sub-headline">Turn 404s into Revenue 💰</div>
                <a href="https://404monetizer.com/dashboard" class="cta-primary">Get Started Now</a>
              </div>
            </div>
            
            <!-- Content Section -->
            <div class="content-section">
              <div class="greeting">Happy ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}, ${name}!</div>
              
              <div class="main-text">
                Welcome to 404 Monetizer! We're excited to have you join thousands of website owners who are already transforming their error pages into revenue-generating opportunities.
              </div>

              <!-- Key Stats -->
              <ul class="stats-list">
                <li><span class="stats-number">10,000+</span> websites already using 404 Monetizer</li>
                <li><span class="stats-number">$500K+</span> in revenue generated from error pages</li>
                <li><span class="stats-number">50+</span> monetization features available</li>
                <li><span class="stats-number">24/7</span> support ready to help you succeed</li>
                <li><span class="stats-number">15+</span> integrations with popular platforms</li>
              </ul>

              <div class="main-text">
                Whether you're just getting started or looking to optimize existing pages, it's time to unlock the hidden potential in every 404 error.
              </div>

              <!-- Analytics Feature -->
              <div class="feature-section">
                <img src="https://404monetizer.com/Analytics.png" alt="Advanced Analytics Dashboard" class="feature-image" />
                <h2 class="feature-title">Advanced Analytics & Insights</h2>
                <p class="feature-description">
                  Monitor every visitor, track conversions, and optimize your 404 pages with real-time analytics. 
                  See exactly how much revenue you're generating from error pages.
                </p>
              </div>

              <!-- Monetization Feature -->
              <div class="feature-section">
                <img src="https://404monetizer.com/Monetization.png" alt="Monetization Features" class="feature-image" />
                <h2 class="feature-title">Powerful Monetization Tools</h2>
                <p class="feature-description">
                  From affiliate links to email capture, product showcases to sponsored content - 
                  choose from 15+ monetization strategies to maximize your error page revenue.
                </p>
              </div>

              <!-- Pro Section -->
              <div class="pro-section">
                <div class="pro-badge">Pro Features</div>
                <h3 class="pro-title">Ready to 10x Your Results?</h3>
                
                <div class="highlight-text">
                  🚀 <strong>Limited Time:</strong> Upgrade to Pro and get exclusive access to AI-powered optimization, 
                  advanced targeting, and priority support. <em>More details coming soon!</em>
                </div>

                <a href="https://404monetizer.com/" class="cta-secondary">
                  Upgrade to Pro →
                </a>
              </div>

              <!-- Final CTA -->
              <div class="final-cta-section">
                <h3 class="final-cta-title">🎯 Ready to Transform Your 404s?</h3>
                <p class="final-cta-text">
                  Don't let another visitor leave empty-handed. Start monetizing your error pages today 
                  and see the difference it makes to your bottom line.
                </p>
                
                <a href="https://404monetizer.com/dashboard" class="cta-secondary">Access Dashboard</a>
                <a href="https://404monetizer.com/contact" class="cta-secondary">Get Support</a>
                
                <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                  Questions? We're here to help you succeed every step of the way.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p class="footer-text">This email was sent to ${email} because you signed up for 404 Monetizer.</p>
              <p class="footer-text">&copy; ${new Date().getFullYear()} 404 Monetizer. All rights reserved.</p>
              
              <div class="footer-links">
                <a href="https://404monetizer.com/unsubscribe" class="footer-link">Unsubscribe</a>
                <a href="https://404monetizer.com/privacy" class="footer-link">Privacy Policy</a>
                <a href="https://404monetizer.com/terms" class="footer-link">Terms of Service</a>
              </div>
              
              <p class="footer-text" style="margin-top: 15px;">
                404 Monetizer - Transform your 404 errors into revenue opportunities
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to 404 Monetizer!
      
      Happy ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}, ${name}!
      
      Welcome to 404 Monetizer! We're excited to have you join thousands of website owners who are already transforming their error pages into revenue-generating opportunities.
      
      🚀 KEY STATS:
      • 10,000+ websites already using 404 Monetizer
      • $500K+ in revenue generated from error pages  
      • 50+ monetization features available
      • 24/7 support ready to help you succeed
      • 15+ integrations with popular platforms
      
      📊 ADVANCED ANALYTICS & INSIGHTS
      Monitor every visitor, track conversions, and optimize your 404 pages with real-time analytics. See exactly how much revenue you're generating from error pages.
      
      💰 POWERFUL MONETIZATION TOOLS
      From affiliate links to email capture, product showcases to sponsored content - choose from 15+ monetization strategies to maximize your error page revenue.
      
      🚀 PRO FEATURES
      Ready to 10x Your Results? Upgrade to Pro and get exclusive access to AI-powered optimization, advanced targeting, and priority support.
      
      Ready to transform your 404s?
      Don't let another visitor leave empty-handed. Start monetizing your error pages today and see the difference it makes to your bottom line.
      
      Access your dashboard: https://404monetizer.com/dashboard
      Need support? Contact us: https://404monetizer.com/contact
      
      Best regards,
      The 404 Monetizer Team
      
      ---
      This email was sent to ${email}
      © ${new Date().getFullYear()} 404 Monetizer. All rights reserved.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending welcome promo email:', error);
    throw error;
  }
}; 