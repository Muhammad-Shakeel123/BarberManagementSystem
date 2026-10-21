import nodemailer from "nodemailer";
import logger from "../config/logger.js";

// Email configuration
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

class NotificationService {
  /**
   * Send email notification
   */
  static async sendEmail(to, subject, html, text = "") {
    try {
      const transporter = getTransporter();
      const mailOptions = {
        from: process.env.SMTP_USER || "noreply@barbershop.com",
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ""),
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (err) {
      logger.error(`Email sending failed: ${err.message}`);
      throw err;
    }
  }

  /**
   * Send appointment confirmation email
   */
  static async sendAppointmentConfirmation(appointment, customer, barber, branch) {
    const subject = `Appointment Confirmation - ${branch.name}`;
    const html = `
      <h2>Appointment Confirmed!</h2>
      <p>Dear ${customer.name},</p>
      <p>Your appointment has been confirmed.</p>
      <ul>
        <li><strong>Date:</strong> ${new Date(appointment.startTime).toLocaleString()}</li>
        <li><strong>Duration:</strong> ${Math.round((appointment.endTime - appointment.startTime) / 60000)} minutes</li>
        <li><strong>Barber:</strong> ${barber?.user?.name || "Not assigned"}</li>
        <li><strong>Branch:</strong> ${branch.name}</li>
        <li><strong>Services:</strong> ${appointment.serviceIds.map((s) => s.name).join(", ")}</li>
      </ul>
      <p>Thank you for choosing us!</p>
    `;

    return await this.sendEmail(customer.email, subject, html);
  }

  /**
   * Send appointment reminder
   */
  static async sendAppointmentReminder(appointment, customer) {
    const subject = `Reminder: Your appointment tomorrow`;
    const html = `
      <h2>Appointment Reminder</h2>
      <p>Dear ${customer.name},</p>
      <p>This is a reminder for your appointment tomorrow at <strong>${new Date(appointment.startTime).toLocaleString()}</strong>.</p>
      <p>Please arrive on time.</p>
    `;

    return await this.sendEmail(customer.email, subject, html);
  }

  /**
   * Send appointment cancellation notification
   */
  static async sendCancellationNotification(appointment, customer) {
    const subject = `Appointment Cancelled`;
    const html = `
      <h2>Appointment Cancelled</h2>
      <p>Dear ${customer.name},</p>
      <p>Your appointment scheduled for ${new Date(appointment.startTime).toLocaleString()} has been cancelled.</p>
      <p>If you didn't request this, please contact us immediately.</p>
    `;

    return await this.sendEmail(customer.email, subject, html);
  }

  /**
   * Send queue update notification
   */
  static async sendQueueUpdate(customer, position, estimatedWait) {
    const subject = `Queue Update`;
    const html = `
      <h2>Queue Status Update</h2>
      <p>Dear ${customer.name},</p>
      <p>Your current position in the queue is <strong>#${position}</strong>.</p>
      <p>Estimated wait time: ${Math.round(estimatedWait)} minutes.</p>
    `;

    return await this.sendEmail(customer.email, subject, html);
  }

  /**
   * Send SMS notification (mock - integrate with Twilio or similar)
   */
  static async sendSMS(phone, message) {
    // In production, use Twilio, Vonage, or any SMS provider
    logger.info(`SMS to ${phone}: ${message}`);
    return { success: true, message: "SMS sent (mock)" };
  }
}

export default NotificationService;
