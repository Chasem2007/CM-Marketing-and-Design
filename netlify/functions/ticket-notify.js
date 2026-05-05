/*
  =====================================================================
  TICKET-NOTIFY — Netlify Serverless Function
  =====================================================================

  Sends email notifications for ticket events:
    - new_ticket         : client submitted a ticket → notify admin
    - new_ticket_for_client : admin created a ticket for client → notify client
    - status_update      : admin changed ticket status → notify client
    - new_comment        : comment added → notify the other party

  Uses the same SMTP env vars as send-email.js:
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL
  =====================================================================
*/

const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: "Invalid request body" };
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !NOTIFY_EMAIL) {
    console.log("SMTP not configured. Ticket notification:", JSON.stringify(data));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Received (SMTP not configured)" }),
    };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587"),
    secure: parseInt(SMTP_PORT || "587") === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const wrap = (headerColor, headerTitle, headerSub, body) => `
    <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:${headerColor};padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:20px;">${headerTitle}</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">${headerSub}</p>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;">
        ${body}
      </div>
    </div>`;

  const row = (label, val) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;width:130px;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:15px;">${val}</td>
    </tr>`;

  let to, subject, html, text;

  if (data.type === "new_ticket") {
    to = NOTIFY_EMAIL;
    subject = `New Ticket: ${data.ticketTitle} — from ${data.clientName}`;
    html = wrap(
      "#3a3a3a",
      "New Support Ticket",
      "CM Marketing & Design — Client Portal",
      `<table style="width:100%;border-collapse:collapse;">
        ${row("From", data.clientName)}
        ${row("Email", `<a href="mailto:${data.clientEmail}" style="color:#c9952c;">${data.clientEmail}</a>`)}
        ${row("Title", `<strong>${data.ticketTitle}</strong>`)}
        ${row("Category", data.category)}
        ${row("Priority", data.priority)}
        ${data.ticketDescription ? row("Description", `<span style="white-space:pre-wrap;">${data.ticketDescription}</span>`) : ""}
      </table>
      <div style="margin-top:24px;padding:16px;background:#f8f6f1;border-radius:8px;font-size:13px;color:#666;">
        Log in to the admin portal to view and respond to this ticket.
      </div>`
    );
    text = `New ticket from ${data.clientName} (${data.clientEmail})\nTitle: ${data.ticketTitle}\nCategory: ${data.category}\nPriority: ${data.priority}\n${data.ticketDescription ? `\n${data.ticketDescription}` : ""}`;

  } else if (data.type === "new_ticket_for_client") {
    to = data.recipientEmail;
    subject = `New Ticket: ${data.ticketTitle}`;
    html = wrap(
      "#c9952c",
      "New Ticket Created for You",
      "CM Marketing & Design — Client Portal",
      `<p style="font-size:15px;color:#333;">Hi ${data.recipientName},</p>
      <p style="font-size:14px;color:#555;line-height:1.7;">A new ticket has been created for your account. Log in to your portal to view details and leave comments.</p>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Title", `<strong>${data.ticketTitle}</strong>`)}
        ${row("Category", data.category)}
        ${row("Priority", data.priority)}
        ${data.ticketDescription ? row("Description", `<span style="white-space:pre-wrap;">${data.ticketDescription}</span>`) : ""}
      </table>`
    );
    text = `A new ticket has been created for you.\nTitle: ${data.ticketTitle}\nCategory: ${data.category}\nPriority: ${data.priority}`;

  } else if (data.type === "status_update") {
    to = data.recipientEmail;
    const statusLabel = data.newStatus.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
    subject = `Ticket Update: "${data.ticketTitle}" is now ${statusLabel}`;
    html = wrap(
      "#c9952c",
      "Ticket Status Updated",
      "CM Marketing & Design — Client Portal",
      `<p style="font-size:15px;color:#333;">Hi ${data.recipientName},</p>
      <p style="font-size:14px;color:#555;line-height:1.7;">The status of your ticket has been updated.</p>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Ticket", `<strong>${data.ticketTitle}</strong>`)}
        ${row("New Status", `<strong style="color:#c9952c;">${statusLabel}</strong>`)}
      </table>
      <div style="margin-top:24px;padding:16px;background:#f8f6f1;border-radius:8px;font-size:13px;color:#666;">
        Log in to your client portal to view the full ticket and add comments.
      </div>`
    );
    text = `Your ticket "${data.ticketTitle}" status has changed to: ${statusLabel}`;

  } else if (data.type === "new_comment") {
    to = data.isAdminToClient ? data.recipientEmail : NOTIFY_EMAIL;
    subject = data.isAdminToClient
      ? `New Update on Your Ticket: "${data.ticketTitle}"`
      : `New Client Reply on Ticket: "${data.ticketTitle}"`;
    const intro = data.isAdminToClient
      ? `Hi ${data.recipientName},<br><br>CM Marketing & Design has left an update on your ticket.`
      : `${data.authorName} replied to a ticket.`;
    html = wrap(
      data.isAdminToClient ? "#c9952c" : "#3a3a3a",
      data.isAdminToClient ? "New Ticket Update" : "Client Replied to Ticket",
      "CM Marketing & Design — Client Portal",
      `<p style="font-size:14px;color:#555;line-height:1.7;">${intro}</p>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Ticket", `<strong>${data.ticketTitle}</strong>`)}
        ${row("From", data.authorName)}
      </table>
      <div style="margin:24px 0 0;padding:16px;background:#f8f6f1;border-radius:8px;font-size:14px;color:#333;white-space:pre-wrap;line-height:1.7;">${data.commentText}</div>`
    );
    text = `${data.authorName} commented on ticket "${data.ticketTitle}":\n\n${data.commentText}`;

  } else {
    return { statusCode: 400, body: "Unknown notification type" };
  }

  try {
    await transporter.sendMail({
      from: `"CM Marketing & Design" <${SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
    return { statusCode: 200, body: JSON.stringify({ message: "Email sent" }) };
  } catch (error) {
    console.error("SMTP Error:", error.message);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to send email" }) };
  }
};
