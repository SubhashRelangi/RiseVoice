import nodemailer from 'nodemailer';

let transporter;

async function createTransporter() {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Use Gmail SMTP if credentials are provided
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('Using Gmail SMTP transporter.');
  } else {
    // Fallback to Ethereal test SMTP
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Using Ethereal test SMTP transporter.');
    console.log('Ethereal user:', testAccount.user);
    console.log('Ethereal pass:', testAccount.pass);
  }
}

// Initialize transporter once
createTransporter().catch(console.error);

export const sendEmail = async (to, subject, htmlContent) => {
  if (!transporter) {
    await createTransporter(); // Ensure transporter is created if not already
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'test@example.com', // Use a fallback sender if EMAIL_USER is not set
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    if (process.env.NODE_ENV !== 'production' && !process.env.EMAIL_USER) {
      // Log preview URL only if using Ethereal (no EMAIL_USER implies Ethereal fallback)
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Example usage (for testing purposes, can be removed later)
/*
(async () => {
  await sendEmail("department@example.com", "Department Verification Code", "<p>Your code is <b>483921</b></p>");
})();
*/