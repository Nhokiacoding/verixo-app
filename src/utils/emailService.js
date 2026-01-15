// Email service utility for sending welcome emails and notifications

export const emailTemplates = {
  welcome: {
    subject: 'Welcome to VirtNum Marketplace! 🎉',
    html: (userData) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to VirtNum</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1, #8b5cf6, #6366f1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .logo { height: 60px; margin-bottom: 20px; }
          .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .button { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .features { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .feature-item { margin: 10px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://your-domain.com/images/logo.svg" alt="VirtNum Logo" class="logo">
            <h1>Welcome to VirtNum Marketplace!</h1>
            <p>Your trusted partner for virtual phone numbers</p>
          </div>
          
          <div class="content">
            <h2>Hello ${userData.firstName}! 👋</h2>
            
            <p>Thank you for joining Verixo! We're excited to have you as part of our community.</p>
            
            <p>Your account has been successfully created with the email: <strong>${userData.email}</strong></p>
            
            <div class="features">
              <h3>🚀 What you can do now:</h3>
              <div class="feature-item">✅ Get virtual numbers for WhatsApp, Telegram, Instagram, and more</div>
              <div class="feature-item">✅ Access numbers from 100+ countries worldwide</div>
              <div class="feature-item">✅ Enjoy 99.9% SMS delivery success rate</div>
              <div class="feature-item">✅ 24/7 customer support</div>
            </div>
            
            <div style="text-align: center;">
              <a href="https://your-domain.com/login" class="button">Start Using VirtNum</a>
            </div>
            
            <h3>🔐 Security Tips:</h3>
            <ul>
              <li>Keep your login credentials secure</li>
              <li>Enable two-factor authentication when available</li>
              <li>Never share your account details with others</li>
            </ul>
            
            <p>If you have any questions or need assistance, our support team is here to help!</p>
            
            <p>Best regards,<br>The VirtNum Team</p>
          </div>
          
          <div class="footer">
            <p>© 2025 VirtNum Marketplace. All rights reserved.</p>
            <p>If you didn't create this account, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  passwordReset: {
    subject: 'Reset Your Verixo Password 🔑',
    html: (resetData) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Verixo</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1, #8b5cf6, #6366f1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .button { display: inline-block; background: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .warning { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://your-domain.com/images/logo.svg" alt="VirtNum Logo" style="height: 60px; margin-bottom: 20px;">
            <h1>Password Reset Request</h1>
          </div>
          
          <div class="content">
            <h2>Reset Your Password</h2>
            
            <p>We received a request to reset the password for your VirtNum account associated with <strong>${resetData.email}</strong>.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetData.resetLink}" class="button">Reset My Password</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour for security reasons</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f8fafc; padding: 10px; border-radius: 4px; font-family: monospace;">
              ${resetData.resetLink}
            </p>
            
            <p>If you continue to have problems, contact our support team.</p>
            
            <p>Best regards,<br>The VirtNum Security Team</p>
          </div>
          
          <div class="footer">
            <p>© 2025 VirtNum Marketplace. All rights reserved.</p>
            <p>This is an automated security email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  adminWelcome: {
    subject: '🔐 Admin Access Granted - Verixo',
    html: (adminData) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Access Granted - VirtNum</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #ea580c, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .button { display: inline-block; background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .admin-badge { background: #fef2f2; border: 2px solid #dc2626; color: #dc2626; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: bold; margin: 10px 0; }
          .responsibilities { background: #fef9e7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://your-domain.com/images/logo.svg" alt="VirtNum Logo" style="height: 60px; margin-bottom: 20px;">
            <div class="admin-badge">🔐 ADMINISTRATOR ACCESS</div>
            <h1>Welcome, Admin ${adminData.firstName}!</h1>
          </div>
          
          <div class="content">
            <h2>Your Admin Access Has Been Approved</h2>
            
            <p>Congratulations! Your request for administrator privileges has been approved.</p>
            
            <p><strong>Admin Details:</strong></p>
            <ul>
              <li>Name: ${adminData.firstName} ${adminData.lastName}</li>
              <li>Email: ${adminData.email}</li>
              <li>Department: ${adminData.department}</li>
              <li>Employee ID: ${adminData.employeeId}</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="https://your-domain.com/admin/login" class="button">Access Admin Panel</a>
            </div>
            
            <div class="responsibilities">
              <h3>🛡️ Administrator Responsibilities:</h3>
              <ul>
                <li>Maintain confidentiality of all system data</li>
                <li>Follow security protocols and best practices</li>
                <li>Report any suspicious activities immediately</li>
                <li>Use admin privileges only for authorized purposes</li>
                <li>Keep your admin credentials secure</li>
              </ul>
            </div>
            
            <h3>🔑 Security Guidelines:</h3>
            <ul>
              <li>Change your password regularly</li>
              <li>Never share your admin credentials</li>
              <li>Log out when not actively using the system</li>
              <li>Report any security concerns to IT immediately</li>
            </ul>
            
            <p>If you have any questions about your admin privileges or need assistance, please contact the IT department.</p>
            
            <p>Best regards,<br>The VirtNum IT Team</p>
          </div>
          
          <div class="footer">
            <p>© 2025 VirtNum Marketplace. All rights reserved.</p>
            <p>This is a confidential administrative communication.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

// Mock email sending function (replace with actual email service)
export const sendEmail = async (to, template, data) => {
  try {
    // Validate inputs
    if (!to || !template || !data) {
      throw new Error('Missing required parameters: to, template, or data');
    }

    if (!emailTemplates[template]) {
      throw new Error(`Email template '${template}' not found`);
    }

    // In a real application, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer with SMTP
    
    console.log('📧 Sending email:', {
      to,
      subject: emailTemplates[template].subject,
      template,
      data
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful response
    return {
      success: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper functions for different email types
export const sendWelcomeEmail = async (userData) => {
  try {
    if (!userData || !userData.email || !userData.firstName) {
      throw new Error('Missing required user data: email and firstName are required');
    }
    return await sendEmail(userData.email, 'welcome', userData);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    if (!email || !resetLink) {
      throw new Error('Missing required parameters: email and resetLink are required');
    }
    return await sendEmail(email, 'passwordReset', { email, resetLink });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error: error.message };
  }
};

export const sendAdminWelcomeEmail = async (adminData) => {
  try {
    if (!adminData || !adminData.email || !adminData.firstName) {
      throw new Error('Missing required admin data: email and firstName are required');
    }
    return await sendEmail(adminData.email, 'adminWelcome', adminData);
  } catch (error) {
    console.error('Failed to send admin welcome email:', error);
    return { success: false, error: error.message };
  }
};
