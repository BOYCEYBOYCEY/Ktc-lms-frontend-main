import axios from "axios";

const TWILIO_API_URL = "https://api.twilio.com/2010-04-01/Accounts";
const SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";

const twilioAccountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const twilioAuthToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER;
const sendgridApiKey = import.meta.env.VITE_SENDGRID_API_KEY;
const sendgridFromEmail = import.meta.env.VITE_SENDGRID_FROM_EMAIL;

// Twilio WhatsApp Service
export const sendWhatsAppMessage = async (toPhoneNumber, message) => {
  try {
    if (!twilioAccountSid || !twilioAuthToken) {
      console.warn("⚠️ Twilio credentials not configured");
      return { success: false, message: "Twilio not configured" };
    }

    const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

    const formData = new URLSearchParams();
    formData.append("From", twilioWhatsAppNumber);
    formData.append("To", `whatsapp:${toPhoneNumber}`);
    formData.append("Body", message);

    const response = await axios.post(
      `${TWILIO_API_URL}/${twilioAccountSid}/Messages.json`,
      formData,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("✅ WhatsApp message sent:", response.data.sid);
    return { success: true, messageId: response.data.sid };
  } catch (error) {
    console.error("❌ WhatsApp send error:", error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

// SendGrid Email Service
export const sendEmailNotification = async (toEmail, subject, htmlContent) => {
  try {
    if (!sendgridApiKey) {
      console.warn("⚠️ SendGrid API key not configured");
      return { success: false, message: "SendGrid not configured" };
    }

    const emailPayload = {
      personalizations: [
        {
          to: [{ email: toEmail }],
          subject: subject,
        },
      ],
      from: {
        email: sendgridFromEmail,
        name: "KTC School",
      },
      content: [
        {
          type: "text/html",
          value: htmlContent,
        },
      ],
    };

    const response = await axios.post(SENDGRID_API_URL, emailPayload, {
      headers: {
        Authorization: `Bearer ${sendgridApiKey}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Email send error:", error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

// Combined message service (WhatsApp + Email)
export const sendPaymentReminder = async (parentPhone, parentEmail, studentName, amount, dueDate) => {
  const whatsappMessage = `Hi! Fee reminder for ${studentName}: ₹${amount.toLocaleString(
    "en-IN"
  )} due by ${dueDate}. Pay now on KTC Portal. 📚💳`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>📚 Fee Payment Reminder</h2>
      <p>Dear Parent,</p>
      <p>This is a friendly reminder about your child's school fees:</p>
      <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Student:</strong> ${studentName}</p>
        <p><strong>Amount Due:</strong> ₹${amount.toLocaleString("en-IN")}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
      </div>
      <p>Please pay at your earliest convenience through the KTC Portal.</p>
      <p>Thank you!</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        This is an automated message. Please do not reply.
      </p>
    </div>
  `;

  const results = await Promise.all([
    sendWhatsAppMessage(parentPhone, whatsappMessage),
    sendEmailNotification(parentEmail, "Fee Payment Reminder", emailHtml),
  ]);

  return {
    whatsapp: results[0],
    email: results[1],
  };
};

// Send payment receipt
export const sendPaymentReceipt = async (parentPhone, parentEmail, studentName, amount, transactionId, paymentDate) => {
  const whatsappMessage = `✅ Payment received! ₹${amount.toLocaleString(
    "en-IN"
  )} for ${studentName}. Transaction ID: ${transactionId}. Thank you! 📲`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>✅ Payment Confirmation</h2>
      <p>Dear Parent,</p>
      <p>Your payment has been successfully received.</p>
      <div style="background: #f0fff4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #48bb78;">
        <p><strong>Student:</strong> ${studentName}</p>
        <p><strong>Amount:</strong> ₹${amount.toLocaleString("en-IN")}</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Date:</strong> ${paymentDate}</p>
      </div>
      <p>Thank you for your prompt payment!</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        This is an automated receipt. Please do not reply.
      </p>
    </div>
  `;

  const results = await Promise.all([
    sendWhatsAppMessage(parentPhone, whatsappMessage),
    sendEmailNotification(parentEmail, "Payment Receipt - KTC School", emailHtml),
  ]);

  return {
    whatsapp: results[0],
    email: results[1],
  };
};

// Overdue notice
export const sendOverdueNotice = async (parentPhone, parentEmail, students, totalAmount, daysPastDue) => {
  const studentList = students.join(", ");
  const whatsappMessage = `⚠️ Overdue fees for ${studentList}: ₹${totalAmount.toLocaleString(
    "en-IN"
  )} (${daysPastDue} days overdue). Please settle immediately. 🏫`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>⚠️ Overdue Fee Notice</h2>
      <p>Dear Parent,</p>
      <p>We have outstanding fees that require immediate attention:</p>
      <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f56565;">
        <p><strong>Students:</strong> ${studentList}</p>
        <p><strong>Total Amount Due:</strong> ₹${totalAmount.toLocaleString("en-IN")}</p>
        <p><strong>Days Overdue:</strong> ${daysPastDue} days</p>
      </div>
      <p style="color: #e53e3e; font-weight: bold;">
        Please settle your dues at the earliest to avoid any inconvenience.
      </p>
      <p>Contact the office if you need assistance.</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        This is an automated message. Please do not reply.
      </p>
    </div>
  `;

  const results = await Promise.all([
    sendWhatsAppMessage(parentPhone, whatsappMessage),
    sendEmailNotification(parentEmail, "Urgent: Overdue Fee Notice", emailHtml),
  ]);

  return {
    whatsapp: results[0],
    email: results[1],
  };
};
