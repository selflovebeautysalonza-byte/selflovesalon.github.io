const SHEET_NAME = 'Bookings';
const HEADERS = ['Timestamp', 'Name', 'Email', 'Phone', 'Service', 'Date', 'Time', 'Notes', 'Status'];

function doGet(e) {
  const action = e.parameter.action;
  if (!action) return jsonResponse({ success: false, message: 'Missing action' });

  if (action === 'getBookings') {
    return getBookings(e.parameter.date);
  }

  return jsonResponse({ success: false, message: 'Unknown action' });
}

function doPost(e) {
  const payload = parseJson(e.postData.contents);
  if (!payload || !payload.action) {
    return jsonResponse({ success: false, message: 'Invalid request body' });
  }

  if (payload.action === 'createBooking') {
    return createBooking(payload.booking);
  }

  return jsonResponse({ success: false, message: 'Unknown action' });
}

function getBookings(date) {
  if (!date) {
    return jsonResponse({ success: false, message: 'Missing date parameter' });
  }

  const sheet = getBookingSheet();
  const rows = sheet.getDataRange().getValues();
  const headerRow = rows.shift();

  const dateIndex = headerRow.indexOf('Date');
  if (dateIndex < 0) {
    return jsonResponse({ success: false, message: 'Sheet header is missing Date column' });
  }

  const bookings = rows
    .filter(row => row[dateIndex] === date)
    .map(row => rowToBooking(row));

  return jsonResponse({ success: true, bookings: bookings });
}

function createBooking(booking) {
  if (!booking || !booking.name || !booking.date || !booking.time) {
    return jsonResponse({ success: false, message: 'Missing booking fields' });
  }

  const sheet = getBookingSheet();
  const nextRow = sheet.getLastRow() + 1;
  const row = [
    getTimestamp(),
    booking.name,
    booking.email || '',
    booking.phone || '',
    booking.service || '',
    booking.date,
    booking.time,
    booking.notes || '',
    'confirmed'
  ];

  sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
  return jsonResponse({ success: true, booking: booking });
}

function getBookingSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
  return sheet;
}

function rowToBooking(row) {
  return {
    timestamp: row[0],
    name: row[1],
    email: row[2],
    phone: row[3],
    service: row[4],
    date: row[5],
    time: row[6],
    notes: row[7],
    status: row[8]
  };
}

function getTimestamp() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
