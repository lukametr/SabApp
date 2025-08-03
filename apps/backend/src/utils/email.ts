import nodemailer from 'nodemailer';

export async function sendVerificationEmail(to: string, token: string) {
  // In development, skip email sending if SMTP is not configured
  if (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_HOST || !process.env.EMAIL_USER)) {
    console.log('📧 Email sending skipped (SMTP not configured)');
    console.log(`📧 Verification token for ${to}: ${token}`);
    return;
  }

  // In production, require email configuration
  if (process.env.NODE_ENV === 'production' && (!process.env.EMAIL_HOST || !process.env.EMAIL_USER)) {
    throw new Error('Email configuration is required in production');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@sabapp.com',
    to,
    subject: 'Email Verification',
    html: `<p>გთხოვთ დაადასტუროთ თქვენი ელფოსტა:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
  });
}
