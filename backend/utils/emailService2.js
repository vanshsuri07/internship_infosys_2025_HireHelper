const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Password Reset Email
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    // FIX: Include the token in the URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request - Hire-a-Helper",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #4CAF50;
              margin: 0;
            }
            .content {
              background-color: white;
              padding: 25px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #4CAF50;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #45a049;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
            .warning {
              color: #ff6b6b;
              font-size: 14px;
              margin-top: 15px;
            }
            .token-info {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 12px;
              margin: 15px 0;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for your <strong>Hire-a-Helper</strong> account.</p>
              <p>Click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetURL}" class="button">Reset My Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4CAF50; background: #f0f0f0; padding: 10px; border-radius: 5px;">
                ${resetURL}
              </p>
              
              <div class="token-info">
                <strong>⚠️ Important:</strong>
                <ul style="margin: 5px 0; padding-left: 20px;">
                  <li>This link will expire in <strong>1 hour</strong></li>
                  <li>You can only use this link once</li>
                  <li>If you didn't request this, please ignore this email</li>
                </ul>
              </div>
              
              <p>If you have any questions or concerns, please contact our support team.</p>
              
              <p style="margin-top: 30px;">Best regards,<br><strong>The Hire-a-Helper Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>© 2024 Hire-a-Helper. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Plain text version
      text: `
Password Reset Request

Hello,

We received a request to reset your password for your Hire-a-Helper account.

Click this link to reset your password:
${resetURL}

Important:
- This link will expire in 1 hour
- You can only use this link once
- If you didn't request this, please ignore this email

Best regards,
The Hire-a-Helper Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent:", info.response);
    return { success: true, message: "Password reset email sent successfully" };
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    return { success: false, message: "Failed to send password reset email" };
  }
};

module.exports = { sendPasswordResetEmail };
