import nodemailer from "nodemailer";
// Create reusable transporter object using SMTP
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error("Email service connection failed:", error);
    }
    else {
        console.log("Email service is ready to send messages");
    }
});
// Function to send email
export const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `${process.env.EMAIL_USER}`,
            to,
            subject,
            text,
            html,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    }
    catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
};
