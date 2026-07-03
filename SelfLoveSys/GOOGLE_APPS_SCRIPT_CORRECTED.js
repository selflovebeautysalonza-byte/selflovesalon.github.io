// ============================================
// SELF-LOVE BEAUTY SALON - BACKEND
// Google Apps Script for Bookings & Calendar
// CORRECTED VERSION
// ============================================

// CONFIGURATION - UPDATE THESE VALUES
const SPREADSHEET_ID = "PASTE_YOUR_SHEET_ID_HERE"; // From Step 3 (REQUIRED - REPLACE THIS!)
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

// Service pricing (in ZAR) - CORRECTED TO MATCH WEBSITE
const SERVICE_PRICE = {
    'hair': 200,                      // Hair Installation — R200
    'overlay-mani-pedi': 250,         // Overlay Mani & Pedi — R250 (was 150, FIXED)
    'polygel-mani-gel-pedi': 330,     // Polygel Mani & Gel Pedi — R330 (was 180, FIXED)
    'acrylic-nails': 180,             // Acrylic Nails — R180 (was 120, FIXED)
    'nails-cluster-lashes': 300,      // Nails & Cluster Lashes — R300 (was 250, FIXED)
    'classic-lashes': 400,            // Classic Lashes — R400 (was 140, FIXED)
    'hybrid-lashes': 400              // Hybrid Lashes — R400 (was 160, FIXED)
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
        const description = `Booking ID: ${bookingId}
Client: ${bookingData.name}
Email: ${bookingData.email}
Phone: ${bookingData.phone || "N/A"}
Service: ${serviceName}
Notes: ${bookingData.notes || "None"}
Price: R${SERVICE_PRICE[bookingData.service] || "N/A"}`;
        
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
// SEND CONFIRMATION EMAIL - CORRECTED
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
        
        const htmlBody = `<!DOCTYPE html>
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
</html>`;
        
        // FIXED: Removed problematic 'from' parameter
        // GmailApp automatically sends from the account running the script
        GmailApp.sendEmail(bookingData.email, subject, "", {
            htmlBody: htmlBody
        });
        
        Logger.log("✅ Confirmation email sent to: " + bookingData.email);
        
    } catch (error) {
        Logger.log("⚠️ Email error (booking still saved): " + error.toString());
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
