import nodemailer from 'nodemailer';

export async function sendVerificationEmail(to: string, token: string) {
  // Skip email sending in development if SMTP is not configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log('📧 Email sending skipped (SMTP not configured)');
    console.log(`📧 Verification token for ${to}: ${token}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@saba.app',
    to,
    subject: 'Email Verification',
    html: `<p>გთხოვთ დაადასტუროთ თქვენი ელფოსტა:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
  });
}
