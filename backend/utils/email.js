import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendVerificationEmail = async (toEmail, code, departmentId, departmentName) => {
  const htmlContent = `
    <h1>RiseVoice - Department Email Verification</h1>
    <p>Dear ${departmentName || 'Department'},</p>
    <p>Your Department ID is: <strong>${departmentId}</strong></p>
    <p>Your verification code is: <strong>${code}</strong></p>
    <p>This code will expire in 10 minutes.</p>
    <p>Thank you for registering with RiseVoice.</p>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: 'RiseVoice - Department Email Verification',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};