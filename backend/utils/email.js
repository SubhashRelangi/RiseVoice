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

export const sendApprovalEmail = async (toEmail, departmentName) => {
  const htmlContent = `
    <h1>RiseVoice - Department Account Approved</h1>
    <p>Dear ${departmentName || 'Department'},</p>
    <p>Your account has been approved by the admin.</p>
    <p>You can now log in to the system using the following link:</p>
    <a href="https://risevoice.vercel.app/department/login">Login to RiseVoice</a>
    <p><b>"Start service and make resolves in your area problems."</b></p>
    <p>Thank you for using RiseVoice.</p>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: 'RiseVoice - Department Account Approved',
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

export const sendRejectionEmail = async (toEmail, departmentName) => {
  const htmlContent = `
    <h1>RiseVoice - Department Account Rejected</h1>
    <p>Dear ${departmentName || 'Department'},</p>
    <p>Your account has been rejected by the admin.</p>
    <p>If you think this is a mistake, please contact our support team.</p>
    <p>Thank you for your interest in RiseVoice.</p>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: 'RiseVoice - Department Account Rejected',
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

export const sendPendingApprovalEmail = async (toEmail, departmentName, departmentId, location) => {
  const htmlContent = `
    <h1>RiseVoice - Account Pending Approval</h1>
    <p>Dear ${departmentName || 'Department'},</p>
    <p>Your email has been successfully verified for the department: <strong>${departmentName}</strong> (ID: ${departmentId}).</p>
    <p>Location: Latitude ${location.latitude}, Longitude ${location.longitude}</p>
    <p>Your account is now pending admin approval. We will notify you by email once the approval process is completed.</p>
    <p>Thank you for your patience.</p>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: 'RiseVoice - Account Pending Approval',
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

export const sendAdminLoginOTP = async (toEmail, otp) => {
  const htmlContent = `
    <h1>RiseVoice - Admin Login Verification</h1>
    <p>Dear Admin,</p>
    <p>Your One-Time Password (OTP) for login is: <strong>${otp}</strong></p>
    <p>This code will expire in 10 minutes.</p>
    <p>Please use this code to complete your login.</p>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: 'RiseVoice - Admin Login OTP',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending admin login OTP email:', error);
    return false;
  }
};