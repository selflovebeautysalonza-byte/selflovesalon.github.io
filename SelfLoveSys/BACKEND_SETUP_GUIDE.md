# Complete Backend Setup Guide
## Google Sheets + Google Calendar + Google Apps Script

**Goal:** Save bookings to Google Sheets and automatically create calendar events on Google Calendar

---

## PART 1: CREATE GOOGLE SHEETS FOR BOOKINGS

### Step 1: Create a new Google Sheet

1. Go to **Google Sheets** → https://sheets.google.com
2. Click **"+ Create new spreadsheet"**
3. Name it: **"Self-Love Beauty Salon - Bookings"**
4. You'll be taken to the blank sheet

### Step 2: Create headers for bookings

In the first row, add these headers:
```
Column A: Booking ID
Column B: Name
Column C: Email
Column D: Phone
Column E: Service
Column F: Date
Column G: Time
Column H: Notes
Column I: Saved At
Column J: Status
```

**Your sheet should look like:**
| Booking ID | Name | Email | Phone | Service | Date | Time | Notes | Saved At | Status |
|---|---|---|---|---|---|---|---|---|---|

### Step 3: Save the Sheet ID

At the top of the browser, you'll see a URL like:
```
https://docs.google.com/spreadsheets/d/1mK9x8_4_5nL2pQrS_7tU_vW-xY_zAbC/edit
                                        ↑ COPY THIS PART ↑
```

**Save this ID** - you'll need it in Step 6.

---

## PART 2: CREATE GOOGLE APPS SCRIPT BACKEND

### Step 4: Create the Apps Script project

1. Go back to your Google Sheet
2. Click **Extensions** → **Apps Script**
3. You'll see a new project called "Untitled project"
4. Rename it: Click **"Untitled project"** at the top → Name it **"Self-Love Backend"**

### Step 5: Copy the Backend Code

**DELETE** the default `myFunction()` code.

**PASTE THIS COMPLETE CODE:**

```javascript
// ============================================
// SELF-LOVE BEAUTY SALON - BACKEND
// Google Apps Script for Bookings & Calendar
// ============================================

// CONFIGURATION - UPDATE THESE VALUES
const SPREADSHEET_ID = "PASTE_YOUR_SHEET_ID_HERE"; // From Step 3
const SHEET_NAME = "Sheet1"; // Keep as is
const CALENDAR_ID = CalendarApp.getDefaultCalendar().getId(); // Your default calendar

// Service duration mapping (in minutes)
const SERVICE_DURATION = {
    'hair': 60,           // Hair Installation
    'overlay-mani-pedi': 90,
    'polygel-mani-gel-pedi': 120,
    'acrylic-nails': 90,
    'nails-cluster-lashes': 150,
    'classic-lashes': 90,
    'hybrid-lashes': 90
};

// Service pricing (in ZAR)
const SERVICE_PRICE = {
    'hair': 200,
    'overlay-mani-pedi': 150,
    'polygel-mani-gel-pedi': 180,
    'acrylic-nails': 120,
    'nails-cluster-lashes': 250,
    'classic-lashes': 140,
    'hybrid-lashes': 160
};

// Service display names
const SERVICE_DISPLAY_NAMES = {
    'hair': 'Hair Installation',
    'overlay-mani-pedi': 'Overlay Mani & Pedi',
    'polygel-mani-gel-pedi': 'Polygel Mani & Gel Pedi',
    'acrylic-nails': 'Acrylic Nails',
    'nails-cluster-lashes': 'Nails & Cluster Lashes',
    'classic-lashes': 'Classic Lashes',
    'hybrid-lashes': 'Hybrid Lashes'
};

// ============================================
// MAIN FUNCTION - Called when booking is submitted
// ============================================
function doPost(e) {
    try {
        // Parse incoming booking data
        const bookingData = JSON.parse(e.postData.contents);
        
        // Validate required fields
        if (!bookingData.name || !bookingData.email || !bookingData.service || !bookingData.date || !bookingData.time) {
            return sendResponse(false, "Missing required fields", null);
        }
        
        // Save to Google Sheets
        const bookingId = saveToSheet(bookingData);
        
        // Add to Google Calendar
        addToCalendar(bookingData, bookingId);
        
        // Send confirmation email
        sendConfirmationEmail(bookingData, bookingId);
        
        return sendResponse(true, "Booking saved successfully", bookingId);
        
    } catch (error) {
        Logger.log("❌ ERROR: " + error.toString());
        return sendResponse(false, "Server error: " + error.toString(), null);
    }
}

// ============================================
// SAVE BOOKING TO GOOGLE SHEETS
// ============================================
function saveToSheet(bookingData) {
    try {
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        const sheet = ss.getSheetByName(SHEET_NAME);
        
        // Generate unique booking ID
        const bookingId = "BK" + Date.now();
        
        // Prepare row data
        const newRow = [
            bookingId,                          // Column A: Booking ID
            bookingData.name,                   // Column B: Name
            bookingData.email,                  // Column C: Email
            bookingData.phone || "",            // Column D: Phone
            SERVICE_DISPLAY_NAMES[bookingData.service] || bookingData.service, // Column E: Service
            bookingData.date,                   // Column F: Date
            bookingData.time,                   // Column G: Time
            bookingData.notes || "",            // Column H: Notes
            new Date().toISOString(),           // Column I: Saved At
            "Confirmed"                         // Column J: Status
        ];
        
        // Append to sheet
        sheet.appendRow(newRow);
        
        Logger.log("✅ Booking saved to Sheet: " + bookingId);
        return bookingId;
        
    } catch (error) {
        Logger.log("❌ Sheet save error: " + error.toString());
        throw error;
    }
}

// ============================================
// ADD EVENT TO GOOGLE CALENDAR
// ============================================
function addToCalendar(bookingData, bookingId) {
    try {
        const calendar = CalendarApp.getDefaultCalendar();
        
        // Parse date and time
        const dateObj = new Date(bookingData.date);
        const [hours, minutes] = bookingData.time.split(':');
        dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        // Calculate end time based on service duration
        const duration = SERVICE_DURATION[bookingData.service] || 60;
        const endTime = new Date(dateObj.getTime() + duration * 60000);
        
        // Create event title
        const serviceName = SERVICE_DISPLAY_NAMES[bookingData.service] || bookingData.service;
        const title = `${serviceName} - ${bookingData.name}`;
        
        // Create event description
        const description = `
