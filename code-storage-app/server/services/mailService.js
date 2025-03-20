const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

class MailService {
    static async sendEmail(to, subject, text) {
        try {
            const mailOptions = {
                from: process.env.SMTP_USER,
                to,
                subject,
                text
            };

            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

module.exports = MailService;