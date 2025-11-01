// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text'); // ✅ correct function import
const path = require('path');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Hassan Testing <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // 🏭 Production (e.g. Brevo / SendGrid)
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: process.env.BREVO_PORT,
        auth: {
          user: process.env.BREVO_LOGIN,
          pass: process.env.BREVO_PASSWORD,
        },
      });
    }

    // 🧪 Development (Mailtrap or local SMTP)
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    try {
      // 1️⃣ Render HTML from Pug template
      const html = pug.renderFile(
        path.join(__dirname, `../views/email/${template}.pug`),
        {
          firstName: this.firstName,
          url: this.url,
          subject,
        },
      );

      // 2️⃣ Define mail options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html), // ✅ simpler and widely supported
      };

      // 3️⃣ Send the email
      const info = await this.newTransport().sendMail(mailOptions);
      console.log(`✅ Email sent to ${this.to}: ${info.messageId}`);
    } catch (err) {
      console.error('❌ Email sending failed:', err.message);
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};
