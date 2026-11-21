# Receipt Feature Enhancement Plan

## Status Tracking

- [x] Analyze reference receipt (`aji-reciept.pdf`)
- [x] Plan approved by user

## Implementation Steps

### Step 1: Update Booking type to include `paymentMode` and `remarks`
- [x] Add `paymentMode: string` and `remarks: string` to the Booking type definition
- [x] Update seed bookings data with these fields

### Step 2: Update Create Booking form modal
- [x] Add "Payment Mode" dropdown (BANK TRANSFER, CASH, CARD, UPI, CHEQUE)
- [x] Add "Remarks" textarea field
- [x] Update `addBooking` to capture new fields

### Step 3: Rewrite `downloadReceipt` function
- [x] Generate HTML-based receipt that matches reference PDF exactly
- [x] Include: Company header with address/phone, Receipt title, Date/Receipt No, Received sum, On account of, Payment Mode, Total Closing Amount, Balance to pay, Part payment from, Group info, Payment Accepted by, Previous Payments, Remarks, Footer disclaimer
- [x] Opens in new tab for printing/saving as PDF

### Step 4: Verify implementation
- [x] All fields from reference receipt are present
- [x] Date format matches DD/MM/YYYY
- [x] Receipt No format matches TMH/21/DDMMYYYY
- [x] Company details match reference

