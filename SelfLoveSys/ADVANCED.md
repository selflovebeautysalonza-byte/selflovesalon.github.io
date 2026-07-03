# Advanced Configuration Guide

Customize your Self-Love booking website beyond the basics.

## 🎨 Advanced Styling

### Change Service Duration Times

In `script.js`, modify the `SERVICE_DURATIONS` object:

```javascript
const SERVICE_DURATIONS = {
    'hair': 240,      // 4 hours instead of 3
    'nails': 120,     // 2 hours instead of 1.5
    'lashes': 60,     // 1 hour instead of 1.5
    'combo': 360      // 6 hours instead of 5
};
```

### Adjust Booking Window

In `script.js`, find `setupDatePicker()` function:

```javascript
// Change 90 to any number of days
maxDate.setDate(maxDate.getDate() + 90);
```

### Change Business Hours

Modify time slots in `index.html` (around line 150):

```html
<option value="09:00">9:00 AM</option>
<option value="10:00">10:00 AM</option>
<!-- Add/remove as needed -->
<option value="19:00">7:00 PM</option>
<option value="20:00">8:00 PM</option>
```

### Add More Services

In `index.html`, add to the Services section:

```html
<div class="service-card">
    <div class="service-icon">💄</div>
    <h3>Makeup</h3>
    <p>Professional makeup services for any occasion</p>
    <ul>
        <li>Bridal Makeup</li>
        <li>Event Makeup</li>
        <li>Makeup Lessons</li>
    </ul>
</div>
```

In `script.js`, add to `SERVICE_DURATIONS`:

```javascript
'makeup': 120,  // 2 hours
```

In `index.html`, add to service options in booking form:

```html
<option value="makeup">Makeup (2 hours)</option>
```

## 💳 Payment Integration

### Stripe Integration (Recommended)

1. Sign up at [stripe.com](https://stripe.com)
2. Get your publishable key from dashboard

3. Add Stripe script to `index.html` (before closing </body>):

```html
<script src="https://js.stripe.com/v3/"></script>
```

4. Add payment section to booking form:

```html
<div id="card-element" class="payment-input"></div>
<div id="card-errors" role="alert"></div>
```

5. In `script.js`, handle payment:

```javascript
const stripe = Stripe('YOUR_PUBLISHABLE_KEY');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// In form submission, add:
const {token} = await stripe.createToken(cardElement);
// Send token to backend to charge customer
```

### PayPal Integration

1. Sign up at [paypal.com/developers](https://developer.paypal.com/)
2. Get your client ID

3. Add PayPal script to `index.html`:

```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
```

4. Create payment button container:

```html
<div id="paypal-button-container"></div>
```

## 🔔 SMS Notifications (Twilio)

Send customers SMS reminders:

1. Sign up at [twilio.com](https://www.twilio.com)
2. Get API credentials

3. Backend example (Node.js):

```javascript
const twilio = require('twilio');
const client = twilio('ACCOUNT_SID', 'AUTH_TOKEN');

app.post('/api/send-sms', (req, res) => {
    client.messages.create({
        body: `Hi! Reminder: You have an appointment at Self-Love on ${date} at ${time}`,
        from: 'YOUR_TWILIO_NUMBER',
        to: req.body.phone
    }).then(message => {
        res.json({ success: true });
    });
});
```

## 📊 Analytics

### Google Analytics

1. Go to [google.com/analytics](https://www.google.com/analytics)
2. Create a new property
3. Get your Measurement ID
4. Add to `index.html` (in <head>):

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Track Booking Events:

In `script.js`, add to form submission:

```javascript
gtag('event', 'booking_complete', {
    service: formData.service,
    date: formData.date
});
```

## 📱 Social Media Integration

### Instagram Feed

1. Get Instagram access token from [instagram-access-token.com](https://instagram-access-token.com)
2. Add to `index.html`:

```html
<section id="instagram" class="instagram">
    <h2>Follow Us on Instagram</h2>
    <div id="instagram-feed"></div>
</section>
```

3. In `script.js`:

```javascript
fetch(`https://graph.instagram.com/me/media?fields=media_type,media_url,caption&access_token=YOUR_TOKEN`)
    .then(r => r.json())
    .then(data => {
        // Display images in grid
    });
```

### WhatsApp Link

Add to contact section:

```html
<a href="https://wa.me/1234567890?text=Hi%20Self-Love,%20I'd%20like%20to%20book%20an%20appointment!">
    💬 Chat on WhatsApp
</a>
```

## 🗄️ Database Integration

Store bookings in a real database instead of just local storage:

### Firebase (Easy - No backend needed)

1. Create project at [firebase.google.com](https://firebase.google.com)
2. Add to `index.html`:

```html
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"></script>
```

3. In `script.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    projectId: "YOUR_PROJECT_ID",
    // ... other config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveBookingLocally(formData) {
    await addDoc(collection(db, 'bookings'), {
        ...formData,
        confirmedAt: new Date()
    });
}
```

### Traditional Backend (Node.js + MongoDB)

```javascript
// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://...');

const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    service: String,
    date: String,
    time: String,
    notes: String,
    confirmedAt: Date
});

const Booking = mongoose.model('Booking', bookingSchema);

app.post('/api/bookings', async (req, res) => {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ success: true });
});