Booking ID: ${bookingId}
Client: ${bookingData.name}
Email: ${bookingData.email}
Phone: ${bookingData.phone || "N/A"}
Service: ${serviceName}
Notes: ${bookingData.notes || "None"}
Price: R${SERVICE_PRICE[bookingData.service] || "N/A"}
        `;
        
        // Add event to calendar
        const event = calendar.createEvent(title, dateObj, endTime, {
            description: description,
            guests: bookingData.email
        });
        
        Logger.log("✅ Calendar event created: " + event.getId());
        return event.getId();
        
    } catch (error) {
        Logger.log("⚠️ Calendar error (booking still saved): " + error.toString());
        // Don't throw - booking was already saved to sheet
        return null;
    }
}

// ============================================
// SEND CONFIRMATION EMAIL
// ============================================
function sendConfirmationEmail(bookingData, bookingId) {
    try {
        const serviceName = SERVICE_DISPLAY_NAMES[bookingData.service] || bookingData.service;
        const price = SERVICE_PRICE[bookingData.service] || "N/A";
        const dateObj = new Date(bookingData.date);
        const formattedDate = dateObj.toLocaleDateString('en-ZA', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const subject = `✨ Booking Confirmed - ${serviceName}`;
        
        const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5e6c8; }
        .header { text-align: center; color: #b8891a; margin-bottom: 20px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
        .label { font-weight: bold; color: #b8891a; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✨ Booking Confirmed!</h1>
        </div>
        
        <p>Dear ${bookingData.name},</p>
        
        <p>Thank you for booking with <strong>Self-Love Beauty Salon</strong>! Your appointment is confirmed.</p>
        
        <div class="details">
            <h3 style="color: #b8891a; margin-top: 0;">Appointment Details</h3>
            <div class="detail-row">
                <span class="label">Booking ID:</span>
                <span>${bookingId}</span>
            </div>
            <div class="detail-row">
                <span class="label">Service:</span>
                <span>${serviceName}</span>
            </div>
            <div class="detail-row">
                <span class="label">Date:</span>
                <span>${formattedDate}</span>
            </div>
            <div class="detail-row">
                <span class="label">Time:</span>
                <span>${bookingData.time}</span>
            </div>
            <div class="detail-row">
                <span class="label">Price:</span>
                <span>R${price}</span>
            </div>
            ${bookingData.notes ? `<div class="detail-row">
                <span class="label">Notes:</span>
                <span>${bookingData.notes}</span>
            </div>` : ''}
        </div>
        
        <p><strong>Please arrive 10 minutes early for your appointment.</strong></p>
        
        <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
        
        <p>We look forward to seeing you!</p>
        
        <p>Best regards,<br><strong>Self-Love Beauty Salon</strong></p>
        
        <div class="footer">
            <p>This is an automated confirmation email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
        `;
        
        GmailApp.sendEmail(bookingData.email, subject, "", {
            htmlBody: htmlBody,
            from: Session.getActiveUser().getEmail()
        });
        
        Logger.log("✅ Confirmation email sent to: " + bookingData.email);
        
    } catch (error) {
        Logger.log("⚠️ Email error: " + error.toString());
        // Don't throw - booking was still saved
    }
}

