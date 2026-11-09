# WhatsApp & Email Integration Setup Guide

This guide explains how to set up real WhatsApp and Email notifications for the fees management system.

## 📋 Prerequisites

You'll need accounts with:
1. **Twilio** (for WhatsApp)
2. **SendGrid** (for Email)

## 🚀 Step 1: Twilio WhatsApp Setup

### 1.1 Create Twilio Account
- Go to https://www.twilio.com/
- Sign up for a free trial account
- Get your **Account SID** and **Auth Token**

### 1.2 Enable WhatsApp on Twilio
1. Log in to Twilio Console
2. Go to **Messaging → Try it out → Send a WhatsApp message**
3. Follow the setup wizard:
   - Choose a number or use sandbox number `+14155238886` (provided by Twilio)
   - Send yourself a test message from WhatsApp to confirm
4. Message back the confirmation code to activate your number

### 1.3 Get Your WhatsApp Sandbox Number
- Twilio provides: `whatsapp:+14155238886` (sandbox for testing)
- For production: Get a dedicated WhatsApp Business Account number

### 1.4 Add Recipient Numbers
- In Twilio Console → Messaging → Try it out
- Add phone numbers to the whitelist
- Numbers must include country code (e.g., `+919876543210`)

## 📧 Step 2: SendGrid Email Setup

### 2.1 Create SendGrid Account
- Go to https://sendgrid.com/
- Sign up for a free account (up to 100 emails/day)
- Verify your email

### 2.2 Generate API Key
1. Log in to SendGrid Dashboard
2. Go to **Settings → API Keys**
3. Click **Create API Key**
4. Name it: `KTC-School-API`
5. Select **Full Access** for testing
6. Copy and save the API key

### 2.3 Verify Sender Email
1. Go to **Settings → Sender Authentication**
2. Click **Verify a Single Sender**
3. Enter your school email: `noreply@ktcschool.com` (or use your email for testing)
4. Follow the verification link sent to your email

## 🔑 Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Twilio WhatsApp Configuration
VITE_TWILIO_ACCOUNT_SID=your_account_sid_here
VITE_TWILIO_AUTH_TOKEN=your_auth_token_here
VITE_TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# SendGrid Email Configuration
VITE_SENDGRID_API_KEY=your_sendgrid_api_key_here
VITE_SENDGRID_FROM_EMAIL=noreply@ktcschool.com

# School Configuration
VITE_SCHOOL_NAME=Kendriya Vidyalaya
VITE_SCHOOL_EMAIL=principal@ktcschool.com
VITE_SCHOOL_PHONE=+919876543210
```

### ⚠️ Security Notes:
- **Never commit `.env.local` to git** (it's already in `.gitignore`)
- Regenerate API keys if accidentally exposed
- Use restricted API keys in production
- Consider using a backend proxy instead of exposing keys from frontend

## 🧪 Testing the Integration

### Test WhatsApp Reminder
1. Go to Admin Dashboard → Fees
2. Scroll to "Top Overdue Families"
3. Click "Send Reminder" for any family
4. You should receive a WhatsApp message within 10 seconds

### Test Email Notification
1. Complete a payment in the parent dashboard
2. Check your email inbox for the receipt
3. Also check spam folder if not found

### Test Bulk Reminders
1. Click "Send All Reminders" button
2. All overdue families will receive messages simultaneously

## 📊 Integration Points

### WhatsApp Messages Sent:
1. **Payment Reminder** - When principal sends reminder to overdue family
2. **Payment Receipt** - After parent completes payment
3. **Overdue Notice** - Automated escalation for past-due fees

### Email Messages Sent:
1. **Payment Reminder** - HTML formatted fee reminder
2. **Payment Receipt** - Transaction confirmation with details
3. **Overdue Notice** - Professional debt collection notice

## 🔄 API Endpoints Used

### Twilio API
```
POST https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json
```

### SendGrid API
```
POST https://api.sendgrid.com/v3/mail/send
```

## ⚡ Features Implemented

### For Parents:
- ✅ Automatic receipt via WhatsApp after payment
- ✅ Payment receipt via email
- ✅ Fee reminders via WhatsApp & Email
- ✅ Overdue notices via WhatsApp & Email

### For Admin/Principal:
- ✅ Send individual reminders to overdue families
- ✅ Bulk send reminders to all overdue families
- ✅ Track message delivery status
- ✅ Visual feedback when message is sent

## 🚨 Troubleshooting

### "WhatsApp not configured" warning
- Check that `VITE_TWILIO_ACCOUNT_SID` and `VITE_TWILIO_AUTH_TOKEN` are set
- Verify `.env.local` file is in the root directory
- Restart the development server after adding env vars

### "Invalid phone number" error
- Ensure phone numbers include country code: `+91XXXXXXXXXX`
- Whitelisted numbers in Twilio sandbox must be exactly as registered
- Check for any spaces or special characters

### Email not received
- Check spam folder
- Verify "From" email is registered in SendGrid
- Check SendGrid Activity log for delivery status
- Ensure API key has "Mail Send" permission

### CORS errors
- Twilio and SendGrid support CORS requests from browser
- If issues persist, create a backend proxy endpoint
- Never expose API keys in production frontend code

## 📚 Documentation Links

- **Twilio**: https://www.twilio.com/docs/messaging/channels/whatsapp
- **SendGrid**: https://docs.sendgrid.com/for-developers/sending-email/api-getting-started
- **Axios CORS**: https://axios-http.com/docs/intro

## 🔐 Production Recommendations

For production use:

1. **Use a Backend Server**
   - Keep API keys secure on backend
   - Frontend calls backend endpoints
   - Backend calls Twilio/SendGrid APIs

2. **Example Node.js Backend**
   ```javascript
   // /api/send-reminder
   app.post('/api/send-reminder', async (req, res) => {
     const { phone, message } = req.body;
     // Use Twilio SDK on backend
     await twilio.messages.create({
       from: 'whatsapp:+14155238886',
       to: `whatsapp:${phone}`,
       body: message
     });
   });
   ```

3. **Use Environment-Specific Keys**
   - Development: Sandbox keys from Twilio/SendGrid
   - Production: Paid accounts with proper limits

4. **Add Rate Limiting**
   - Limit API calls per minute/hour
   - Prevent abuse of bulk send feature

5. **Add Message Templates**
   - Use SendGrid templates for consistent formatting
   - Store message templates in database

## 📝 Next Steps

1. Set up Twilio and SendGrid accounts
2. Add credentials to `.env.local`
3. Test individual reminders
4. Test payment receipts
5. Test bulk send feature
6. Deploy to production with backend proxy

---

**Need Help?** Contact Twilio or SendGrid support for account issues.
