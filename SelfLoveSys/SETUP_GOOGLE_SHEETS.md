# Google Sheets Booking Backend Setup

This guide shows how to create a Google Sheets booking backend using Google Apps Script.

## 1. Create the booking spreadsheet

1. Open [Google Sheets](https://sheets.google.com).
2. Create a new spreadsheet.
3. Rename the first sheet tab to `Bookings`.
4. Add this header row in row 1:

   | Timestamp | Name | Email | Phone | Service | Date | Time | Notes | Status |
   |-----------|------|-------|-------|---------|------|------|-------|--------|

## 2. Create the Apps Script backend

1. In the spreadsheet, open `Extensions` → `Apps Script`.
2. Delete any starter code if present.
3. Copy the contents of `google_apps_script_backend.gs` into the editor.
4. Save the project.

## 3. Deploy as a web app

1. Click `Deploy` → `New deployment`.
2. Choose `Web app`.
3. Enter a description like `Self-Love Booking Backend`.
4. Set `Execute as` to `Me`.
5. Set `Who has access` to `Anyone` or `Anyone, even anonymous`.
6. Click `Deploy`.
7. Copy the Web App URL.

## 4. Connect the front-end

1. Open `script.js` in this repository.
2. Replace the placeholder value for `BACKEND_URL` with the Web App URL.

Example:

```js
const BACKEND_URL = 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec';
```

## 5. How the backend works

- `GET ?action=getBookings&date=YYYY-MM-DD` returns bookings for a date.
- `POST` with JSON `{ action: 'createBooking', booking: { ... } }` stores a new booking.

## 6. Notes

- Booking storage is handled in Google Sheets.
- The site will still fallback to `localStorage` if backend calls fail.
- No email confirmation is sent by default.
- If using GitHub Pages, the web app must be deployed with public access.
