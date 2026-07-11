const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const BRAND_COLOR = "#4f46e5";
const APP_NAME = "Odoo hackatho-2026";

// Shared wrapper so every email looks consistent
const wrapEmail = (contentHtml) => `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding: 40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color:#ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.04); border: 1px solid #eef0f4;">

            <!-- Header -->
            <tr>
              <td style="padding: 28px 40px; border-bottom: 1px solid #f0f0f3;">
                <span style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.3px;">${APP_NAME}</span>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 36px 40px;">
                ${contentHtml}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 20px 40px; background-color: #fafafb; border-top: 1px solid #f0f0f3;">
                <p style="margin:0; color:#9ca3af; font-size: 12px; line-height: 18px;">
                  &copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.<br/>
                  This is an automated message, please don't reply to this email.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const sendOtpEmail = async (toEmail, otp) => {
  const content = `
    <h2 style="margin: 0 0 8px; color:#111827; font-size: 20px; font-weight: 700;">Password reset code</h2>
    <p style="margin: 0 0 28px; color:#6b7280; font-size: 14px; line-height: 22px;">
      Use the code below to reset your password. It expires in <strong style="color:#374151;">10 minutes</strong>.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 8px 0 32px;">
          <div style="display:inline-block; background-color:#f9fafb; border: 1px solid #eef0f4; border-radius: 12px; padding: 18px 28px;">
            <span style="font-size: 34px; font-weight: 700; letter-spacing: 10px; color: ${BRAND_COLOR};">${otp}</span>
          </div>
        </td>
      </tr>
    </table>

    <p style="margin:0; color:#9ca3af; font-size: 12px; line-height: 20px;">
      Didn't request this? You can safely ignore this email — your password won't be changed.
    </p>
  `;
  await transporter.sendMail({
    from: `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Your OTP Code - ${APP_NAME}`,
    html: wrapEmail(content),
  });
};

const sendVerificationEmail = async (toEmail, token) => {
  const verifyUrl = `http://localhost:5173/verify-email?token=${token}`;
  const content = `
    <h2 style="margin: 0 0 8px; color:#111827; font-size: 20px; font-weight: 700;">Verify your email</h2>
    <p style="margin: 0 0 28px; color:#6b7280; font-size: 14px; line-height: 22px;">
      Thanks for signing up! Click the button below to confirm your email address and activate your account.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 0 0 28px;">
          <a href="${verifyUrl}" style="background-color: ${BRAND_COLOR}; color: #ffffff; padding: 14px 36px; border-radius: 10px; text-decoration: none; font-size: 15px; font-weight: 600; display: inline-block;">
            Verify Email
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 6px; color:#6b7280; font-size: 12px;">Or paste this link into your browser:</p>
    <p style="margin:0 0 28px; color:${BRAND_COLOR}; font-size: 12px; word-break: break-all;">${verifyUrl}</p>

    <p style="margin:0; color:#9ca3af; font-size: 12px; line-height: 20px;">
      This link expires in <strong style="color:#6b7280;">24 hours</strong>. If you didn't create an account, you can safely ignore this email.
    </p>
  `;
  await transporter.sendMail({
    from: `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Verify your email - ${APP_NAME}`,
    html: wrapEmail(content),
  });
};

module.exports = { sendOtpEmail, sendVerificationEmail };
