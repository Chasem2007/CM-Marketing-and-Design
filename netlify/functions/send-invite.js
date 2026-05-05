/*
  =====================================================================
  SEND-INVITE — Netlify Serverless Function
  =====================================================================

  Sends a branded invitation / welcome email to a new client.
  Called in two situations:
    1. Admin manually sends an invite to a new (not-yet-signed-up) client
    2. Admin creates a client profile → auto "portal ready" email

  Data payload:
    name      string  — client's name (optional)
    email     string  — recipient email (required)
    siteUrl   string  — origin URL passed from the browser
    message   string  — optional personal note from admin
    welcome   bool    — true = "portal ready" mode, false = "you're invited" mode

  Uses the same SMTP env vars:
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
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

  const { name, email, siteUrl, message, welcome } = data;

  if (!email) {
    return { statusCode: 400, body: "Missing email" };
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log("SMTP not configured. Invite:", JSON.stringify(data));
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

  const greeting = name ? `Hi ${name},` : "Hello,";
  const portalUrl = siteUrl || "https://cmmarketingdesign.com";
  const displayUrl = portalUrl.replace(/^https?:\/\//, "");

  const subject = welcome
    ? `Your CM Marketing & Design portal is ready`
    : `You're invited to the CM Marketing & Design client portal`;

  const headline = welcome
    ? `Your Client Portal<br>is Ready`
    : `You're Invited to<br>Your Client Portal`;

  const bodyText = welcome
    ? `Your CM Marketing & Design client workspace has been set up. You can now log in to view your brand assets, invoices, contracts, project updates, and more.`
    : `CM Marketing & Design has set up a secure client portal for you. Once you sign in, you'll be able to access your brand assets, invoices, contracts, project updates, and more — all in one place.`;

  const ctaText = welcome ? "Open Your Portal →" : "Create Your Account →";

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f5f0e8;">
      <div style="background:#141414;padding:40px 32px;border-radius:12px 12px 0 0;text-align:center;">
        <div style="display:inline-block;font-size:11px;font-weight:700;color:#ddd2be;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px;border-bottom:1px solid rgba(221,210,190,0.2);padding-bottom:16px;">CM Marketing &amp; Design</div>
        <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;line-height:1.3;">${headline}</h1>
      </div>
      <div style="background:#ffffff;padding:40px 32px;border:1px solid #e0d8cc;border-top:none;border-radius:0 0 12px 12px;">
        <p style="font-size:16px;color:#2a2a2a;margin:0 0 16px;font-weight:600;">${greeting}</p>
        <p style="font-size:15px;color:#555;line-height:1.75;margin:0 0 28px;">${bodyText}</p>
        ${message ? `<div style="padding:16px 20px;background:#f8f6f1;border-radius:8px;font-size:14px;color:#555;line-height:1.7;margin:0 0 28px;border-left:3px solid #ddd2be;"><em>"${message}"</em></div>` : ""}
        <div style="text-align:center;margin:32px 0 36px;">
          <a href="${portalUrl}" style="background:#ddd2be;color:#141414;padding:16px 44px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;letter-spacing:0.02em;">${ctaText}</a>
        </div>
        ${!welcome ? `<p style="font-size:13px;color:#888;line-height:1.6;margin:0 0 8px;">On the site, click <strong>"Log In"</strong> to create your account. It only takes a minute.</p>` : ""}
        <p style="font-size:13px;color:#888;line-height:1.6;margin:0;">Have questions? Just reply to this email and we'll get back to you.</p>
        <div style="margin-top:36px;padding-top:24px;border-top:1px solid #f0ebe0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <span style="font-size:12px;color:#aaa;">CM Marketing &amp; Design</span>
          <a href="${portalUrl}" style="font-size:12px;color:#c9952c;text-decoration:none;">${displayUrl}</a>
        </div>
      </div>
    </div>`;

  const text = `${greeting}\n\n${bodyText}\n\n${message ? `"${message}"\n\n` : ""}Visit your portal: ${portalUrl}\n\nHave questions? Just reply to this email.`;

  try {
    await transporter.sendMail({
      from: `"CM Marketing & Design" <${SMTP_USER}>`,
      to: email,
      subject,
      html,
      text,
    });
    return { statusCode: 200, body: JSON.stringify({ message: "Invite sent" }) };
  } catch (error) {
    console.error("SMTP Error:", error.message);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to send invite" }) };
  }
};
