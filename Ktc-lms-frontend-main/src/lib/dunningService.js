// Automated dunning (reminder escalation) service
import { sendPaymentReminder, sendOverdueNotice } from "./messageService";

export const DUNNING_LEVELS = {
  0: { days: 0, name: "Not Due", severity: "none", action: null },
  1: { days: 5, name: "Polite Reminder", severity: "low", tone: "friendly" },
  2: { days: 15, name: "Urgent Reminder", severity: "medium", tone: "firm" },
  3: { days: 30, name: "Strict Notice", severity: "high", tone: "strict" },
};

// Calculate dunning level based on days overdue
export const calculateDunningLevel = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const daysOverdue = Math.floor((today - due) / (1000 * 60 * 60 * 24));

  if (daysOverdue < 5) return 0;
  if (daysOverdue < 15) return 1;
  if (daysOverdue < 30) return 2;
  return 3;
};

// Get dunning message based on level
export const getDunningMessage = (level, family) => {
  const messages = {
    1: {
      subject: "Fee Payment Reminder",
      whatsapp: `Hi! A friendly reminder: ${family.students.join(", ")}'s fee of ₹${family.totalDue.toLocaleString("en-IN")} is due. Could you please pay at your convenience? 📚`,
      email: `
        <p>Dear Parent,</p>
        <p>A friendly reminder about your child's school fees:</p>
        <p><strong>Amount:</strong> ₹${family.totalDue.toLocaleString("en-IN")}</p>
        <p><strong>Due Date:</strong> ${new Date(family.dueDate).toLocaleDateString("en-IN")}</p>
        <p>Please arrange payment at your earliest convenience.</p>
        <p>Thank you!</p>
      `,
    },
    2: {
      subject: "Urgent: Fee Payment Due",
      whatsapp: `⏰ URGENT: ${family.students.join(", ")}'s fee of ₹${family.totalDue.toLocaleString("en-IN")} is now overdue. Please settle immediately to avoid late fees. 🏫`,
      email: `
        <p>Dear Parent,</p>
        <p>Your child's school fees are now <strong>overdue</strong>:</p>
        <p><strong>Amount:</strong> ₹${family.totalDue.toLocaleString("en-IN")}</p>
        <p><strong>Overdue Since:</strong> ${new Date(family.dueDate).toLocaleDateString("en-IN")}</p>
        <p><strong>Action Required:</strong> Please settle the fee immediately.</p>
        <p>Late fees may apply if payment is not received within 3 days.</p>
      `,
    },
    3: {
      subject: "Final Notice: Settlement Required",
      whatsapp: `⚠️ FINAL NOTICE: ${family.students.join(", ")}'s fee of ₹${family.totalDue.toLocaleString("en-IN")} is severely overdue (${family.daysPastDue} days). Immediate action required. Contact office. 🏫`,
      email: `
        <p>Dear Parent,</p>
        <p>This is a <strong>FINAL NOTICE</strong> regarding outstanding fees:</p>
        <p><strong>Amount:</strong> ₹${family.totalDue.toLocaleString("en-IN")}</p>
        <p><strong>Days Overdue:</strong> ${family.daysPastDue} days</p>
        <p><strong>URGENT ACTION REQUIRED:</strong> Please settle your dues immediately.</p>
        <p>Failure to pay may result in suspension of services.</p>
        <p>Please contact the school office immediately.</p>
      `,
    },
  };

  return messages[level] || null;
};

// Send dunning message
export const sendDunningMessage = async (family, parentEmail, level) => {
  const message = getDunningMessage(level, family);
  if (!message) return { success: false, message: "Invalid dunning level" };

  try {
    const result = await Promise.all([
      // Send WhatsApp
      fetch("https://api.twilio.com/2010-04-01/Accounts", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${btoa(
            `${import.meta.env.VITE_TWILIO_ACCOUNT_SID}:${import.meta.env.VITE_TWILIO_AUTH_TOKEN}`
          )}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER,
          To: `whatsapp:${family.parentPhone}`,
          Body: message.whatsapp,
        }),
      }),
      // Send Email
      fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: parentEmail }], subject: message.subject }],
          from: { email: import.meta.env.VITE_SENDGRID_FROM_EMAIL },
          content: [{ type: "text/html", value: message.email }],
        }),
      }),
    ]);

    return { success: true, level, timestamp: new Date() };
  } catch (error) {
    console.error("Dunning error:", error);
    return { success: false, error: error.message };
  }
};

// Get families needing dunning based on current level
export const getFamiliesToDun = (families) => {
  return families.map((family) => {
    const currentLevel = calculateDunningLevel(family.dueDate);
    const lastSentLevel = family.lastDunningLevel || 0;

    return {
      ...family,
      currentLevel,
      lastSentLevel,
      needsDunning: currentLevel > lastSentLevel,
      nextAction: currentLevel > 0 ? DUNNING_LEVELS[currentLevel].name : "None",
    };
  });
};
