# Email Service Setup Guide

This guide will help you set up email functionality for InspectIQ using Resend, a free and reliable email service.

## Why Resend?

- **Free tier**: 3,000 emails/month free
- **Easy setup**: Simple API integration
- **Reliable delivery**: High deliverability rates
- **Professional**: Built by the team behind React Email
- **No credit card required** for free tier

## Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Click "Sign Up" 
3. Create account with your email
4. Verify your email address

## Step 2: Get API Key

1. Log into your Resend dashboard
2. Go to "API Keys" in the sidebar
3. Click "Create API Key"
4. Name it "InspectIQ Production" or similar
5. Copy the API key (starts with `re_`)

## Step 3: Add Domain (Optional but Recommended)

### Option A: Use Your Own Domain (Recommended)
1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `inspectiq.app`)
4. Follow DNS setup instructions
5. Verify domain

### Option B: Use Resend's Domain (Quick Start)
- Skip domain setup for now
- Emails will be sent from `onboarding@resend.dev`
- Update `EMAIL_DOMAIN=resend.dev` in your environment

## Step 4: Configure Environment Variables

Add these to your Railway environment variables:

```bash
RESEND_API_KEY=re_your_api_key_here
EMAIL_DOMAIN=inspectiq.app  # or resend.dev if using their domain
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Railway Setup:
1. Go to your Railway project dashboard
2. Click on your service
3. Go to "Variables" tab
4. Add the environment variables above

## Step 5: Test Email Functionality

1. Deploy your changes to Railway
2. Test password reset on your live site
3. Check Resend dashboard for email logs

## Email Templates Included

The system includes two professional email templates:

### 1. Password Reset Email
- **Trigger**: When user requests password reset
- **Features**: 
  - Professional design with InspectIQ branding
  - Secure reset link with 24-hour expiry
  - Security warnings and instructions
  - Mobile-responsive design

### 2. Welcome Email
- **Trigger**: When new user registers
- **Features**:
  - Welcome message with getting started guide
  - Feature highlights
  - Quick start instructions
  - Professional branding

## Customization Options

### Update Email Domain
Edit `config/settings.py`:
```python
email_domain: str = "yourdomain.com"
```

### Customize Email Templates
Edit `backend/services/email_service.py`:
- Modify HTML templates
- Update branding colors
- Change email content
- Add new email types

### Add New Email Types
Example - Order confirmation email:
```python
@staticmethod
async def send_order_confirmation(email: str, order_details: dict) -> bool:
    # Implementation here
    pass
```

## Monitoring and Analytics

### Resend Dashboard
- View email delivery status
- Track open rates and clicks
- Monitor bounce rates
- Debug delivery issues

### Application Logs
- Email sending attempts logged
- Error handling for failed sends
- Development mode fallbacks

## Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Check key starts with `re_`
   - Verify key is active in Resend dashboard
   - Ensure no extra spaces in environment variable

2. **Domain Not Verified**
   - Complete DNS setup in Resend
   - Wait for DNS propagation (up to 24 hours)
   - Use `resend.dev` domain temporarily

3. **Emails Not Received**
   - Check spam/junk folders
   - Verify email address is correct
   - Check Resend dashboard for delivery status

4. **Development Mode**
   - Without API key, system returns reset token in response
   - Check browser dev tools for token
   - Use token directly in reset URL

### Support
- Resend Documentation: [resend.com/docs](https://resend.com/docs)
- Resend Support: Available in dashboard
- InspectIQ Issues: Check application logs

## Security Best Practices

1. **API Key Security**
   - Never commit API keys to code
   - Use environment variables only
   - Rotate keys periodically

2. **Email Content**
   - Always use HTTPS links
   - Include security warnings
   - Set appropriate expiry times

3. **Domain Setup**
   - Use SPF, DKIM, and DMARC records
   - Monitor for domain spoofing
   - Keep DNS records updated

## Cost Management

### Free Tier Limits
- 3,000 emails/month
- 100 emails/day
- No credit card required

### Paid Plans (if needed)
- $20/month for 50,000 emails
- $80/month for 500,000 emails
- Enterprise options available

### Usage Monitoring
- Track usage in Resend dashboard
- Set up alerts for approaching limits
- Monitor email types and frequency

## Next Steps

1. ✅ Set up Resend account
2. ✅ Get API key
3. ✅ Configure environment variables
4. ✅ Deploy to Railway
5. ✅ Test password reset
6. ✅ Test user registration
7. 🔄 Set up custom domain (optional)
8. 🔄 Monitor email delivery

Your email system is now ready! Users will receive professional emails for password resets and welcome messages.