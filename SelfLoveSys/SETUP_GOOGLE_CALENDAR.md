# Google Calendar Integration Setup Guide

This guide will help you set up Google Calendar integration for your Self-Love booking system to prevent double bookings.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on "Select a Project" at the top
4. Click "NEW PROJECT"
5. Enter project name: "Self-Love Salon Bookings"
6. Click "CREATE"
7. Wait for the project to be created

## Step 2: Enable Google Calendar API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Calendar API"
3. Click on it
4. Click "ENABLE"

## Step 3: Create API Credentials

### For Web (Recommended for this setup):

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. A dialog will show your API key - **COPY THIS**
4. Click "Close"

### Your API Key:
```
Paste your API key here: _______________________________
```

**IMPORTANT**: In production, restrict this key:
- Click on your API key in the credentials list
- Go to "API restrictions"
- Select "Google Calendar API" only
- Go to "Application restrictions"
- Select "HTTP referrers"
- Add your website domain (e.g., `yourdomain.com/*`)

## Step 4: Find Your Google Calendar ID

1. Go to [Google Calendar](https://calendar.google.com/)
2. On the left sidebar, find "My calendars"
3. Hover over your calendar and click the three-dot menu
4. Select "Settings"
5. Scroll down to "Integrate calendar"
6. Copy the "Calendar ID" (looks like: `your-email@gmail.com` or a long ID)

### Your Calendar ID:
```
Paste your Calendar ID here: _______________________________
```

## Step 5: Update Your Website Files

### Edit `script.js`:

Find these lines at the top:
```javascript
const GOOGLE_CALENDAR_API_KEY = 'YOUR_GOOGLE_API_KEY';
const CALENDAR_ID = 'YOUR_CALENDAR_ID';
```

Replace with your actual values:
```javascript
const GOOGLE_CALENDAR_API_KEY = 'AIzaSy...YourActualKeyHere...';
const CALENDAR_ID = 'youremail@gmail.com';
```

## Step 6: Test the Integration

1. Open your website
2. Select a date and service
3. Click "Book Appointment"
4. Check if available times appear
5. Submit a test booking
6. Check your Google Calendar - the event should appear!

## Setting Up Email Confirmations (EmailJS Method)

### Easy Setup with EmailJS:

1. Go to [emailjs.com](https://www.emailjs.com)
2. Click "Sign Up Free"
3. Create account with your email
4. Go to "Admin" panel
5. Note your **User ID** (top right)

### Create Email Service:

1. Go to "Email Services"
2. Click "Add Service"
3. Choose "Gmail" (or your email provider)
4. Connect your email account
5. Name it something like "Gmail Service"
6. Copy the **Service ID**

### Create Email Template:

1. Go to "Email Templates"
2. Click "Create New Template"
3. Fill in template:

**Template Name**: `booking_confirmation`

**Subject**: `Your Self-Love Salon Appointment Confirmation`

**Content**:
```
Hello {{to_name}},

Thank you for booking with Self-Love Beauty Salon!

Appointment Details:
- Date: {{date}}
- Time: {{time}}
- Service: {{service}}
- Technician will contact you if we need to reschedule

If you need to reschedule or cancel, please contact us:
📞 (123) 456-7890
📧 info@selflove.com

We look forward to seeing you!

Best regards,
Self-Love Team
```

4. Click "Save"
5. Copy the **Template ID**

### Update script.js:

In `script.js`, find the email sending section and uncomment it:

```javascript
// In the sendConfirmationEmail function, uncomment:
emailjs.init('YOUR_USER_ID'); // Add at top of script.js

emailjs.send('YOUR_SERVICE_ID', 'booking_confirmation', {
    to_email: formData.email,
    to_name: formData.name,
    service: formData.service,
    date: formData.date,
    time: formData.time
});
```

Replace with your actual IDs:
- `YOUR_USER_ID`: From EmailJS admin panel
- `YOUR_SERVICE_ID`: Service ID from email services
- `booking_confirmation`: Template name

## Setting Up Email Confirmations (Backend Method)

If you prefer using your own backend server:

### Simple Node.js + Express Example:

```javascript
// Install: npm install express nodemailer
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password' // Use app password, not regular password
    }
});

app.post('/api/send-confirmation', async (req, res) => {
    const { email, name, date, time, service } = req.body;

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your Self-Love Salon Appointment Confirmation',
        html: `
            <h2>Appointment Confirmed!</h2>
            <p>Hi ${name},</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p>If you need to reschedule, call us at (123) 456-7890</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json({ success: true });
        }
    });
});

app.listen(3000);
```

## Preventing Double Bookings - How It Works

The system automatically:

1. **Checks calendar** when user selects a date
2. **Calculates service duration** based on service type:
   - Hair Installation: 3 hours
   - Nails: 1.5 hours
   - Lashes: 1.5 hours
   - Combo: 5 hours

3. **Blocks time slots** that overlap with existing bookings
4. **Prevents submission** if conflict detected

### Example:
- If someone books Hair Installation (3 hours) at 2:00 PM
- The slots at 2:00, 3:00, and 4:00 PM are blocked for that day
- Next available slot would be 5:00 PM

## Production Checklist

Before going live:

- [ ] API Key has IP/referrer restrictions
- [ ] Calendar ID is correct
- [ ] Email service is configured and tested
- [ ] Website is on HTTPS (required for security)
- [ ] Tested booking flow end-to-end
- [ ] Verified Google Calendar integration works
- [ ] Confirmed emails are being sent
- [ ] Added real testimonials
- [ ] Updated contact information
- [ ] Tested on mobile devices

## Troubleshooting

### Events not appearing in Google Calendar?
- Verify API Key is correct
- Check Calendar ID format
- Ensure Google Calendar API is enabled
- Check browser console for error messages

### Available slots not showing?
- Confirm API Key is working
- Try refreshing the page
- Check that events exist in Google Calendar
- Verify dates are in the correct format

### API Key Issues?
- Keys can take a few minutes to activate
- Verify in Google Cloud Console that Calendar API is enabled
- Check for typos in your key
- Regenerate if needed

### Email not working?
- Verify email service is connected
- Check spam/junk folder
- Ensure email template is correct
- Test with your own email first

## Security Best Practices

1. **Never commit credentials to version control**
2. **Use environment variables** for API keys
3. **Set API restrictions** in Google Cloud
4. **Use HTTPS** on production
5. **Validate all input** on backend
6. **Regenerate API keys** if compromised
7. **Monitor API usage** in Google Cloud Console
8. **Keep backups** of bookings

## Support Resources

- [Google Calendar API Docs](https://developers.google.com/calendar)
- [EmailJS Docs](https://www.emailjs.com/docs/)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**Congratulations!** Your booking system is now connected to Google Calendar! 🎉

For additional features or modifications, reach out to your development team.