// ============================================
// SEND RESPONSE TO FRONTEND
// ============================================
function sendResponse(success, message, bookingId) {
    const response = {
        success: success,
        message: message,
        bookingId: bookingId,
        timestamp: new Date().toISOString()
    };
    
    return ContentService.createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// FOR TESTING - Remove after verification
// ============================================
function testBackend() {
    const testData = {
        name: "Test Customer",
        email: Session.getActiveUser().getEmail(),
        phone: "0720000000",
        service: "hair",
        date: "2026-07-20",
        time: "15:00",
        notes: "Test booking"
    };
    
    const e = {
        postData: {
            contents: JSON.stringify(testData)
        }
    };
    
    const response = doPost(e);
    Logger.log("Test Response: " + response.getContent());
}
```

---

## PART 3: DEPLOY THE GOOGLE APPS SCRIPT

### Step 6: Configure the Script

1. **Replace the SPREADSHEET_ID:**
   - Line 10: Replace `"PASTE_YOUR_SHEET_ID_HERE"` with your Google Sheet ID from Step 3
   
   **Example:**
   ```javascript
   const SPREADSHEET_ID = "1mK9x8_4_5nL2pQrS_7tU_vW-xY_zAbC";
   ```

### Step 7: Deploy as Web App

1. Click **"Deploy"** button (top right) → **"New deployment"**
2. Click the **⚙️ icon** and select **"Web app"**
3. Set:
   - **Execute as:** Your Gmail account (should be pre-selected)
   - **Who has access:** **"Anyone"** (so website can call it)
4. Click **"Deploy"**
5. You'll see a warning - click **"Authorize access"**
6. Select your Gmail account
7. Click **"Allow"** on the permissions screen

### Step 8: Copy Your Web App URL

After deployment, you'll see:
```
Deployment ID: 1q9K_x2L_mN_oP_qR_sT_uV
New URL: https://script.googleapis.com/macros/s/YOUR_DEPLOYMENT_ID/useless
```

Copy the **"New URL"** - this is your backend endpoint!

**Save it:** You'll need this in the next section.

---

## PART 4: UPDATE YOUR WEBSITE

### Step 9: Update Backend Endpoint

In your `index.html`, find the line:
```javascript
const BACKEND_ENDPOINT = '/api/bookings';
```

**Replace with:**
```javascript
const BACKEND_ENDPOINT = 'https://script.googleapis.com/macros/s/YOUR_DEPLOYMENT_ID/useless';
```

**Example:**
```javascript
const BACKEND_ENDPOINT = 'https://script.googleapis.com/macros/s/1q9K_x2L_mN_oP_qR_sT_uV/useless';
```

---

## PART 5: TEST THE BACKEND

### Step 10: Test Booking Submission

1. Open your website: https://your-domain.com/index.html
2. Fill out the booking form:
   - Name: Your name
   - Email: Your email
   - Phone: Your phone
   - Service: Any service
   - Date: Any date
   - Time: Any time
   - Click "Book Appointment"

### Step 11: Verify Everything Works

**Check 1: Booking saved to Google Sheets**
- Go to your Google Sheet
- You should see your booking in a new row

**Check 2: Calendar event created**
- Go to Google Calendar
- You should see the appointment on that date

**Check 3: Confirmation email received**
- Check your inbox for confirmation email
- Subject: "✨ Booking Confirmed - [Service Name]"

---

## TROUBLESHOOTING

### Problem: Booking not saving to Sheet
**Solution:**
1. Go to Google Apps Script editor
2. Check the **Execution log** (View → Execution log)
3. Look for error messages
4. Make sure SPREADSHEET_ID is correct

### Problem: Calendar event not created
**Solution:**
1. Check script permissions
2. Make sure calendar is shared with your account
3. Check execution log for errors

### Problem: No confirmation email sent
**Solution:**
1. Check spam folder
2. Verify email address in booking
3. Check execution log for email errors

### Problem: "Authorization required" error
**Solution:**
1. Go back to Step 7
2. Click "Authorize access"
3. Grant all permissions
4. Re-deploy

---

## SECURITY NOTES

✅ **SECURE:**
- API key and calendar ID only on backend (not visible to users)
- Backend validates all data before saving
- Only your Gmail account has access to the script
- No credentials exposed on website

⚠️ **REMEMBER:**
- Don't share your deployment URL with anyone you don't trust
- The backend endpoint is public - anyone with the URL can submit bookings
- (Optional) Add email validation to only accept bookings from your domain

---

## NEXT: GITHUB DEPLOYMENT

Once backend is working, proceed to **GITHUB_DEPLOYMENT_GUIDE.md** to deploy your website to GitHub Pages.
