# Self-Love Beauty Salon - Booking Website

A modern, sleek, and easy-to-navigate booking website for your Self-Love beauty salon offering hair installations, nails, and lashes services.

## Features

✨ **Sleek & Modern Design**
- Premium gradient color scheme (gold and charcoal)
- Smooth animations and transitions
- Responsive design for all devices
- Elegant typography and spacing

📅 **Smart Booking System**
- Real-time availability checking
- Google Calendar integration to prevent double bookings
- Multiple time slots throughout the day
- Service-based duration calculation

📱 **Easy Navigation**
- Sticky navigation bar
- Smooth scrolling between sections
- Mobile-friendly interface
- Quick action buttons

⭐ **Testimonials Section**
- Display real client reviews and ratings
- Easy to manage with JSON file
- Professional showcase of your work

🔗 **Contact & Location**
- Business hours and location info
- Direct phone and email links
- Professional contact section

## File Structure

```
SelfLoveSys/
├── index.html          # Main website markup
├── styles.css          # All styling and animations
├── script.js           # Booking logic and Google Calendar integration
├── testimonials.json   # Your client testimonials (edit this!)
├── README.md           # This file
└── SETUP_GOOGLE_CALENDAR.md  # Setup instructions for Google Calendar
```

## Image assets

I've added placeholder folders and SVG placeholders for images you will add later:

- assets/images/profile/placeholder.svg
- assets/images/hair-installation/placeholder.svg
- assets/images/nails/placeholder.svg
- assets/images/lashes/placeholder.svg
- assets/images/nails-cluster-lashes/placeholder.svg

Place your real images in those folders and update `index.html` image references accordingly.

## Getting Started

### 1. Basic Setup
- Edit contact information in `index.html` (phone, email, hours)
- Update your business details in the Contact section

### 2. Add Your Testimonials
Edit `testimonials.json` with real client reviews:

```json
{
  "testimonials": [
    {
      "name": "Sarah Johnson",
      "service": "Hair Installation",
      "rating": 5,
      "text": "Amazing service! The hair was installed perfectly and looks gorgeous!"
    },
    {
      "name": "Jessica Martinez",
      "service": "Nails",
      "rating": 5,
      "text": "My nails look stunning! Best salon experience ever."
    }
  ]
}
```

### 3. Google Calendar Integration Setup
See `SETUP_GOOGLE_CALENDAR.md` for detailed instructions on:
- Creating a Google Cloud Project
- Setting up the Calendar API
- Getting your API Key and Calendar ID
- Connecting to your booking system

### 4. Deploy Website
You can deploy this website to:
- **Vercel**: Free hosting with instant deployment
- **Netlify**: Easy drag-and-drop deployment
- **GitHub Pages**: Free static hosting
- **Your own server**: Use any web hosting service

## Customization

### Colors
Edit the `:root` variables in `styles.css`:
```css
:root {
    --primary-color: #d4a574;      /* Gold accent */
    --secondary-color: #2a2a2a;    /* Dark background */
    --accent-color: #e8d5c4;       /* Light accent */
    --success-color: #6dd5ce;      /* Green for success */
}
```

### Business Hours
Update opening hours in the Contact section of `index.html`

### Service Durations
Edit `SERVICE_DURATIONS` in `script.js`:
```javascript
const SERVICE_DURATIONS = {
    'hair': 180,      // 3 hours
    'nails': 90,      // 1.5 hours
    'lashes': 90,     // 1.5 hours
    'combo': 300      // 5 hours
};
```

### Booking Constraints
- Minimum booking: Today
- Maximum booking: 90 days ahead
- Closed on Sundays (can be changed in `script.js`)

## How It Works

### Booking Flow
1. Customer selects date and service
2. System checks existing bookings in Google Sheets
3. Available time slots are displayed
4. Customer confirms booking
5. Booking is saved to Google Sheets
6. Confirmation appears on screen

### Conflict Prevention
- Bookings are blocked by service duration
- Overlapping date/time ranges are prevented
- Google Sheets is the shared booking source

### Data Storage
- Primary: Google Sheets
- Backup: Browser LocalStorage
- Bookings persist across page refreshes and can be shared across devices when backend is online

## Google Sheets Backend
Use `SETUP_GOOGLE_SHEETS.md` and `google_apps_script_backend.gs` to deploy the backend and connect `script.js` to your spreadsheet.

## Email Confirmations
Email confirmations are not included in this current version.

## Security Notes

⚠️ **Important**: 
- Your Google API Key in production should have IP restrictions
- Use OAuth2 for the Google Calendar write functionality in production
- Never expose your Calendar ID publicly without restriction
- Consider implementing a backend server to handle sensitive operations

## Mobile Responsiveness

The website is fully responsive:
- **Desktop**: Full layout with side-by-side booking form and available slots
- **Tablet**: Optimized grid layout
- **Mobile**: Single column layout, touch-friendly buttons

## Browser Compatibility

Works on:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Bookings not showing as unavailable?
- Check that Google API Key is correct
- Ensure Calendar ID is properly set
- Check browser console for error messages

### Time slots not appearing?
- Make sure a date and service are selected
- Check that date is between today and 90 days ahead
- Verify browser JavaScript is enabled

### Emails not sending?
- Set up EmailJS or backend email service
- Check spam/trash folder for emails
- Verify email address in booking form

## Support & Next Steps

### To make this production-ready:
1. ✅ Add your real testimonials
2. ✅ Set up Google Calendar integration
3. ✅ Configure email service
4. ✅ Add your business image/logo
5. ✅ Deploy to a hosting service
6. ✅ Set up custom domain

### Additional Features (Optional):
- Payment processing (Stripe, PayPal)
- Client login / booking history
- SMS notifications
- Social media integration
- Gallery section
- Blog/tips section

---

**Created with ❤️ for Self-Love Beauty Salon**

For updates or questions, refer to the detailed setup guides included in this repository.
