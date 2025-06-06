const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests are allowed');
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('Missing fields');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use a custom SMTP
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_app_password' // use App Password if using Gmail
    }
  });

  const mailOptions = {
    from: email,
    to: 'your_email@gmail.com', // where the message goes
    subject: `Message from ${name}`,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).send('Email sent successfully!');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Failed to send email');
  }
};
