# Email Configuration Guide for Production

This guide explains how to configure email sending for the Bali Spa Guide application in production.

## Current Email Setup

The application sends two types of emails:
- **Customer Confirmation**: Sent to the customer's email address with booking details
- **Spa Notification**: Sent to `azlan@net1io.com` with customer and booking information

Email template locations:
- Customer email: `backend/emailService.js` (line 54-121)
- Spa email: `backend/emailService.js` (line 124-192)

---

## Option 1: Gmail (Quick Setup for Testing)

### Pros
- Free
- Easy to set up
- Good for testing and low-volume production

### Cons
- Daily sending limit (500 emails/day)
- May have deliverability issues with some providers
- Requires Google account

### Setup Steps

1. **Create or use an existing Gmail account**
   - Recommended: Create a dedicated account like `balispaguide@gmail.com`

2. **Enable 2-Factor Authentication**
   - Go to https://myaccount.google.com/security
   - Click on "2-Step Verification"
   - Follow the setup process

3. **Generate an App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Bali Spa Guide Backend"
   - Click "Generate"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

4. **Configure on the server**
   ```bash
   # SSH into your server
   ssh root@170.64.148.27

   # Navigate to backend directory
   cd ~/balispaguidw_react/backend

   # Create .env file
   nano .env
   ```

5. **Add these environment variables**
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   EMAIL_FROM="Bali Spa Guide <noreply@balispaguide.com>"
   ```

   **Important**:
   - Use the App Password (no spaces), NOT your regular Gmail password
   - The `EMAIL_FROM` name can be anything, but the actual sending address will be your Gmail

6. **Save and restart the backend**
   ```bash
   # Save the file (Ctrl+O, Enter, Ctrl+X in nano)

   # Restart the backend service
   pm2 restart bali-backend

   # Check logs to verify
   pm2 logs bali-backend --lines 20
   ```

7. **Test the configuration**
   - Make a test booking on the site
   - Check the PM2 logs: `pm2 logs bali-backend`
   - You should see: `✅ Customer email sent:` and `✅ Spa email sent:`

### Gmail Sending Limits
- **Free Gmail**: 500 emails/day
- **Google Workspace**: 2,000 emails/day

---

## Option 2: SendGrid (Professional Service)

### Pros
- Free tier: 100 emails/day forever
- Professional email service
- Better deliverability than Gmail
- Detailed analytics and tracking
- Scalable (paid plans available)

### Cons
- Requires account creation
- Slightly more complex setup
- Free tier limited to 100 emails/day

### Setup Steps

1. **Create a SendGrid account**
   - Go to https://signup.sendgrid.com/
   - Sign up for the free plan
   - Verify your email address

2. **Verify your sender identity**
   - Option A: **Single Sender Verification** (easiest for testing)
     - Go to Settings → Sender Authentication → Single Sender Verification
     - Click "Create New Sender"
     - Enter: `noreply@balispaguide.com` (or your domain)
     - Fill in your details
     - Verify the email they send you

   - Option B: **Domain Authentication** (recommended for production)
     - Go to Settings → Sender Authentication → Domain Authentication
     - Follow steps to add DNS records to your domain
     - This improves deliverability significantly

3. **Create an API Key**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name: "Bali Spa Guide Production"
   - Permissions: Select "Full Access" (or "Mail Send" only)
   - Click "Create & View"
   - **Copy the API key immediately** (it won't be shown again)
   - Example: `SG.aBcDeFgHiJkLmNoPqRsTuVwXyZ...`

4. **Configure on the server**
   ```bash
   # SSH into your server
   ssh root@170.64.148.27

   # Navigate to backend directory
   cd ~/balispaguidw_react/backend

   # Create .env file
   nano .env
   ```

5. **Add these environment variables**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=SG.aBcDeFgHiJkLmNoPqRsTuVwXyZ...
   EMAIL_FROM="Bali Spa Guide <noreply@balispaguide.com>"
   ```

   **Important**:
   - `EMAIL_USER` must be literally `apikey` (not your username)
   - `EMAIL_PASSWORD` is your SendGrid API key
   - `EMAIL_FROM` must match your verified sender or domain

6. **Save and restart the backend**
   ```bash
   # Save the file (Ctrl+O, Enter, Ctrl+X in nano)

   # Restart the backend service
   pm2 restart bali-backend

   # Check logs to verify
   pm2 logs bali-backend --lines 20
   ```

7. **Test the configuration**
   - Make a test booking on the site
   - Check the PM2 logs: `pm2 logs bali-backend`
   - You should see: `✅ Customer email sent:` and `✅ Spa email sent:`
   - Check SendGrid dashboard for email activity

### SendGrid Free Tier Limits
- **100 emails/day** forever free
- Email validation
- Basic analytics
- Upgrade available for higher volume

---

## Alternative Services

### AWS SES (Amazon Simple Email Service)
**Best for**: High volume, very low cost

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
EMAIL_USER=your-ses-smtp-username
EMAIL_PASSWORD=your-ses-smtp-password
EMAIL_FROM="Bali Spa Guide <noreply@yourdomain.com>"
```

**Pricing**: $0.10 per 1,000 emails (after free tier)
**Setup**: Requires AWS account, domain verification

### Mailgun
**Best for**: Developer-friendly API, good documentation

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASSWORD=your-mailgun-password
EMAIL_FROM="Bali Spa Guide <noreply@yourdomain.com>"
```