app.listen(3000);
```

## 🔐 Authentication

Add customer login/account system:

### Simple Password Protection

```javascript
// In script.js
function requireLogin() {
    const password = prompt('Enter salon code:');
    if (password !== '1234') {
        alert('Access denied');
        return false;
    }
    return true;
}

document.getElementById('bookingForm').addEventListener('submit', (e) => {
    if (!requireLogin()) e.preventDefault();
});
```

### Firebase Authentication

```javascript
import { getAuth, signInWithPassword } from 'firebase/auth';

const auth = getAuth();
auth.signInWithPassword(email, password)
    .then(user => console.log('Logged in'))
    .catch(error => console.log('Error:', error));
```

## 🎯 Advanced Features

### Customer Dashboard

```html
<div id="customer-dashboard" style="display:none;">
    <h2>My Bookings</h2>
    <div id="my-bookings"></div>
    <h2>Reschedule</h2>
    <div id="reschedule-form"></div>
    <h2>Cancel</h2>
    <button onclick="cancelBooking()">Cancel Last Booking</button>
</div>
```

### Automated Reminders

Send email/SMS reminders 24 hours before appointment:

```javascript
function scheduleReminders() {
    const bookings = JSON.parse(localStorage.getItem('self_love_bookings'));
    const now = new Date();
    
    bookings.forEach(booking => {
        const appointmentTime = new Date(`${booking.date}T${booking.time}`);
        const reminderTime = new Date(appointmentTime.getTime() - 24 * 60 * 60000);
        
        if (now >= reminderTime && !booking.reminderSent) {
            sendReminder(booking);
            booking.reminderSent = true;
        }
    });
    
    localStorage.setItem('self_love_bookings', JSON.stringify(bookings));
}

// Run every hour
setInterval(scheduleReminders, 3600000);
```

### Booking Cancellation

```javascript
function cancelBooking(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('self_love_bookings'));
    const booking = bookings.find(b => b.id === bookingId);
    
    if (booking) {
        booking.status = 'cancelled';
        booking.cancelledAt = new Date().toISOString();
        localStorage.setItem('self_love_bookings', JSON.stringify(bookings));
        
        // Remove from Google Calendar
        deleteCalendarEvent(booking.googleEventId);
    }
}
```

## 🚀 Performance Optimization

### Image Optimization

1. Compress images: [tinypng.com](https://tinypng.com)
2. Use WebP format
3. Lazy load images:

```html
<img src="image.jpg" loading="lazy" alt="Description">
```

### Caching

Add to `index.html`:

```html
<meta http-equiv="cache-control" content="max-age=3600">
```

### Service Worker (Offline Support)

Create `sw.js`:

```javascript
self.addEventListener('install', () => {
    caches.open('v1').then(cache => {
        cache.addAll(['/', '/index.html', '/styles.css', '/script.js']);
    });
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
```

Register in `script.js`:

```javascript
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
```

## 📧 Advanced Email Templates

### Custom Email with Logo

```javascript
const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Appointment Confirmed - Self-Love Salon',
    html: `
        <table width="100%">
            <tr>
                <td align="center">
                    <img src="https://yoursite.com/logo.png" width="200" alt="Self-Love">
                </td>
            </tr>
            <tr>
                <td>
                    <h2>Appointment Confirmed!</h2>
                    <p>Hi ${name},</p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Time:</strong> ${time}</p>
                    <p><strong>Service:</strong> ${service}</p>
                </td>
            </tr>
        </table>
    `
};
```

---

These advanced features can be added incrementally. Start with the basics and add complexity as needed!
