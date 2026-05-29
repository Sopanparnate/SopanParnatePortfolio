const Contact = require('../models/Contact');

const submitContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // --- Validate ---
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }

  try {
    // --- Always save to MongoDB first ---
    const contact = await Contact.create({ name, email, subject, message });
    console.log('Saved to DB:', contact._id);

    // --- Try email only if credentials look real ---
    const user = (process.env.EMAIL_USER || '').trim();
    const pass = (process.env.EMAIL_PASS || '').trim();

    const credentialsSet =
      user.length > 0 &&
      pass.length > 0 &&
      user !== 'your_email@gmail.com' &&
      pass !== 'your_app_password' &&
      user.includes('@');

    if (credentialsSet) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || 'gmail',
          auth: { user, pass },
        });
        await transporter.sendMail({
          from: user,
          to: process.env.EMAIL_RECEIVER || user,
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> ${message}</p>
          `,
        });
        console.log('Email sent successfully.');
      } catch (mailErr) {
        console.warn('Email failed (non-critical):', mailErr.message);
        // Do NOT return error — DB save already succeeded
      }
    } else {
      console.log('Email skipped — add real credentials to .env to enable.');
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: contact,
    });

  } catch (err) {
    console.error('DB error:', err.message);
    return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
};

module.exports = { submitContact };
