import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendAppointmentEmail(appointment: {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate?: Date | null;
  appointmentTime?: string | null;
  messageEn?: string | null;
  serviceName?: string | null;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const transporter = getTransporter();

  if (!transporter || !adminEmail) {
    console.log("[email] SMTP not configured — skipping email notification");
    return;
  }

  const dateStr = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not specified";

  const timeStr = appointment.appointmentTime || "Not specified";

  const adminHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
      <div style="background:#16a34a;padding:16px 24px;border-radius:6px 6px 0 0;margin:-24px -24px 24px;">
        <h2 style="color:#fff;margin:0;font-size:18px;">New Appointment Request</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#6b7280;width:140px;">Patient Name</td><td style="padding:8px 0;font-weight:600;">${appointment.patientName}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Phone</td><td style="padding:8px 0;">${appointment.patientPhone}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;">${appointment.patientEmail}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Date</td><td style="padding:8px 0;">${dateStr}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Time</td><td style="padding:8px 0;">${timeStr}</td></tr>
        ${appointment.serviceName ? `<tr><td style="padding:8px 0;color:#6b7280;">Service</td><td style="padding:8px 0;">${appointment.serviceName}</td></tr>` : ""}
        ${appointment.messageEn ? `<tr><td style="padding:8px 0;color:#6b7280;vertical-align:top;">Message</td><td style="padding:8px 0;">${appointment.messageEn}</td></tr>` : ""}
      </table>
      <p style="margin-top:24px;font-size:13px;color:#9ca3af;">Log in to your admin panel to confirm or manage this appointment.</p>
    </div>
  `;

  const patientHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
      <div style="background:#16a34a;padding:16px 24px;border-radius:6px 6px 0 0;margin:-24px -24px 24px;">
        <h2 style="color:#fff;margin:0;font-size:18px;">Appointment Confirmation</h2>
      </div>
      <p>Dear <strong>${appointment.patientName}</strong>,</p>
      <p>Thank you for booking an appointment with us. We have received your request and will confirm it shortly.</p>
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:6px;padding:12px;">
        <tr><td style="padding:8px 12px;color:#6b7280;width:120px;">Date</td><td style="padding:8px 12px;font-weight:600;">${dateStr}</td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280;">Time</td><td style="padding:8px 12px;font-weight:600;">${timeStr}</td></tr>
        ${appointment.serviceName ? `<tr><td style="padding:8px 12px;color:#6b7280;">Service</td><td style="padding:8px 12px;">${appointment.serviceName}</td></tr>` : ""}
      </table>
      <p style="margin-top:20px;">If you have any questions, feel free to contact us.</p>
      <p style="color:#6b7280;font-size:13px;margin-top:24px;">AyuClinic &mdash; Ayurvedic Treatment &amp; Wellness</p>
    </div>
  `;

  await Promise.allSettled([
    transporter.sendMail({
      from: `"AyuClinic" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Appointment: ${appointment.patientName} — ${dateStr}`,
      html: adminHtml,
    }),
    transporter.sendMail({
      from: `"AyuClinic" <${process.env.SMTP_USER}>`,
      to: appointment.patientEmail,
      subject: "Appointment Request Received — AyuClinic",
      html: patientHtml,
    }),
  ]);

  console.log(`[email] Appointment emails sent for ${appointment.patientName}`);
}
