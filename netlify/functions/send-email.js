/*
  =====================================================================
  SEND-EMAIL — Netlify Serverless Function
  =====================================================================
  
  This runs on Netlify's servers (not in the browser), so it can
  securely access your SMTP credentials without exposing them.
  
  When the contact form is submitted, it:
  1. Receives the form data via a POST request
  2. Connects to your SMTP server
  3. Sends a formatted email from your noreply address
  4. Returns success/failure to the browser
  
  SETUP: Add these environment variables in Netlify dashboard →
  Project → Configuration → Environment variables:
  
    SMTP_HOST    = smtp.gmail.com (or your email provider)
    SMTP_PORT    = 587
    SMTP_USER    = noreply@cmmarketingdesign.com
    SMTP_PASS    = your-app-password
    NOTIFY_EMAIL = your-personal@email.com
  =====================================================================
*/

const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  // Parse the form data from the request body
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: "Invalid request body" };
  }

  const { firstName, lastName, email, phone, company, services } = data;

  // Validate required fields
  if (!firstName || !lastName || !email) {
    return { statusCode: 400, body: "Missing required fields" };
  }

  // Read SMTP config from environment variables (set in Netlify dashboard)
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = process.env;

  // If SMTP isn't configured, fall back gracefully
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !NOTIFY_EMAIL) {
    console.log("SMTP not configured. Form submission:", JSON.stringify(data));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Received (SMTP not configured — check Netlify env vars)" }),
    };
  }

  // Create the email transporter (the connection to your email server)
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587"),
    secure: parseInt(SMTP_PORT || "587") === 465, // true for 465, false for 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  // Build a nicely formatted email
  const servicesText = services || "None specified";
  const htmlBody = `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #c9952c; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; color: #fff; font-size: 20px;">New Contact Form Submission</h1>
        <p style="margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">CM Marketing & Design</p>
      </div>
      <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; width: 130px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px; font-weight: 600;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px;"><a href="mailto:${email}" style="color: #c9952c;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px;">${phone || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Company</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 15px;">${company || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #888; font-size: 13px;">Services</td>
            <td style="padding: 10px 0; font-size: 15px;">${servicesText}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #f8f6f1; border-radius: 8px; font-size: 13px; color: #666;">
          Reply directly to this email to respond to <strong>${firstName}</strong> at <a href="mailto:${email}" style="color: #c9952c;">${email}</a>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"CM Marketing & Design" <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      replyTo: email, // So you can reply directly to the person
      subject: `New Inquiry from ${firstName} ${lastName} — ${servicesText}`,
      html: htmlBody,
      text: `New contact form submission:\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nCompany: ${company || "N/A"}\nServices: ${servicesText}`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("SMTP Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email. Check SMTP configuration." }),
    };
  }
};