**Pricing**: Free tier 5,000 emails/month for 3 months
**Setup**: Requires domain verification

### Postmark
**Best for**: Transactional emails, high deliverability

```env
SMTP_HOST=smtp.postmarkapp.com
SMTP_PORT=587
EMAIL_USER=your-server-api-token
EMAIL_PASSWORD=your-server-api-token
EMAIL_FROM="Bali Spa Guide <noreply@yourdomain.com>"
```

**Pricing**: Free trial 100 emails, then $15/month for 10,000 emails
**Setup**: Very simple, excellent documentation

---

## Testing Email Configuration

### Method 1: Via Application
1. Go to your deployed site: http://170.64.148.27
2. Add a spa to cart
3. Complete booking with your real email
4. Click "Confirm Payment"
5. Check your email inbox for confirmation

### Method 2: Via Command Line
```bash
# SSH into server
ssh root@170.64.148.27

# Test the endpoint directly
curl -X POST -H 'Content-Type: application/json' \
  -d '{
    "userInfo": {
      "name": "Test User",
      "email": "your-test-email@example.com",
      "phone": "+1234567890"
    },
    "cartItems": [{
      "spaName": "Test Spa",
      "spaLocation": "Ubud",
      "treatment": "Massage",
      "date": "2025-12-20",
      "time": "10:00 AM",
      "quantity": 1,
      "price": 150000
    }]
  }' \
  http://localhost:4000/api/send-booking-emails

# Check the logs
pm2 logs bali-backend --lines 50
```

### Expected Log Output (Success)
```
✅ Customer email sent: <message-id@domain.com>
✅ Spa email sent: <message-id@domain.com>
```

### Expected Log Output (Not Configured)
```
⚠️  Email not configured. Skipping email notifications.
📧 Booking details would have been sent to:
   - Customer: customer@example.com
   - Spa: azlan@net1io.com
```

---

## Troubleshooting

### Emails not sending
1. **Check environment variables are set**
   ```bash
   ssh root@170.64.148.27
   cd ~/balispaguidw_react/backend
   cat .env
   ```

2. **Check PM2 logs for errors**
   ```bash
   pm2 logs bali-backend --err --lines 50
   ```

3. **Verify credentials are correct**
   - Gmail: Make sure you're using App Password, not regular password
   - SendGrid: Make sure API key is correct and has mail send permissions

4. **Check spam folder**
   - First emails from new senders often go to spam

### Common Errors

**"Invalid login: 535-5.7.8 Username and Password not accepted"**
- Gmail: You're using regular password instead of App Password
- Solution: Generate and use App Password

**"Connection timeout"**
- Server firewall blocking outbound SMTP (port 587)
- Solution: Check firewall rules, ensure port 587 is allowed

**"Sender address rejected"**
- SendGrid/other services: Sender not verified
- Solution: Complete sender verification in provider dashboard

---

## Security Best Practices

1. **Never commit `.env` file to git**
   - Already in `.gitignore`
   - Keep credentials secret

2. **Use environment variables, not hardcoded values**
   - ✅ Good: `process.env.EMAIL_PASSWORD`
   - ❌ Bad: Hardcoded password in code

3. **Use App Passwords for Gmail**
   - Never use your actual Gmail password
   - Revoke App Passwords you're not using

4. **Rotate credentials periodically**
   - Change API keys every 6-12 months
   - Especially if there's any security concern

5. **Monitor email sending**
   - Check logs regularly: `pm2 logs bali-backend`
   - Watch for unusual activity

---

## Customizing Email Content

### Change spa notification email address
Edit `backend/emailService.js` line 225:
```javascript
to: 'azlan@net1io.com',  // Change this to your email
```

### Customize email templates
Edit the HTML in `backend/emailService.js`:
- Customer email: Line 54-121 (`generateCustomerEmail`)
- Spa email: Line 124-192 (`generateSpaEmail`)

### Change sender name/email
Set in `.env`:
```env
EMAIL_FROM="Your Company Name <noreply@yourdomain.com>"
```

---

## Recommendations

### For Testing/Development
- **Use Gmail** (Option 1)
- Quick setup, free, good enough for testing
- 500 emails/day is plenty for testing

### For Production (Low Volume)
- **Use SendGrid** (Option 2)
- 100 emails/day free forever
- Better deliverability than Gmail
- Professional service with analytics

### For Production (High Volume)
- **Use AWS SES**
- Extremely cheap ($0.10 per 1,000 emails)
- Requires more setup but very scalable
- Good for 1,000+ emails/day

### For Maximum Deliverability
- **Verify your own domain**
- Use services like SendGrid or Postmark with domain verification
- Add SPF, DKIM, and DMARC records
- This prevents emails from going to spam

---

## Next Steps

1. **Choose an email service** (Gmail or SendGrid recommended)
2. **Follow the setup steps** above
3. **Configure `.env` file** on the server
4. **Restart the backend**: `pm2 restart bali-backend`
5. **Test with a real booking**
6. **Monitor logs**: `pm2 logs bali-backend`

For questions or issues, check the troubleshooting section or contact support.
